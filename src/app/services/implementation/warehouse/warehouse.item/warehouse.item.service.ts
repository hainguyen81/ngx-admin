import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouseItem} from '../../../../@core/data/warehouse/warehouse.item';

@Injectable({ providedIn: 'any' })
export class WarehouseItemDbService extends BaseDbService<IWarehouseItem> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_item);
    }
}

@Injectable({ providedIn: 'any' })
export class WarehouseItemHttpService extends BaseHttpService<IWarehouseItem> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseItemDbService) dbService: WarehouseItemDbService) {
        super(http, logger, dbService);
    }
}
