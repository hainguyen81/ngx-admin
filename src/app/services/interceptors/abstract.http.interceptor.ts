import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Inject, Injectable, Injector} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {Observable, throwError} from 'rxjs';
import {NbAuthSimpleInterceptor} from '@nebular/auth';

@Injectable()
export abstract class AbstractHttpInterceptor extends NbAuthSimpleInterceptor implements HttpInterceptor {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected getInjector() {
        return this._injector;
    }

    protected get logger() {
        return this._logger;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractHttpInterceptor}
     * @param _injector {Injector}
     * @param _logger {NGXLogger}
     * @param headerName request header name for applying token if necessary
     */
    protected constructor(private _injector: Injector,
                          @Inject(NGXLogger) private _logger: NGXLogger,
                          headerName?: string) {
        super(_injector, headerName);
        _injector || throwError('Could not inject Injector instance');
        _logger || throwError('Could not inject NGXLogger instance');
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Intercept the present specified request {HttpRequest}
     * @param req to intercept
     * @param next for next intercept
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.logger.debug('Intercept HTTP', req);
        return this.doIntercept(req, next);
    }

    /**
     * Alias of {AbstractHttpInterceptor#intercept}. Perform internal business
     * @param req to intercept
     * @param next for next intercept
     */
    protected abstract doIntercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
