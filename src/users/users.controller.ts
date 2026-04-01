import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { type IUsersService, USERS_SERVICE } from './interfaces/users-service.interface';
import { FilterDto, SortOrder } from '../common/dto/filter.dto';
import { buildResponse, buildPaginatedResponse } from '../common/helpers/api-response.helper';

// SOLID - S (Single Responsibility): El controller solo se encarga de
// recibir peticiones HTTP y devolver respuestas. No tiene logica de negocio.
//
// SOLID - D (Dependency Inversion): Depende de la INTERFAZ IUsersService,
// no de UsersService directamente. Si manana cambias la implementacion,
// este archivo NO necesita modificarse.
@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE)
    private readonly usersService: IUsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios paginados con filtros' })
  @ApiQuery({ name: 'page',        required: false, example: 1,          description: 'Número de página' })
  @ApiQuery({ name: 'limit',       required: false, example: 10,         description: 'Registros por página' })
  @ApiQuery({ name: 'sort',        required: false, description: 'Columna por la que ordenar (ej: username, email, fecha_registro)' })
  @ApiQuery({ name: 'order',       required: false, enum: SortOrder,     description: 'Dirección del orden: asc o desc', example: SortOrder.ASC })
  @ApiQuery({ name: 'searchValue', required: false, description: 'Búsqueda en tiempo real por username o email' })
  @ApiResponse({ status: 200, description: 'Lista paginada de usuarios retornada exitosamente' })
  async findAll(@Query() filterDto: FilterDto) {
    const { rows, count } = await this.usersService.findAll(filterDto);
    return buildPaginatedResponse(rows, count, filterDto.page ?? 1, filterDto.limit ?? 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', example: 'a1b2c3d4-...' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return buildResponse(user, HttpStatus.OK);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El username o email ya existe' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return buildResponse(user, HttpStatus.CREATED);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return buildResponse(user, HttpStatus.OK, 'Registro actualizado exitosamente');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return buildResponse(null, HttpStatus.OK, 'Registro eliminado exitosamente');
  }
}
