import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouseCategory} from '../../../../@core/data/warehouse/warehouse.category';

@Injectable()
export class WarehouseCategoryDbService extends BaseDbService<IWarehouseCategory> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_category);
    }
}

@Injectable()
export class WarehouseCategoryHttpService extends BaseHttpService<IWarehouseCategory> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseCategoryDbService) dbService: WarehouseCategoryDbService) {
        super(http, logger, dbService);
    }
}
