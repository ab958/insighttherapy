import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Log } from './entity/log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Log
    ]),
    JwtModule.register({
      global: true,
      secret: 'test', // should come from env
      signOptions: { expiresIn: '600s' }, // should  come from env
    }),
  ],
  providers: [
    UserService,
  ],
  controllers: [UserController]
})
export class UserModule { }
