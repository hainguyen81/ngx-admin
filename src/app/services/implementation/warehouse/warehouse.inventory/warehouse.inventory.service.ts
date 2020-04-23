import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouseInventory} from '../../../../@core/data/warehouse/warehouse.inventory';

@Injectable()
export class WarehouseInventoryDbService extends BaseDbService<IWarehouseInventory> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_inventory);
    }
}

@Injectable()
export class WarehouseInventoryHttpService extends BaseHttpService<IWarehouseInventory> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseInventoryDbService) dbService: WarehouseInventoryDbService) {
        super(http, logger, dbService);
    }
}
