import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IWarehouseSetting} from '../../../../@core/data/warehouse/warehouse.setting';

@Injectable()
export class WarehouseSettingsDbService extends BaseDbService<IWarehouseSetting> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.warehouse_settings);
    }
}

@Injectable()
export class WarehouseSettingsHttpService extends BaseHttpService<IWarehouseSetting> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(WarehouseSettingsDbService) dbService: WarehouseSettingsDbService) {
        super(http, logger, dbService);
    }
}
