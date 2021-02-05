import {Inject, Injectable} from '@angular/core';
import {BaseDbService} from '../common/database.service';
import {IModule} from '../../@core/data/system/module';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {DB_STORE} from '../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {BaseHttpService} from '../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDataSource} from '../common/datasource.service';
import AssertUtils from '@app/utils/common/assert.utils';

@Injectable()
export class ModuleService extends BaseDbService<IModule> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.module);
    }
}

@Injectable()
export class ModuleHttpService extends BaseHttpService<IModule> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ModuleService) dbService: ModuleService) {
        super(http, logger, dbService);
        AssertUtils.isValueNotNou(dbService, 'Could not inject user database service for offline mode');
    }
}

@Injectable()
export class ModuleDatasource extends BaseDataSource<IModule, ModuleHttpService, ModuleService> {

    constructor(@Inject(ModuleHttpService) httpService: ModuleHttpService,
                @Inject(ModuleService) dbService: ModuleService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}
