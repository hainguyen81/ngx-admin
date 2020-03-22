import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseItemSmartTable} from '../../../@core/data/warehouse-item.smarttable';
import {AbstractHttpService} from '../../http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServiceResponse} from '../../response.service';
import {AbstractDbService} from '../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {Observable} from 'rxjs';
import IWarehouseItemFlipcard from '../../../@core/data/warehouse-item/partial/warehouse-flipcard';

@Injectable({
    providedIn: 'root',
})
export class WarehouseItemFlipcardDbService extends AbstractDbService<IWarehouseItemFlipcard> {
    constructor(
        @Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
        @Inject(NGXLogger) logger: NGXLogger,
        @Inject(ConnectionService) connectionService: ConnectionService,
    ) {
        super(dbService, logger, connectionService, DB_STORE.WarehouseItem);
    }

    getAll(): Promise<IWarehouseItemFlipcard[]> {
        return Promise.resolve([]);
    }

    deleteExecutor = (
        resolve: (value?: PromiseLike<number> | number) => void,
        reject: (reason?: any) => void,
        ...args: IWarehouseItemFlipcard[]) => {
        resolve(0);
    }
}

@Injectable({
    providedIn: 'root',
})
export class WarehouseItemFlipcardHttpService extends AbstractHttpService<
    IWarehouseItemFlipcard,
    IWarehouseItemFlipcard
> {
    constructor(
        @Inject(HttpClient) http: HttpClient,
        @Inject(NGXLogger) logger: NGXLogger,
        @Inject(WarehouseItemFlipcardDbService) dbService: WarehouseItemFlipcardDbService,
    ) {
        super(http, logger, dbService);
    }

    parseResponse(serviceResponse?: ServiceResponse): IWarehouseItemFlipcard {
        return new IWarehouseItemFlipcard();
    }

    handleOfflineMode(
        url: string,
        method?: string,
        res?: any,
        options?: {
            body?: any;
            headers?: HttpHeaders | { [header: string]: string | string[] };
            observe?: 'body';
            params?: HttpParams | { [param: string]: string | string[] };
            reportProgress?: boolean;
            responseType: 'arraybuffer';
            withCredentials?: boolean;
            redirectSuccess?: any;
            redirectFailure?: any;
            errors?: any;
            messages?: any;
        },
    ): Observable<IWarehouseItemFlipcard[] | IWarehouseItemFlipcard> {
        return undefined;
    }
}
