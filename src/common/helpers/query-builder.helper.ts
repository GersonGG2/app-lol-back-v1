import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  ObjectLiteral,
} from 'typeorm';
import { FilterDto } from '../dto/filter.dto';

/**
 * Construye FindManyOptions de TypeORM de forma genérica.
 *
 * @param filterDto   - DTO con page, limit, sort, order, searchValue
 * @param searchFields - Campos del entity sobre los que aplica el searchValue (ILike)
 * @param selectFields - Campos a retornar (omite password_hash, etc.)
 *
 * Uso en cualquier servicio:
 *   const options = buildQueryOptions<MyEntity>(filterDto, ['name', 'email'], ['id', 'name']);
 *   const [rows, count] = await this.repo.findAndCount(options);
 */
export function buildQueryOptions<T extends ObjectLiteral>(
  filterDto: FilterDto,
  searchFields: (keyof T & string)[],
  selectFields?: (keyof T)[],
): FindManyOptions<T> {
  const { page = 1, limit = 10, sort, order = 'asc', searchValue } = filterDto;
  const skip = (page - 1) * limit;

  const options: FindManyOptions<T> = {
    skip,
    take: limit,
  };

  // Campos a seleccionar (evita exponer campos sensibles)
  if (selectFields?.length) {
    options.select = selectFields as unknown as FindOptionsSelect<T>;
  }

  // Ordenamiento dinámico por cualquier columna
  if (sort) {
    options.order = {
      [sort]: order.toUpperCase(),
    } as FindOptionsOrder<T>;
  }

  // Búsqueda en tiempo real: OR entre todos los searchFields con ILike
  if (searchValue?.trim() && searchFields.length > 0) {
    options.where = searchFields.map((field) => ({
      [field]: ILike(`%${searchValue.trim()}%`),
    })) as FindOptionsWhere<T>[];
  }

  return options;
}
