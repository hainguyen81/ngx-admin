import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {ICustomer, CUSTOMER_STATUS} from '../../../@core/data/customer';
import {AbstractHttpService} from '../../http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServiceResponse} from '../../response.service';
import JsonUtils from '../../../utils/json.utils';
import {AbstractDbService} from '../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {Observable, throwError} from 'rxjs';

@Injectable()
export class CustomerDbService extends AbstractDbService<ICustomer> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.customer);
    }

    getAll(): Promise<ICustomer[]> {
        return super.getAll();
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: ICustomer[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            args[0].status = CUSTOMER_STATUS.LOCKED;
            this.updateExecutor.apply(this, [resolve, reject, ...args]);
        } else resolve(0);
    }

    updateExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: ICustomer[]) => {
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
export class CustomerHttpService extends AbstractHttpService<ICustomer, ICustomer> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(CustomerDbService) dbService: CustomerDbService) {
        super(http, logger, dbService);
        dbService || throwError('Could not inject user database service for offline mode');
    }

    parseResponse(serviceResponse?: ServiceResponse): ICustomer {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        return JsonUtils.parseResponseJson(serviceResponse.getResponse().body) as ICustomer;
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
    }): Observable<ICustomer[] | ICustomer> {
        return undefined;
    }
}
