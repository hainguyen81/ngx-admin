import {Inject, Injectable, InjectionToken, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AbstractHttpInterceptor} from './abstract.http.interceptor';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';
import {timeout as opTimeout} from 'rxjs/operators';

export const HTTP_REQUEST_TIMEOUT = new InjectionToken<number>('The default request timeout to apply');

@Injectable({ providedIn: 'any' })
export class TimeoutInterceptor extends AbstractHttpInterceptor {

    public get timeout() {
        return Math.max(this._timeout, 0);
    }

    constructor(_injector: Injector,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(HTTP_REQUEST_TIMEOUT) private _timeout?: number | 10) {
        super(_injector, _logger, null);
    }

    protected doIntercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const timeoutValue = req.headers.get('timeout') || this.timeout;
        const timeoutValueNumeric = Number(timeoutValue);
        return next.handle(req).pipe(opTimeout(timeoutValueNumeric));
    }
}
