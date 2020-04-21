import {throwError} from 'rxjs';
import {OrganizationDataSource} from '../../services/implementation/system/organization/organization.datasource';
import OrganizationUtils from './organization.utils';
import {IOrganization} from '../../@core/data/system/organization';
import {UserDataSource} from '../../services/implementation/system/user/user.datasource';
import {IUser} from '../../@core/data/system/user';
import {CountryDatasource} from '../../services/implementation/system/country/country.datasource';
import {ICountry} from '../../@core/data/system/country';
import {CityDatasource} from '../../services/implementation/system/city/city.datasource';
import ModelUtils from './model.utils';
import {IModel} from '../../@core/data/base';
import {ProvinceDatasource} from '../../services/implementation/system/province/province.datasource';

export default class SystemDataUtils {

    /**
     * Get all countries
     * @param countryDatasource to invoke
     */
    public static invokeAllCountries(countryDatasource: CountryDatasource): Promise<any[]> {
        countryDatasource
        || throwError('CountryDatasource is required to invoke!');
        return countryDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false)
            .getAll().then(values => {
                return ModelUtils.buildModelForSelectOption(values as IModel[]);
            });
    }

    /**
     * Get all provinces by the specified country
     * @param provinceDatasource to invoke
     * @param country to filter
     */
    public static invokeAllProvinces(provinceDatasource: ProvinceDatasource, country: ICountry): Promise<any[]> {
        provinceDatasource
        || throwError('ProvinceDatasource is required to invoke!');
        return (<ProvinceDatasource>provinceDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false))
            .findByCountry(country).then(values => ModelUtils.buildModelForSelectOption(values as IModel[]));
    }

    /**
     * Get all cities by the specified country
     * @param cityDatasource to invoke
     * @param country to filter
     */
    public static invokeAllCities(cityDatasource: CityDatasource, country: ICountry): Promise<any[]> {
        cityDatasource
        || throwError('CityDatasource is required to invoke!');
        return (<CityDatasource>cityDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false))
            .findByCountry(country).then(values => ModelUtils.buildModelForSelectOption(values as IModel[]));
    }

    /**
     * Get all organization
     * @param organizationDatasource to invoke
     */
    public static invokeAllOrganization(organizationDatasource: OrganizationDataSource): Promise<any[]> {
        organizationDatasource
        || throwError('OrganizationDataSource is required to invoke!');
        return organizationDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false)
            .getAll().then(values => OrganizationUtils.buildOrganization(values as IOrganization[]));
    }

    /**
     * Get all users and mapping returned data as the options of select control
     * @param organizationDatasource to invoke
     */
    public static invokeAllUsersAsSelectOptions(userDatasource: UserDataSource): Promise<any[]> {
        userDatasource
        || throwError('UserDataSource is required to invoke!');
        return userDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false)
            .getAll().then(values => {
                let options: { value: string, label: string }[];
                options = [];
                Array.from(values).forEach((value: IUser) => {
                    SystemDataUtils.mapUserAsSelectOptions(value, options);
                });
                return options;
            });
    }
    /**
     * Map the specified {IUser} into the return options array recursively
     * @param userValue to map
     * @param retValues to push returned values
     */
    private static mapUserAsSelectOptions(userValue: IUser, retValues: { value: string, label: string }[]): void {
        if (!userValue) return;

        if (!retValues) {
            retValues = [];
        }
        let userName: string;
        userName = userValue.username;
        if ((userValue.firstName || '').length || (userValue.lastName || '')) {
            userName = [(userValue.firstName || ''), (userValue.lastName || '')].join(' ').trim();
        }
        retValues.push({value: userValue.id, label: userName});
    }
}
