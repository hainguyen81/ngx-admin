import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IGeneralSettings} from '../../../../@core/data/system/general.settings';

@Injectable()
export class GeneralSettingsDbService extends BaseDbService<IGeneralSettings> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.general_settings);
    }
}

@Injectable()
export class GeneralSettingsHttpService extends BaseHttpService<IGeneralSettings> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(GeneralSettingsDbService) dbService: GeneralSettingsDbService) {
        super(http, logger, dbService);
    }
}
