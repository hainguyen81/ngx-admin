import {AbstractDbService, PromiseExecutor} from '../../database.service';
import {ICategories} from '../../../@core/data/warehouse_catelogies';
import {Inject, Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {ConnectionService} from 'ng-connection-service';
import {DB_STORE} from '../../../config/db.config';
import {AbstractHttpService} from '../../http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ServiceResponse} from '../../response.service';
import JsonUtils from '../../../utils/json.utils';

@Injectable()
export class CategoriesDbService extends AbstractDbService<ICategories> {
    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_categories);
    }

    getAll(): Promise<ICategories[]> {
        return super.getAll();
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: ICategories[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            // TODO Wait for deleting
        } else resolve(0);
    }

    updateExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: ICategories[]) => {
        if (args && args.length) {
            this.getLogger().debug('Update data', args, 'First data', args[0]);
            this.getDbService().update(this.getDbStore(), args[0])
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error('Could not update data', errors);
                    reject(errors);
                });
        } else resolve(0);
    }
}

@Injectable()
export class CategoriesHttpService extends AbstractHttpService<ICategories, ICategories> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(CategoriesDbService) dbService: CategoriesDbService) {
        super(http, logger, dbService);
        dbService || throwError('Could not inject user database service for offline mode');
    }

    parseResponse(serviceResponse?: ServiceResponse): ICategories {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        return JsonUtils.parseResponseJson(serviceResponse.getResponse().body) as ICategories;
    }

    handleOfflineMode(url: string, method?: string, res?: any, options?: {
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
    }): Observable<ICategories[] | ICategories> {
        return undefined;
    }
}
