import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouseAdjust} from '../../../../@core/data/warehouse/warehouse.adjust';

@Injectable()
export class WarehouseAdjustDbService extends BaseDbService<IWarehouseAdjust> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_adjust);
    }
}

@Injectable()
export class WarehouseAdjustHttpService extends BaseHttpService<IWarehouseAdjust> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseAdjustDbService) dbService: WarehouseAdjustDbService) {
        super(http, logger, dbService);
    }
}
