import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * The interface for HTTP service
 * @param <T> entity type
 */
export declare interface IHttpService<T> {
    /**
     * Send request to the specified URL
     * @param url to send
     * @param method HTTP method
     * @param options HTTP request options
     * @return an Observable of response
     */
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

/**
 * The interface for IndexedDb service
 * @param <T> entity type
 */
export declare interface IDbService<T> {
    /**
     * Find all entities by the specified criteria
     * @param criteria to filter
     * @return a Promise of entities array
     */
    findEntities(criteria?: any): Promise<T[]>;

    /**
     * Find entity by the specified identity
     * @param id to filter
     * @return a Promise of entity
     */
    findById(id?: any): Promise<T>;

    /**
     * Insert the specified entity into database
     * @param entity to insert
     * @return a Promise of affected records number
     */
    insert(entity: T): Promise<number>;

    /**
     * Delete the specified entity out of database
     * @param entity to delete
     * @return a Promise of affected records number
     */
    delete(entity: T): Promise<number>;

    /**
     * Update the specified entity into database
     * @param entity to update
     * @return a Promise of affected records number
     */
    update(entity: T): Promise<number>;
}
