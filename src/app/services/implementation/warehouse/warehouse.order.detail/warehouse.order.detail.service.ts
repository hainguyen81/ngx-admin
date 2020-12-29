import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouseOrderDetail} from '../../../../@core/data/warehouse/warehouse.order.detail';

@Injectable({ providedIn: 'any' })
export class WarehouseOrderDetailDbService extends BaseDbService<IWarehouseOrderDetail> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_order_detail);
    }
}

@Injectable({ providedIn: 'any' })
export class WarehouseOrderDetailHttpService extends BaseHttpService<IWarehouseOrderDetail> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseOrderDetailDbService) dbService: WarehouseOrderDetailDbService) {
        super(http, logger, dbService);
    }
}
