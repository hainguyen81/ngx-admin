import {ICountry} from '../../@core/data/system/country';
import {NgxSelectOption} from 'ngx-select-ex';

/**
 * {ICountry} utilities
 */
export default class CountryUtils {

    /**
     * Map the specified {ICountry} array to the select option {NgxSelectOption} array
     * @param countries {ICountry[]}
     */
    public static buildCountries(countries: ICountry[]): ICountry[] {
        (countries || []).forEach((country: ICountry) => {
            country['text'] = country.name.concat(' (', country.code, ')');
        });
        return countries;
    }
}
