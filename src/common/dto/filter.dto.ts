import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// Extiende PaginationDto para que todos los endpoints tengan
// page + limit + sort + order + searchValue de forma genérica.
export class FilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Columna por la que ordenar los resultados',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Dirección del ordenamiento',
    enum: SortOrder,
    example: SortOrder.ASC,
    default: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional({
    description: 'Búsqueda en tiempo real sobre los campos principales',
  })
  @IsOptional()
  @IsString()
  searchValue?: string;
}
