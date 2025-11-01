import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof RpcException) {
          return throwError(() => error);
        }

        if (error instanceof UnauthorizedException) {
          return throwError(
            () =>
              new RpcException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: error.message,
                error: 'Unauthorized',
              }),
          );
        }

        if (error instanceof NotFoundException) {
          return throwError(
            () =>
              new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: error.message,
                error: 'Not Found',
              }),
          );
        }

        if (error instanceof BadRequestException) {
          return throwError(
            () =>
              new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
                error: 'Bad Request',
              }),
          );
        }

        if (error instanceof ConflictException) {
          return throwError(
            () =>
              new RpcException({
                statusCode: HttpStatus.CONFLICT,
                message: error.message,
                error: 'Conflict',
              }),
          );
        }

        if (this.isPrismaError(error)) {
          return throwError(() => this.handlePrismaError(error));
        }

        console.error('Unhandled error in microservice:', error);
        return throwError(
          () =>
            new RpcException({
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.message || 'Internal server error',
              error: 'Internal Server Error',
            }),
        );
      }),
    );
  }

  private isPrismaError(
    error: any,
  ): error is Prisma.PrismaClientKnownRequestError {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error?.name === 'PrismaClientKnownRequestError' ||
      (typeof error?.code === 'string' && error.code.startsWith('P'))
    );
  }

  private handlePrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): RpcException {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const target = exception.meta?.target;
        const fields = Array.isArray(target)
          ? target.join(', ')
          : target || 'field';
        message = `There is already a record with that ${fields}`;
        break;
      }

      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      }

      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key restriction violation';
        break;
      }

      case 'P2021': {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Database error: table does not exist';
        break;
      }

      case 'P2014': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid ID';
        break;
      }

      case 'P2016': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Query error';
        break;
      }

      case 'P2000': {
        status = HttpStatus.BAD_REQUEST;
        message = 'The value provided is too long';
        break;
      }

      case 'P2001': {
        status = HttpStatus.NOT_FOUND;
        message = 'The record does not exist';
        break;
      }

      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Database error';
        console.error('Prisma error code:', exception.code, exception);
      }
    }

    return new RpcException({
      statusCode: status,
      message,
      error: exception.code,
    });
  }
}
