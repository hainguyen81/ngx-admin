import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject} from '@angular/core';
import {COMMON} from '../app.config';
import {NGXLogger} from 'ngx-logger';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {ServiceResponse} from './response.service';
import {IHttpService} from './interface.service';

export abstract class AbstractHttpService<T> implements IHttpService<T> {

  private readonly http: HttpClient;
  protected getHttp(): HttpClient {
    return this.http;
  }

  @Inject(NGXLogger) private logger: NGXLogger;
  protected getLogger(): NGXLogger {
    return this.logger;
  }

  protected constructor(http: HttpClient) {
    this.http = http;
    this.getLogger().updateConfig({ level: COMMON.log.level, serverLogLevel: COMMON.log.serverLogLevel });
  }

  protected handleResponseError(res: any, redirect?: any): Observable<ServiceResponse> {
    const errors = [];
    if (res instanceof HttpErrorResponse) {
      if (res.error.error_description) {
        errors.push(res.error.error_description);
      }
    } else {
      errors.push('Something went wrong.');
    }
    return of(new ServiceResponse(false, res, redirect, errors, []));
  }

  public post(url: string, options?: {
    body?: T;
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
  }): Observable<ServiceResponse> {
    return this.request(url, 'POST', options);
  }

  public get(url: string, options?: {
    body?: T;
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
  }): Observable<ServiceResponse> {
    return this.request(url, 'GET', options);
  }

  public del(url: string, options?: {
    body?: T;
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
  }): Observable<ServiceResponse> {
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
  }): Observable<ServiceResponse> {
    return this.request(url, 'HEAD', options);
  }

  public path(url: string, options?: {
    body?: T;
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
  }): Observable<ServiceResponse> {
    return this.request(url, 'PATH', options);
  }

  public request(url: string, method?: string, options?: {
    body?: T;
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
  }): Observable<ServiceResponse> {
    let _this: AbstractHttpService<T>;
    _this = this;
    return _this.getHttp().request(method, url, options)
      .pipe(map((res) => {
          _this.getLogger().debug('Response', res);
          return res;
        }),
        map((res) => new ServiceResponse(
          true, res, options.redirectSuccess, [], [])),
        catchError((res) => _this.handleResponseError(res, options.redirectFailure)),
      );
  }
}
