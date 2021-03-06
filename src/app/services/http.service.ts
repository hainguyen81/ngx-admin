import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {ServiceResponse} from './response.service';
import {IDbService, IHttpService} from './interface.service';
import {Inject} from '@angular/core';
import {LogConfig} from '../config/log.config';
import {isArray} from 'util';
import {Cacheable} from 'ngx-cacheable';

/**
 * Abstract HTTP service
 * @param <T> entity type
 */
export abstract class AbstractHttpService<T, K> implements IHttpService<T> {

    protected getHttp(): HttpClient {
        return this.http;
    }

    protected getLogger(): NGXLogger {
        return this.logger;
    }

    protected getDbService(): IDbService<K> {
        return this.dbService;
    }

    protected constructor(@Inject(HttpClient) private http: HttpClient,
                          @Inject(NGXLogger) private logger: NGXLogger,
                          private dbService: IDbService<K>) {
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
        // for handling offline mode
        if ((res && res instanceof HttpErrorResponse
            && (res.status === 0 || res.status > 500) && this.getDbService())
            || (res && !(res instanceof HttpErrorResponse))) {
            return typeof this.handleOfflineModeDelegate === 'function'
                ? this.handleOfflineModeDelegate.apply(this, [url, method, res, options])
                : this.handleOfflineMode(url, method, res, options);

        } else if (res && res instanceof HttpErrorResponse
            && res.error && (res.error.error_description || '').length) {
            errors.push(res.error.error_description);

        } else if (res && res instanceof HttpErrorResponse && res.error) {
            errors.push(res.error);

        } else {
            errors.push(res);
        }
        return of(this.parseResponse(new ServiceResponse(false, res, options.redirectFailure, errors, [])));
    }

    @Cacheable()
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

    @Cacheable()
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

    @Cacheable()
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

    @Cacheable()
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

    @Cacheable()
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

    @Cacheable()
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
        let _this: AbstractHttpService<T, K>;
        _this = this;
        return _this.getHttp().request(method, url, options)
            .pipe(map((res) => {
                    _this.getLogger().debug('Response', res);
                    return res;
                }),
                map((res) => {
                    return of(_this.parseResponse(new ServiceResponse(
                        true, res, options.redirectSuccess, [], options.messages)));
                }),
                catchError((res: HttpErrorResponse) => {
                    let observer: Observable<T | T[]>;
                    observer = (typeof _this.handleResponseErrorDelegate === 'function'
                        ? _this.handleResponseErrorDelegate(url, method, res, options)
                        : _this.handleResponseError(url, method, res, options));
                    return (observer ? observer.pipe(map((value: T[] | T) => {
                        let tokens: T[];
                        tokens = [];
                        if (!isArray(value) && value) {
                            tokens.push(value as T);
                        } else if (isArray(value)) {
                            tokens = tokens.concat(value as T[]);
                        }
                        if (tokens && tokens.length) {
                            return tokens[0];
                        }
                        return undefined;
                    })) : of(undefined));
                }),
            );
    }

    abstract parseResponse(serviceResponse?: ServiceResponse): T;

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
    }): Observable<T | T[]>;
}
