import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IApiThirdParty} from '../../@core/data/system/api.third.party';
import {ThirdPartyApiDbService, ThirdPartyApiHttpService} from './third.party.api.service';

@Injectable()
export class ThirdPartyApiDatasource<T extends IApiThirdParty>
    extends BaseDataSource<T, ThirdPartyApiHttpService<T>, ThirdPartyApiDbService<T>> {

    constructor(@Inject(ThirdPartyApiHttpService) httpService: ThirdPartyApiHttpService<T>,
                @Inject(ThirdPartyApiDbService) dbService: ThirdPartyApiDbService<T>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}
