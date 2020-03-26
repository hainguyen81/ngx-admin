import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {AbstractHttpService} from '../../../http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServiceResponse} from '../../../response.service';
import JsonUtils from '../../../../utils/json.utils';
import {AbstractDbService} from '../../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {Observable, throwError} from 'rxjs';
import {IWarehouseAdjustDetail} from '../../../../@core/data/warehouse/warehouse.adjust.detail';

@Injectable()
export class WarehouseAdjustDetailDbService extends AbstractDbService<IWarehouseAdjustDetail> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse);
    }

    getAll(): Promise<IWarehouseAdjustDetail[]> {
        return super.getAll();
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IWarehouseAdjustDetail[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            args[0].deletedAt = (new Date()).getTime();
            this.updateExecutor.apply(this, [resolve, reject, ...args]);
        } else resolve(0);
    }
}

@Injectable()
export class WarehouseAdjustDetailHttpService
    extends AbstractHttpService<IWarehouseAdjustDetail, IWarehouseAdjustDetail> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseAdjustDetailDbService) dbService: WarehouseAdjustDetailDbService) {
        super(http, logger, dbService);
        dbService || throwError('Could not inject user database service for offline mode');
    }

    parseResponse(serviceResponse?: ServiceResponse): IWarehouseAdjustDetail {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        return JsonUtils.parseResponseJson(serviceResponse.getResponse().body) as IWarehouseAdjustDetail;
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
    }): Observable<IWarehouseAdjustDetail[] | IWarehouseAdjustDetail> {
        return undefined;
    }
}
