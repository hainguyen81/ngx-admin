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
import {IProvince} from '../../@core/data/system/province';
import {ModuleDatasource} from '../../services/implementation/module.service';
import {IModule} from '../../@core/data/system/module';
import {TreeviewItem} from 'ngx-treeview';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ICity} from '../../@core/data/system/city';
import {TranslateService} from '@ngx-translate/core';

export default class SystemDataUtils {

    /**
     * Get all models
     * @param datasource to invoke
     * @param translateService need to translate
     */
    public static invokeAllModels<D extends DataSource, T extends IModel>(
        datasource: D, translateService?: TranslateService | null): Promise<T[]> {
        datasource
        || throwError('DataSource is required to invoke!');
        datasource.setPaging(1, undefined, false);
        datasource.setFilter([], false, false);
        return datasource.getAll().then(values =>
            ModelUtils.buildModelForSelectOption(values as T[], translateService));
    }

    /**
     * Get all modules and mapping returned data as the options of select control
     * @param moduleDatasource to invoke
     */
    public static invokeAllModulesAsSelectOptions(
        moduleDatasource: ModuleDatasource): Promise<{ value: string, label: string, title: string }[]> {
        moduleDatasource
        || throwError('ModuleDatasource is required to invoke!');
        return moduleDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false)
            .getAll().then(values => {
                const options: { value: string, label: string, title: string }[] = [];
                Array.from(values).forEach((value: IModule) => {
                    SystemDataUtils.mapModuleAsSelectOptions(value, options);
                });
                return options;
            });
    }
    /**
     * Map the specified {IModule} into the return options array recursively
     * @param moduleValue to map
     * @param retValues to push returned values
     */
    private static mapModuleAsSelectOptions(
        moduleValue: IModule, retValues: { value: string, label: string, title: string }[]): void {
        if (!moduleValue) return;

        if (!retValues) {
            retValues = [];
        }
        retValues.push({
            value: moduleValue.id,
            label: moduleValue.name.concat(' (', moduleValue.code, ')'),
            title: moduleValue.name.concat(' (', moduleValue.code, ')'),
        });
    }

    /**
     * Get all countries
     * @param countryDatasource to invoke
     */
    public static invokeAllCountries(countryDatasource: CountryDatasource): Promise<ICountry[]> {
        return this.invokeAllModels(countryDatasource);
    }

    /**
     * Get all provinces by the specified country
     * @param provinceDatasource to invoke
     * @param country to filter
     * @param translateService need to translate
     */
    public static invokeAllProvinces(
        provinceDatasource: ProvinceDatasource,
        country: ICountry, translateService?: TranslateService | null): Promise<IProvince[]> {
        provinceDatasource
        || throwError('ProvinceDatasource is required to invoke!');
        return (<ProvinceDatasource>provinceDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false))
            .findByCountry(country).then(values =>
                ModelUtils.buildModelForSelectOption(values as IProvince[], translateService, false));
    }

    /**
     * Get all cities by the specified state/province
     * @param cityDatasource to invoke
     * @param province to filter
     * @param translateService need to translate
     */
    public static invokeAllCities(
        cityDatasource: CityDatasource,
        province: IProvince, translateService?: TranslateService | null): Promise<ICity[]> {
        cityDatasource
        || throwError('CityDatasource is required to invoke!');
        return (<CityDatasource>cityDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false))
            .findByProvince(province).then(values =>
                ModelUtils.buildModelForSelectOption(values as ICity[], translateService, false));
    }

    /**
     * Get all organization
     * @param organizationDatasource to invoke
     */
    public static invokeAllOrganization(
        organizationDatasource: OrganizationDataSource): Promise<TreeviewItem[]> {
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
    public static invokeAllUsersAsSelectOptions(
        userDatasource: UserDataSource): Promise<{ value: string, label: string }[]> {
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
    private static mapUserAsSelectOptions(
        userValue: IUser, retValues: { value: string, label: string }[]): void {
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
