import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Inject, InjectionToken, Injector} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {Observable, throwError} from 'rxjs';
import {NbAuthSimpleInterceptor} from '@nebular/auth';
import {isNullOrUndefined} from 'util';

export const HEADER_INTERCEPTOR_TOKEN: InjectionToken<String>
    = new InjectionToken<String>('Request header name interceptor token');

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
     * @param _headerName request header name for applying token if necessary
     */
    protected constructor(private _injector: Injector,
                          private _logger: NGXLogger,
                          @Inject(HEADER_INTERCEPTOR_TOKEN) _headerName: string) {
        super(_injector, _headerName);
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
        this.logger.warn('Just remind: Intercept HTTP{'
            + Reflect.getPrototypeOf(this).constructor.name + '}', req);
        return (this.isSupported(req) ? this.doIntercept(req, next) : next.handle(req));
    }

    /**
     * Alias of {AbstractHttpInterceptor#intercept}. Perform internal business
     * @param req to intercept
     * @param next for next intercept
     */
    protected abstract doIntercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;

    /**
     * Get a boolean value indicating the specified {HttpRequest} should be filtered.
     * TODO Children classes should override this method if they wanna filter request. Default is TRUE
     * @param req to check
     */
    protected isSupported(req: HttpRequest<any>): boolean {
        return !isNullOrUndefined(req);
    }
}
