import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {ServiceResponse} from './response.service';
import {IDbService, IHttpService} from './interface.service';
import {Inject} from '@angular/core';
import {LogConfig} from '../config/log.config';

/**
 * Abstract HTTP service
 * @param <T> entity type
 */
export abstract class AbstractHttpService<T> implements IHttpService<T> {

    protected getHttp(): HttpClient {
        return this.http;
    }

    protected getLogger(): NGXLogger {
        return this.logger;
    }

    protected getDbService(): IDbService<T> {
        return this.dbService;
    }

    protected constructor(@Inject(HttpClient) private http: HttpClient,
                          @Inject(NGXLogger) private logger: NGXLogger,
                          private dbService: IDbService<T>) {
        http || throwError('Could not inject HttpClient!');
        logger || throwError('Could not inject logger!');
        logger.updateConfig(LogConfig);
        if (!dbService) {
            this.getLogger().warn('Could not found database service for offline mode!');
        }
    }

    private handleResponseErrorDelegate: (url: string, method?: string, res?: any, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }) => Observable<T | T[]>;

    public setHandleResponseErrorDelegate(delegate: (url: string, method?: string, res?: any, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }) => Observable<T | T[]>) {
        this.handleResponseErrorDelegate = delegate;
    }

    private handleOfflineModeDelegate: (url: string, method?: string, res?: any, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }) => Observable<T | T[]>;

    public setHandleOfflineModeDelegate(delegate: (url: string, method?: string, res?: any, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }) => Observable<T | T[]>) {
        this.handleOfflineModeDelegate = delegate;
    }

    protected handleResponseError(url: string, method?: string, res?: any, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }): Observable<T | T[]> {
        const errors = [];
        if (res && res instanceof HttpErrorResponse) {
            // for handling offline mode
            if (res.status > 500 && this.getDbService()) {
                return of(typeof this.handleOfflineModeDelegate === 'function'
                    ? this.handleOfflineModeDelegate.apply(this, [url, method, res, options])
                    : this.handleOfflineMode(url, method, res, options));

            } else if (res.error.error_description) {
                errors.push(res.error.error_description);
            }

        } else {
            errors.push('Something went wrong.');
        }
        return of(this.parseResponse(new ServiceResponse(false, res, options.redirectFailure, errors, [])));
    }

    public post(url: string, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }): Observable<T | T[]> {
        return this.request(url, 'POST', options);
    }

    public get(url: string, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }): Observable<T | T[]> {
        return this.request(url, 'GET', options);
    }

    public del(url: string, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }): Observable<T | T[]> {
        return this.request(url, 'DELETE', options);
    }

    public head(url: string, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }): Observable<T | T[]> {
        return this.request(url, 'HEAD', options);
    }

    public path(url: string, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }): Observable<T | T[]> {
        return this.request(url, 'PATH', options);
    }

    public request(url: string, method?: string, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }): Observable<T | T[]> {
        // detect connection before requesting
        let _this: AbstractHttpService<T>;
        _this = this;
        return _this.getHttp().request(method, url, options)
            .pipe(map((res) => {
                    _this.getLogger().debug('Response', res);
                    return res;
                }),
                map((res) => _this.parseResponse(new ServiceResponse(
                    true, res, options.redirectSuccess, [], options.messages))),
                catchError((res) => (typeof _this.handleResponseErrorDelegate === 'function'
                    ? _this.handleResponseErrorDelegate(url, method, res, options)
                    : _this.handleResponseError(url, method, res, options))),
            );
    }

    abstract parseResponse(serviceResponse?: ServiceResponse): T | T[];

    abstract handleOfflineMode(url: string, method?: string, res?: any, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body';
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }): T | T[];
}
