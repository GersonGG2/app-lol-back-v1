import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HTTP_MESSAGES } from '../helpers/api-response.helper';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = HTTP_MESSAGES[HttpStatus.INTERNAL_SERVER_ERROR];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Si NestJS trae un mensaje personalizado (ej. NotFoundException), lo usamos.
      // Si no, usamos el mensaje genérico del mapa.
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const resp = exceptionResponse as Record<string, unknown>;
        message =
          typeof resp['message'] === 'string'
            ? resp['message']
            : Array.isArray(resp['message'])
              ? (resp['message'] as string[]).join(', ')
              : HTTP_MESSAGES[status] ?? message;
      }
    }

    response.status(status).json({
      data: null,
      message,
      status,
    });
  }
}
