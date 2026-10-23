import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exception.getError();

    if (typeof error === 'object' && error !== null) {
      const errorObj = error as any;

      const status = errorObj.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = errorObj.message || 'Internal server error';

      response.status(status).json({
        statusCode: status,
        message: Array.isArray(message) ? message : [message],
        error: errorObj.error || 'Error',
        timestamp: new Date().toISOString(),
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: typeof error === 'string' ? error : 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
