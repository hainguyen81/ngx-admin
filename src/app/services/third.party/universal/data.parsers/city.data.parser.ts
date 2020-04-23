import {AbstractThirdPartyApiDataParser} from '../../data.parsers/third.party.data.parser';
import {UniversalApiThirdParty} from '../../../../@core/data/system/api.third.party';
import Province, {IProvince} from '../../../../@core/data/system/province';
import {IdGenerators} from '../../../../config/generator.config';

/**
 * Universal third-party API cities data parser
 */
export default class UniversalApiCityDataParser
    extends AbstractThirdPartyApiDataParser<UniversalApiThirdParty, IProvince> {

    private static DATA_PROPERTY_CITY_NAME: string = 'city_name';
    private static CITY_CODE_FROM_NAME_LENGTH: number = 3;

    constructor() {
        super(UniversalApiCityDataParser.DATA_PROPERTY_CITY_NAME);
    }

    protected mappingData(entity: any): IProvince {
        const id: string = IdGenerators.oid.generate();
        const name: string = entity[this.dataPropertyName];
        return new Province(id, name.left(UniversalApiCityDataParser.CITY_CODE_FROM_NAME_LENGTH), name);
    }
}