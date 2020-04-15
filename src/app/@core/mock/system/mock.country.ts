import {IdGenerators} from '../../../config/generator.config';
import {ICountry} from '../../data/system/country';

export function countriesGenerate(): ICountry[] {
    let countriesDataModule: any;
    countriesDataModule = require('../../../../assets/data/countries.json');
    let countriesData: string;
    countriesData = (countriesDataModule ? countriesDataModule.toString() : null);
    let countryModels: ICountry[];
    countryModels = [];
    if ((countriesData || '').length) {
        let countries: any[];
        try {
            countries = JSON.parse(countriesData);
        } catch (e) {
            window.console.warn(['Could not parse countries data to JSON', e]);
            countries = [];
        }
        countries.forEach(country => {
            country['id'] = IdGenerators.oid.generate();
            countryModels.push(country as ICountry);
        });
    }
    return countryModels;
}
