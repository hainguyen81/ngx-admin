import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouseOrder} from '../../../../@core/data/warehouse/warehouse.order';

@Injectable()
export class WarehouseOrderDbService extends BaseDbService<IWarehouseOrder> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_order);
    }
}

@Injectable()
export class WarehouseOrderHttpService extends BaseHttpService<IWarehouseOrder> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseOrderDbService) dbService: WarehouseOrderDbService) {
        super(http, logger, dbService);
    }
}
