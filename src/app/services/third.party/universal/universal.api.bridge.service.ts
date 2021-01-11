import {Inject, Injectable} from '@angular/core';
import {ConnectionService} from 'ng-connection-service';
import {NGXLogger} from 'ngx-logger';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {UniversalApiThirdParty} from '../../../@core/data/system/api.third.party';
import {ThirdPartyApiBridgeDbService} from '../third.party.api.bridge.service';
import {UniversalApiDatasource} from './universal.api.datasource';

@Injectable()
export class UniversalApiBridgeDbService extends ThirdPartyApiBridgeDbService<UniversalApiThirdParty> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService,
                @Inject(UniversalApiDatasource) _thirdPartyApi: UniversalApiDatasource) {
        super(dbService, logger, connectionService, _thirdPartyApi);
    }
}
