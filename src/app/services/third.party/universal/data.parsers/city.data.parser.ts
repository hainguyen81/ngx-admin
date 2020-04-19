import {IThirdPartyApiDataParser} from '../../third.party.api.datasource';
import {IApiThirdParty, UniversalApiThirdParty} from '../../../../@core/data/system/api.third.party';
import City from '../../../../@core/data/system/city';
import JsonUtils from '../../../../utils/json.utils';
import {isArray} from 'util';
import {IdGenerators} from '../../../../config/generator.config';

/**
 * Universal third-party API cities data parser
 */
export default class UniversalApiCityDataParser
    implements IThirdPartyApiDataParser<UniversalApiThirdParty, City> {

    private static DATA_PROPERTY_CITY_NAME: string = 'city_name';

    parse(data: UniversalApiThirdParty): City[] {
        let appCities: City[];
        appCities = null;
        if (!data || !((<IApiThirdParty>data).response || '').length) return appCities;
        let cities: any[];
        cities = JsonUtils.parseResponseJson((<IApiThirdParty>data).response);
        if (cities && !isArray(cities)) {
            cities = [cities];
        }
        if (isArray(cities) && cities.length) {
            cities.forEach(city => {
                if (city && city.hasOwnProperty(UniversalApiCityDataParser.DATA_PROPERTY_CITY_NAME)
                    && (city[UniversalApiCityDataParser.DATA_PROPERTY_CITY_NAME] || '').length) {
                    const id: string = IdGenerators.oid.generate();
                    const name: string = city[UniversalApiCityDataParser.DATA_PROPERTY_CITY_NAME];
                    appCities.push(new City(id, name.left(3), name));
                }
            });
        }
        return appCities;
    }
}
