import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {UniversalApiThirdParty} from '../../../@core/data/system/api.third.party';
import {UniversalApiDbService, UniversalApiHttpService} from './universal.api.service';
import {ThirdPartyApiDatasource} from '../third.party.api.datasource';

@Injectable()
export class UniversalApiDatasource extends ThirdPartyApiDatasource<UniversalApiThirdParty> {

    constructor(@Inject(UniversalApiHttpService) httpService: UniversalApiHttpService,
                @Inject(UniversalApiDbService) dbService: UniversalApiDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}
