import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouseInventoryDetail} from '../../../../@core/data/warehouse/warehouse.inventory.detail';

@Injectable({ providedIn: 'any' })
export class WarehouseInventoryDetailDbService extends BaseDbService<IWarehouseInventoryDetail> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_inventory_detail);
    }
}

@Injectable({ providedIn: 'any' })
export class WarehouseInventoryDetailHttpService extends BaseHttpService<IWarehouseInventoryDetail> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseInventoryDetailDbService) dbService: WarehouseInventoryDetailDbService) {
        super(http, logger, dbService);
    }
}
