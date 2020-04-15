import {IdGenerators} from '../../../config/generator.config';
import {ICountry} from '../../data/system/country';

export function countriesGenerate(): ICountry[] {
    let countriesDataModule: any;
    countriesDataModule = require('../../../../assets/data/countries.json');
    let countriesData: any[];
    countriesData = (Array.isArray(countriesDataModule) ? countriesDataModule : []);
    let countryModels: ICountry[];
    countryModels = [];
    if ((countriesData || []).length) {
        countriesData.forEach(country => {
            country['id'] = IdGenerators.oid.generate();
            countryModels.push(country as ICountry);
        });
    }
    return countryModels;
}
