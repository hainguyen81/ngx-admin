import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ComponentFactoryResolver, ComponentRef, ViewContainerRef} from '@angular/core';

/**
 * The interface for component
 * @param <T> component type
 */
export declare interface IComponentService<T> {
    /**
     * Get the {ComponentFactoryResolver} instance to resolve component type
     * @return the {ComponentFactoryResolver} instance
     */
    getFactoryResolver(): ComponentFactoryResolver;

    /**
     * Get the {ViewContainerRef} instance to create and add component
     */
    getViewContainerRef(): ViewContainerRef;

    /**
     * Resolve (create) and add component to {ViewContainerRef}
     * @return the new created component
     */
    resolve(): ComponentRef<T>;
}

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
        observe?: 'body' | 'events' | 'response' | any;
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | any;
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
     * Get all entities
     * @return a Promise of entities array
     */
    getAll(): Promise<T[]>;

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
     * Delete the specified entity out of database pernamently
     * @param entity to delete
     * @return a Promise of affected records number
     */
    deletePernament(entity: T): Promise<number>;

    /**
     * Update the specified entity into database
     * @param entity to update
     * @return a Promise of affected records number
     */
    update(entity: T): Promise<number>;

    /**
     * Get the number of records in database
     * @return the number of records in database
     */
    count(): Promise<number>;

    /**
     * TODO ngx-indexed-db v5.0.2
     * Open cursor by the specified key range
     * @param cursorCallback cursor callback for handling
     * @param keyRange key range for filtering
     */
    openCursor(cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange): Promise<void>;
    /**
     * TODO ngx-indexed-db v5.0.2
     * Open a cursor by index filter.
     * @param indexName The index name to filter.
     * @param keyRange The range value and criteria to apply on the index.
     * @param cursorCallback A callback called when done.
     */
    openCursorByIndex(indexName: string,
                      keyRange: IDBKeyRange,
                      cursorCallback: (event: Event) => void): Promise<void>;
    /**
     * TODO ngx-indexed-db v5.0.2
     * Returns all items by an index.
     * @param indexName The index name to filter
     * @param keyRange  The range value and criteria to apply on the index.
     */
    getAllByIndex(indexName: string, keyRange: IDBKeyRange): Promise<T[]>;
}
