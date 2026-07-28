import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();


    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || 'Http Exception';
        details = responseObj;

      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      details = {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      };
    } else {
      message = 'Unknown error';
      details = {
        error: String(exception),
      };
    }

    const errorResponse = {
      statusCode: status,
      message,
      timestamp,
      path: request.url,
      method: request.method,
      ...(Object.keys(details).length > 0 ? { details } : {}),
    };


    response.status(status).json(errorResponse);
  }
}
