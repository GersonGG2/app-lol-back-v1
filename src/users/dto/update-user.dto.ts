import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// SOLID - O (Open/Closed): Extendemos CreateUserDto con PartialType,
// haciendo todos los campos opcionales para actualizaciones parciales.
// Abierto para extension, cerrado para modificacion.
export class UpdateUserDto extends PartialType(CreateUserDto) {}
