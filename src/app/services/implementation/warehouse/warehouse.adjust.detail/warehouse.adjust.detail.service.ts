import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouseAdjustDetail} from '../../../../@core/data/warehouse/warehouse.adjust.detail';

@Injectable()
export class WarehouseAdjustDetailDbService extends BaseDbService<IWarehouseAdjustDetail> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_adjust_detail);
    }
}

@Injectable()
export class WarehouseAdjustDetailHttpService extends BaseHttpService<IWarehouseAdjustDetail> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseAdjustDetailDbService) dbService: WarehouseAdjustDetailDbService) {
        super(http, logger, dbService);
    }
}
