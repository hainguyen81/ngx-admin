import {Inject, Injectable, InjectionToken, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AbstractHttpInterceptor} from './abstract.http.interceptor';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';

export const HTTP_REQUEST_HEADERS = new InjectionToken<HttpHeaders | { [header: string]: string | string[]; }>(
    'The default request header to apply such as CORS');

@Injectable({ providedIn: 'any' })
export class RequestHeadersInterceptor extends AbstractHttpInterceptor {

    public get headers() {
        return this._headers;
    }

    constructor(_injector: Injector,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(HTTP_REQUEST_HEADERS)
                private _headers?: HttpHeaders | { [header: string]: string | string[]; }) {
        super(_injector, _logger, null);
    }

    protected doIntercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req && this.headers) {
            let httpHeaders: HttpHeaders;
            if (this.headers instanceof HttpHeaders) {
                httpHeaders = <HttpHeaders>this.headers;
            } else {
                httpHeaders = new HttpHeaders(<{ [header: string]: string | string[]; }>this.headers);
            }
            httpHeaders.keys().forEach(key => {
                // remove existed headers for non-overriding
                if (!req.headers.has(key)) {
                    req.headers.set(key, httpHeaders.get(key));
                }
            });
        }
        return next.handle(req);
    }
}
