import {Type} from '@angular/core';
import {IThirdPartyApiDataParser, ThirdPartyApiDataParserDefinition} from '../../third.party.api.datasource';
import {UniversalApiThirdParty} from '../../../../@core/data/system/api.third.party';
import City from '../../../../@core/data/system/city';
import UniversalApiCityDataParser from './city.data.parser';

export const UNIVERSAL_DATA_PARSERS:
    {
        provide: Type<any>,
        parser: IThirdPartyApiDataParser<UniversalApiThirdParty, any>,
    }[] = [{
    provide: City,
    parser: new UniversalApiCityDataParser(),
}];

/**
 * Universal third-party API data parser definition
 */
export class UniversalApiDataParserDefinition
    extends ThirdPartyApiDataParserDefinition<UniversalApiThirdParty> {

    constructor() {
        super(UNIVERSAL_DATA_PARSERS);
    }
}
