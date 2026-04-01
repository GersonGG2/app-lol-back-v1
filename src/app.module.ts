import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carga el .env en toda la app
    TypeOrmModule.forRootAsync({ useFactory: databaseConfig }),
    UsersModule,
  ],
})
export class AppModule {}
