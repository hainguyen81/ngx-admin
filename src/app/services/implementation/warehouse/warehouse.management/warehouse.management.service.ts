import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouseManagement} from '../../../../@core/data/warehouse/warehouse.management';

@Injectable()
export class WarehouseManagementDbService extends BaseDbService<IWarehouseManagement> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_management);
    }
}

@Injectable()
export class WarehouseManagementHttpService extends BaseHttpService<IWarehouseManagement> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseManagementDbService) dbService: WarehouseManagementDbService) {
        super(http, logger, dbService);
    }
}
