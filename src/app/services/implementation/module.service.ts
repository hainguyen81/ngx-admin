import {Inject, Injectable} from '@angular/core';
import {BaseDbService} from '../database.service';
import {IModule} from '../../@core/data/system/module';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {DB_STORE} from '../../config/db.config';
import {ConnectionService} from 'ng-connection-service';

@Injectable()
export class ModuleService extends BaseDbService<IModule> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.module);
    }
}
