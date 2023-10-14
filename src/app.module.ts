import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entity/user.entity';
import { Log } from './user/entity/log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',  // should come from env
      host: 'localhost',  // should come from env
      port: 5432,  // should come from env
      username: 'root',  // should come from env
      password: 'admin',  // should come from env
      database: 'insighttherapy',  // should come from env
      entities: [
        User,
        Log
      ],
      synchronize: true
    }),
    UserModule,
  ],
})
export class AppModule { }
