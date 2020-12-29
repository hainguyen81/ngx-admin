import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouseBatchNo} from '../../../../@core/data/warehouse/warehouse.batch.no';

@Injectable({ providedIn: 'any' })
export class WarehouseBatchNoDbService extends BaseDbService<IWarehouseBatchNo> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_batch_no);
    }
}

@Injectable({ providedIn: 'any' })
export class WarehouseBatchNoHttpService extends BaseHttpService<IWarehouseBatchNo> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseBatchNoDbService) dbService: WarehouseBatchNoDbService) {
        super(http, logger, dbService);
    }
}
