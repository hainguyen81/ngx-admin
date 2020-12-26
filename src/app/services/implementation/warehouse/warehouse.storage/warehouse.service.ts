import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouse} from '../../../../@core/data/warehouse/warehouse';
import {isNullOrUndefined} from 'util';

@Injectable()
export class WarehouseDbService extends BaseDbService<IWarehouse> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse);
    }

    getStoragesByPath(warehouseIdOrCode: string, retStorages: IWarehouse[], byCode?: boolean | true): Promise<void> {
        if (!(warehouseIdOrCode || '').length) {
            return this.getAll().then(value => {
                retStorages.push(...Array.from(value));
            });
        } else {
            this.openCursor((e) => {
                const cursor: any = (<any>e.target).result;
                byCode && cursor && !isNullOrUndefined(cursor.value)
                && ((<IWarehouse>cursor.value).pathCodes || '').length
                && (((<IWarehouse>cursor.value).pathCodes || '')
                    .toLowerCase().indexOf(warehouseIdOrCode.toLowerCase()) >= 0)
                && retStorages.push(cursor.value);
                !byCode && cursor && !isNullOrUndefined(cursor.value)
                && ((<IWarehouse>cursor.value).pathIds || '').length
                && (((<IWarehouse>cursor.value).pathIds || '')
                    .toLowerCase().indexOf(warehouseIdOrCode.toLowerCase()) >= 0)
                && retStorages.push(cursor.value);
            });
        }
    }
}

@Injectable()
export class WarehouseHttpService extends BaseHttpService<IWarehouse> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseDbService) dbService: WarehouseDbService) {
        super(http, logger, dbService);
    }
}
