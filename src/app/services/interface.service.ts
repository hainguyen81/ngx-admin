import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ServiceResponse} from './response.service';

export declare interface IDbService<T> {
  findEntities(criteria?: any): Observable<T[]>;
  findById(id?: any): Observable<T>;
  insert(entity: T): Observable<number>;
  delete(entity: T): Observable<number>;
  update(entity: T): Observable<number>;
}

export declare interface IHttpService<T> {
  request(url: string, method?: string, options?: {
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
  }): Observable<ServiceResponse>;
}
