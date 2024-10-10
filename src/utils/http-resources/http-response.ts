import { HttpError } from './http-error';

export class HttpResponse<T = unknown> {
    success: boolean;

    body?: T;

    errors?: Array<HttpError>;
}
