import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LogInDto, UpdateUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Log } from './entity/log.entity';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Log) private logRepository: Repository<Log>
    ) { }

    async create(params: CreateUserDto) {
        const { name, password } = params;
        try {
            const userInstance = this.userRepository.create({
                userName: name,
                password: await this.hashPassword(password),
            })
            return this.userRepository.save(userInstance);
        } catch (error) {
            this.logger.error(error)
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async logIn(params: LogInDto) {
        const { name, password } = params;
        try {
            const user = await this.userRepository.findOne({
                where: {
                    userName: name
                }
            });
            if (Object.keys(user).length === 0) {
                throw new NotFoundException();
            }

            const isValid = await this.checkHashMatch(password, user.password);
            if (isValid) {
                const payload = { sub: user.id };

                return {
                    access_token: this.jwtService.sign(payload),
                }
            } else {
                throw new BadRequestException('username or password is not valid')
            }
        } catch (error) {
            this.logger.error(error);
            if (error instanceof Error) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async update(params: UpdateUserDto, userReq) {
        const { name, password } = params;
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: userReq.id
                }
            });
            if (Object.keys(user).length === 0) {
                throw new NotFoundException();
            }

            if (password) {
                user.password = await this.hashPassword(password);
            }
            if (name) {
                user.userName = name;
            }
            return await this.userRepository.save(user);
        } catch (error) {
            this.logger.error(error);
            if (error instanceof Error) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async delete(userReq) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: userReq.id
                }
            });
            if (Object.keys(user).length === 0) {
                throw new NotFoundException();
            }
            await this.userRepository.delete({ id: userReq.id })
            return 'Account Deleted SuccessFully';
        } catch (error) {
            this.logger.error(error);
            if (error instanceof Error) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async saveLog(params: {
        requestUrl: string;
        requestMethod: string;
        userId: number;
    }) {
        const { requestUrl, requestMethod, userId } = params
        try {
            const log = await this.logRepository.create({
                requestMethod,
                requestUrl,
                userId
            });
            await this.logRepository.save(log);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }

    private async checkHashMatch(newPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(newPassword, hashedPassword);
    }

    async verifyToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token, {
                secret: 'test'
            });
            const user = await this.userRepository.findOne({
                where: {
                    id: decoded.sub
                }
            });
            return {
                ...decoded,
                ...user
            };
        } catch (err) {
            console.error('Token verification failed:', err.message);
            throw err;
        }
    }

}
