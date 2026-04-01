import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterDto } from '../../common/dto/filter.dto';

export interface PaginatedUsers {
  rows: User[];
  count: number;
}

// SOLID - D (Dependency Inversion): El controller depende de esta interfaz,
// no de la implementacion concreta. Esto permite cambiar UsersService
// por otra implementacion sin tocar el controller.
export interface IUsersService {
  findAll(filterDto: FilterDto): Promise<PaginatedUsers>;
  findOne(id: string): Promise<User>;
  create(createUserDto: CreateUserDto): Promise<User>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  remove(id: string): Promise<void>;
}

export const USERS_SERVICE = Symbol('IUsersService');
