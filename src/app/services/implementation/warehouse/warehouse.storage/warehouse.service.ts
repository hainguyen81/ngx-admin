import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouse} from '../../../../@core/data/warehouse/warehouse';

@Injectable()
export class WarehouseDbService extends BaseDbService<IWarehouse> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse);
    }
}

@Injectable()
export class WarehouseHttpService extends BaseHttpService<IWarehouse> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseDbService) dbService: WarehouseDbService) {
        super(http, logger, dbService);
    }
}
