import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {ServiceResponse} from './response.service';
import {IHttpService} from './interface.service';
import {Inject} from '@angular/core';
import {LogConfig} from '../config/log.config';

export abstract class AbstractHttpService<T> implements IHttpService<T> {

  protected getHttp(): HttpClient {
    return this.http;
  }

  protected getLogger(): NGXLogger {
    return this.logger;
  }

  protected constructor(@Inject(HttpClient) private http: HttpClient, @Inject(NGXLogger) private logger: NGXLogger) {
    http || throwError('Could not inject HttpClient!');
    logger || throwError('Could not inject logger!');
    logger.updateConfig(LogConfig);
  }

  private handleResponseErrorDelegate: (res: any, redirect?: any) => Observable<T>;
  public setHandleResponseErrorDelegate(delegate: (res: any, redirect?: any) => Observable<T>) {
    this.handleResponseErrorDelegate = delegate;
  }

  protected handleResponseError(res: any, redirect?: any): Observable<T> {
    const errors = [];
    if (res instanceof HttpErrorResponse) {
      if (res.error.error_description) {
        errors.push(res.error.error_description);
      }
    } else {
      errors.push('Something went wrong.');
    }
    return of(this.parseResponse(new ServiceResponse(false, res, redirect, errors, [])));
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
  }): Observable<T> {
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
  }): Observable<T> {
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
  }): Observable<T> {
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
  }): Observable<T> {
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
  }): Observable<T> {
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
  }): Observable<T> {
    let _this: AbstractHttpService<T>;
    _this = this;
    return _this.getHttp().request(method, url, options)
      .pipe(map((res) => {
          _this.getLogger().debug('Response', res);
          return res;
        }),
        map((res) => _this.parseResponse(new ServiceResponse(
          true, res, options.redirectSuccess, [], options.messages))),
        catchError((res) => (!!_this.handleResponseErrorDelegate
          ? _this.handleResponseError(res, options.redirectFailure)
          : _this.handleResponseErrorDelegate(res, options.redirectFailure))),
      );
  }

  abstract parseResponse(serviceResponse?: ServiceResponse): T;
}
