import { Body, Controller, Delete, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, LogInDto, UpdateUserDto } from './dto';
import { AuthNGuard } from 'src/shared/guards/authN.guard';
import { LoggerInterceptor } from 'src/shared/interceptor/logger.interceptor';

@UseInterceptors(LoggerInterceptor)
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('/create-user')
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }

    @Post('/log-in')
    async logIn(@Body() logInDto: LogInDto) {
        return await this.userService.logIn(logInDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthNGuard)
    @Patch('/update-user')
    async update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
        return this.userService.update(updateUserDto, req.user)
    }

    @ApiBearerAuth()
    @UseGuards(AuthNGuard)
    @Delete('/delete-account')
    async delete(@Req() req) {
        return this.userService.delete(req.user)
    }
}
