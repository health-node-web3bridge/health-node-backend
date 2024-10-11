import { HttpError } from './http-error.js';
import { HttpResponse } from './http-response.js';

export class HttpResponseMapper {
    static map<T>(body?: T, errors?: HttpError): HttpResponse<T> {
        return {
            success: !errors,
            body,
        };
    }
}
