import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

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
    }): Observable<T | T[]>;
}

export declare interface IDbService<T> {
    findEntities(criteria?: any): Promise<T[]>;

    findById(id?: any): Promise<T>;

    insert(entity: T): Promise<number>;

    delete(entity: T): Promise<number>;

    update(entity: T): Promise<number>;
}
