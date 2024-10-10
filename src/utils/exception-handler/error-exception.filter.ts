import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    Inject,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';
import { HttpError } from '../http-resources/http-error.js';
import { HttpResponse } from '../http-resources/http-response.js';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger) {}

    async catch(err: Error, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const logData = {
            isFatal: err instanceof InternalServerErrorException,
            exception: err,
            requestBody: request.body,
            requestQuery: request.query,
            requestHeaders: request.headers,
        };

        switch (true) {
            case err instanceof NotFoundException || err instanceof BadRequestException: {
                this.logger.debug(JSON.stringify(logData));
                const errorResponse = err.getResponse();
                const errorCode = err.getStatus();
                const httpErrors = this.getHttpErrorResponse(errorResponse, errorCode);
                const httpResponse: HttpResponse<never> = {
                    success: false,
                    errors: httpErrors,
                };

                response.status(+errorCode).json(httpResponse);
                break;
            }
            default: {
                this.logger.error(JSON.stringify(logData));
                const httpErrors: HttpError[] = [
                    {
                        errorCode: '500',
                        errorMessage: 'Internal server error',
                    },
                ];
                const httpResponse: HttpResponse<never> = {
                    success: false,
                    errors: httpErrors,
                };
                response.status(500).json(httpResponse);
            }
        }
    }

    private getHttpErrorResponse(errorResponse: string | object, errorCode: number) {
        const httpErrors: HttpError[] = [];
        if (typeof errorResponse === 'string') {
            httpErrors.push({
                errorCode: errorCode.toString(),
                errorMessage: errorResponse,
            });
        } else if (typeof errorResponse === 'object' && 'message' in errorResponse) {
            const requestErrors = errorResponse as { message: string | string[] };
            if (Array.isArray(requestErrors.message)) {
                requestErrors.message.forEach(message => {
                    httpErrors.push({
                        errorCode: errorCode.toString(),
                        errorMessage: message,
                    });
                });
            } else {
                httpErrors.push({
                    errorCode: errorCode.toString(),
                    errorMessage: requestErrors.message,
                });
            }
        }
        return httpErrors;
    }
}
