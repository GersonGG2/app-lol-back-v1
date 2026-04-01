import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { USERS_SERVICE } from './interfaces/users-service.interface';

// SOLID - I (Interface Segregation): El modulo registra el token USERS_SERVICE
// ligandolo a UsersService. Asi el controller usa la interfaz y NestJS
// sabe que implementacion inyectar.
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: USERS_SERVICE,
      useClass: UsersService,
    },
  ],
  exports: [USERS_SERVICE],
})
export class UsersModule {}
