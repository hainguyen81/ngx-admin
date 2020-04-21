import {AbstractThirdPartyApiDataParser} from '../../data.parsers/third.party.data.parser';
import {UniversalApiThirdParty} from '../../../../@core/data/system/api.third.party';
import Province, {IProvince} from '../../../../@core/data/system/province';
import {IdGenerators} from '../../../../config/generator.config';

/**
 * Universal third-party API provinces data parser
 */
export default class UniversalApiProvinceDataParser
    extends AbstractThirdPartyApiDataParser<UniversalApiThirdParty, IProvince> {

    private static DATA_PROPERTY_PROVINCE_NAME: string = 'state_name';
    private static PROVINCE_CODE_FROM_NAME_LENGTH: number = 3;

    constructor() {
        super(UniversalApiProvinceDataParser.DATA_PROPERTY_PROVINCE_NAME);
    }

    protected mappingData(entity: any): IProvince {
        const id: string = IdGenerators.oid.generate();
        const name: string = entity[this.dataPropertyName];
        return new Province(id, name.left(UniversalApiProvinceDataParser.PROVINCE_CODE_FROM_NAME_LENGTH), name);
    }
}
