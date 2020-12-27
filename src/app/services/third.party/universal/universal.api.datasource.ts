import {Inject, Injectable, Type} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {IApiThirdParty, UniversalApiThirdParty} from '../../../@core/data/system/api.third.party';
import {UniversalApiDbService, UniversalApiHttpService} from './universal.api.service';
import {
    IThirdPartyApiDataParserDefinition,
    ThirdPartyApiDatasource,
} from '../third.party.api.datasource';
import {UniversalApiDataParserDefinition} from './data.parsers/data.parsers';

export const UNIVERSAL_API_DATA_PARSER_DEFINITION: IThirdPartyApiDataParserDefinition<IApiThirdParty>
    = new UniversalApiDataParserDefinition();

/**
 * Universal third-party API data source
 */
@Injectable()
export class UniversalApiDatasource extends ThirdPartyApiDatasource<UniversalApiThirdParty> {

    constructor(@Inject(UniversalApiHttpService) httpService: UniversalApiHttpService,
                @Inject(UniversalApiDbService) dbService: UniversalApiDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger, UNIVERSAL_API_DATA_PARSER_DEFINITION);
    }
}
