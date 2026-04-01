import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersService, PaginatedUsers } from './interfaces/users-service.interface';
import { UserRole } from '../common/enums/user-role.enum';
import { UserStatus } from '../common/enums/user-status.enum';
import { FilterDto } from '../common/dto/filter.dto';
import { buildQueryOptions } from '../common/helpers/query-builder.helper';

// SOLID - S (Single Responsibility): Este servicio solo maneja la logica
// de negocio de usuarios. No sabe nada de HTTP ni de como se muestra la info.
//
// SOLID - D (Dependency Inversion): Implementa la interfaz IUsersService.
// El controller usa la interfaz, no esta clase directamente.
@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Campos seguros a retornar (nunca password_hash)
  private readonly SELECT_FIELDS: (keyof User)[] = [
    'id', 'username', 'email', 'rol_principal', 'estado',
    'pais', 'riot_verificado', 'riot_id', 'fecha_registro',
  ];

  // Campos sobre los que aplica el searchValue (búsqueda en tiempo real)
  private readonly SEARCH_FIELDS: (keyof User & string)[] = ['username', 'email'];

  async findAll(filterDto: FilterDto): Promise<PaginatedUsers> {
    const options = buildQueryOptions<User>(
      filterDto,
      this.SEARCH_FIELDS,
      this.SELECT_FIELDS,
    );

    const [rows, count] = await this.userRepository.findAndCount(options);
    return { rows, count };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'rol_principal',
        'estado',
        'pais',
        'riot_verificado',
        'riot_id',
        'fecha_registro',
      ],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username: rest.username }, { email: rest.email }],
    });

    if (existingUser) {
      throw new ConflictException('El username o email ya esta en uso');
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({
      ...rest,
      password_hash,
      rol_principal: rest.rol_principal ?? UserRole.USUARIO,
      estado: rest.estado ?? UserStatus.ACTIVO,
      riot_id: rest.riot_id ?? null,
      riot_verificado: false,
    });

    const savedUser = await this.userRepository.save(user);

    const { password_hash: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    if (updateUserDto.password) {
      const saltRounds = 10;
      user.password_hash = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    if (updateUserDto.username) user.username = updateUserDto.username;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.pais) user.pais = updateUserDto.pais;
    if (updateUserDto.rol_principal) user.rol_principal = updateUserDto.rol_principal;
    if (updateUserDto.estado) user.estado = updateUserDto.estado;
    if (updateUserDto.riot_id !== undefined) user.riot_id = updateUserDto.riot_id;

    const updated = await this.userRepository.save(user);

    const { password_hash: _, ...userWithoutPassword } = updated;
    return userWithoutPassword as User;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    await this.userRepository.remove(user);
  }
}
