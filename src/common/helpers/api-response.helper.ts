import { HttpStatus } from '@nestjs/common';
import { ApiResponseData, PaginatedData } from '../interfaces/api-response.interface';

// Mensajes genéricos por código HTTP
export const HTTP_MESSAGES: Record<number, string> = {
  [HttpStatus.OK]: 'Datos encontrados exitosamente',
  [HttpStatus.CREATED]: 'Registro creado exitosamente',
  [HttpStatus.NO_CONTENT]: 'Registro eliminado exitosamente',
  [HttpStatus.BAD_REQUEST]: 'Solicitud incorrecta, verifique los datos enviados',
  [HttpStatus.UNAUTHORIZED]: 'No autorizado, credenciales inválidas',
  [HttpStatus.FORBIDDEN]: 'Acceso prohibido, no tiene permisos suficientes',
  [HttpStatus.NOT_FOUND]: 'Recurso no encontrado',
  [HttpStatus.CONFLICT]: 'Conflicto, el recurso ya existe',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Datos no procesables, verifique el formato',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Error interno del servidor',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Servicio no disponible temporalmente',
};

export function buildResponse<T>(
  data: T,
  status: number,
  message?: string,
): ApiResponseData<T> {
  return {
    data,
    message: message ?? HTTP_MESSAGES[status] ?? 'Operación completada',
    status,
  };
}

export function buildPaginatedResponse<T>(
  rows: T[],
  count: number,
  page: number,
  limit: number,
  status: number = HttpStatus.OK,
  message?: string,
): ApiResponseData<PaginatedData<T>> {
  const pages = Math.ceil(count / limit);
  return {
    data: { count, limit, page, pages, rows },
    message: message ?? HTTP_MESSAGES[status] ?? 'Operación completada',
    status,
  };
}
