import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';

// SOLID - S (Single Responsibility): Este DTO solo tiene la responsabilidad
// de validar y transportar los datos para CREAR un usuario.
export class CreateUserDto {
  @ApiProperty({ example: 'GersonCarrillo', description: 'Nombre de usuario unico' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  username: string;

  @ApiProperty({ example: 'gerson@correo.com', description: 'Correo electronico unico' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'MiPassword123', description: 'Contrasena (minimo 6 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'MX', description: 'Codigo de pais ISO 2 letras (MX, US, GT...)' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  pais: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.USUARIO, description: 'Rol del usuario' })
  @IsEnum(UserRole)
  @IsOptional()
  rol_principal?: UserRole;

  @ApiPropertyOptional({ enum: UserStatus, default: UserStatus.ACTIVO, description: 'Estado de la cuenta' })
  @IsEnum(UserStatus)
  @IsOptional()
  estado?: UserStatus;

  @ApiPropertyOptional({ example: 'GersonNA1', description: 'ID de Riot Games (opcional)' })
  @IsString()
  @IsOptional()
  riot_id?: string;
}
