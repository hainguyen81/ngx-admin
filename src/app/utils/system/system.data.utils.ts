import {throwError} from 'rxjs';
import {OrganizationDataSource} from '../../services/implementation/system/organization/organization.datasource';
import OrganizationUtils from './organization.utils';
import {IOrganization} from '../../@core/data/system/organization';
import {UserDataSource} from '../../services/implementation/system/user/user.datasource';
import {CountryDatasource} from '../../services/implementation/system/country/country.datasource';
import {ICountry} from '../../@core/data/system/country';
import {CityDatasource} from '../../services/implementation/system/city/city.datasource';
import ModelUtils from './model.utils';
import {IModel} from '../../@core/data/base';
import {ProvinceDatasource} from '../../services/implementation/system/province/province.datasource';
import {IProvince} from '../../@core/data/system/province';
import {TreeviewItem} from 'ngx-treeview';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ICity} from '../../@core/data/system/city';
import {TranslateService} from '@ngx-translate/core';
import {IDbService, IHttpService} from '../../services/interface.service';
import {BaseDataSource} from '../../services/datasource.service';

export default class SystemDataUtils {

    /**
     * Get all models as {NgxSelectOption} options
     * @param dbService to invoke
     * @param indexName to filter
     * @param keyRange to filter
     * @param translateService need to translate
     */
    public static invokeModelsByDatabaseFilterAsSelectOptions<
        T extends IModel, D extends IDbService<T>>(
            dbService: D, indexName: string, keyRange: IDBKeyRange,
            translateService?: TranslateService | null): Promise<T[]> {
        dbService
        || throwError('DbService is required to invoke!');
        return dbService.getAllByIndex(indexName, keyRange).then(values =>
            ModelUtils.buildModelsForSelectOptions(values as T[], translateService));
    }
    /**
     * Get all models as table column select options
     * @param dbService to invoke
     * @param indexName to filter
     * @param keyRange to filter
     * @param translateService need to translate
     */
    public static invokeModelsByDatabaseFilterAsTableSelectOptions<
        T extends IModel, D extends IDbService<T>>(
            dbService: D, indexName: string, keyRange: IDBKeyRange,
            translateService?: TranslateService | null): Promise<{ [key: string]: string | string[]; }[]> {
        dbService
        || throwError('DbService is required to invoke!');
        return dbService.getAllByIndex(indexName, keyRange).then(values =>
            ModelUtils.buildModelsForDefaultTableSelectOptions(values as T[], translateService));
    }

    /**
     * Get all models as {NgxSelectOption} options
     * @param datasource to invoke
     * @param indexName to filter
     * @param keyRange to filter
     * @param translateService need to translate
     */
    public static invokeDatasourceModelsByDatabaseFilterAsSelectOptions<
        T extends IModel, H extends IHttpService<T>, D extends IDbService<T>,
        DS extends BaseDataSource<T, H, D>>(
        datasource: DS, indexName: string, keyRange: IDBKeyRange,
        translateService?: TranslateService | null): Promise<T[]> {
        datasource
        || throwError('DataSource is required to invoke!');
        datasource.setPaging(1, undefined, false);
        datasource.setFilter([], false, false);
        return datasource.getAllByIndex(indexName, keyRange).then(values =>
            ModelUtils.buildModelsForSelectOptions(values as T[], translateService));
    }
    /**
     * Get all models as table column select options
     * @param datasource to invoke
     * @param indexName to filter
     * @param keyRange to filter
     * @param translateService need to translate
     */
    public static invokeDatasourceModelsByDatabaseFilterAsTableSelectOptions<
        T extends IModel, H extends IHttpService<T>, D extends IDbService<T>,
        DS extends BaseDataSource<T, H, D>>(
            datasource: DS, indexName: string, keyRange: IDBKeyRange,
            translateService?: TranslateService | null): Promise<{ [key: string]: string | string[]; }[]> {
        datasource
        || throwError('DataSource is required to invoke!');
        datasource.setPaging(1, undefined, false);
        datasource.setFilter([], false, false);
        return datasource.getAllByIndex(indexName, keyRange).then(values =>
            ModelUtils.buildModelsForDefaultTableSelectOptions(values as T[], translateService));
    }

    /**
     * Get all models as {NgxSelectOption} options
     * @param datasource to invoke
     * @param conf to filter
     * @param andOperator filter operation
     * @param translateService need to translate
     */
    public static invokeModelsByFilterAsSelectOptions<
        D extends DataSource, T extends IModel>(
            datasource: D, conf?: Array<any> | null, andOperator?: boolean | false,
            translateService?: TranslateService | null): Promise<T[]> {
        datasource
        || throwError('DataSource is required to invoke!');
        datasource.setPaging(1, undefined, false);
        datasource.setFilter(conf || [], andOperator, false);
        return datasource.getAll().then(values =>
            ModelUtils.buildModelsForSelectOptions(values as T[], translateService));
    }
    /**
     * Get all models as table column select options
     * @param datasource to invoke
     * @param conf to filter
     * @param andOperator filter operation
     * @param translateService need to translate
     */
    public static invokeModelsByFilterAsTableSelectOptions<
        D extends DataSource, T extends IModel>(
            datasource: D, conf?: Array<any> | null, andOperator?: boolean | false,
            translateService?: TranslateService | null): Promise<{ [key: string]: string | string[]; }[]> {
        datasource
        || throwError('DataSource is required to invoke!');
        datasource.setPaging(1, undefined, false);
        datasource.setFilter(conf || [], andOperator, false);
        return datasource.getAll().then(values =>
            ModelUtils.buildModelsForDefaultTableSelectOptions(values as T[], translateService));
    }

    /**
     * Get all models as {NgxSelectOption} options
     * @param datasource to invoke
     * @param translateService need to translate
     */
    public static invokeAllModelsAsSelectOptions<D extends DataSource, T extends IModel>(
        datasource: D, translateService?: TranslateService | null): Promise<T[]> {
        return this.invokeModelsByFilterAsSelectOptions(
            datasource, [], false, translateService);
    }
    /**
     * Get all models as table column select options
     * @param datasource to invoke
     * @param translateService need to translate
     */
    public static invokeAllModelsAsTableSelectOptions<
        D extends DataSource, T extends IModel>(
            datasource: D,
            translateService?: TranslateService | null): Promise<{ [key: string]: string | string[]; }[]> {
        return this.invokeModelsByFilterAsTableSelectOptions(
            datasource, [], false, translateService);
    }

    /**
     * Get all countries as {NgxSelectOption} options
     * @param countryDatasource to invoke
     */
    public static invokeAllCountries(countryDatasource: CountryDatasource): Promise<ICountry[]> {
        return this.invokeAllModelsAsSelectOptions(countryDatasource);
    }

    /**
     * Get all provinces by the specified country as {NgxSelectOption} options
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
                ModelUtils.buildModelsForSelectOptions(
                    values as IProvince[], translateService, false));
    }

    /**
     * Get all cities by the specified state/province as {NgxSelectOption} options
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
                ModelUtils.buildModelsForSelectOptions(
                    values as ICity[], translateService, false));
    }

    /**
     * Get all organization as {TreeviewItem} array
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
     * @param userDatasource to invoke
     */
    public static invokeAllUsersAsSelectOptions(
        userDatasource: UserDataSource): Promise<{ [key: string]: string | string[]; }[]> {
        userDatasource
        || throwError('UserDataSource is required to invoke!');
        return userDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false)
            .getAll().then(values =>
                ModelUtils.buildModelsForTableSelectOptions(
                    values, null, false, {
                        'value': model => model.id,
                        'label': model => {
                            let labelOption: string = model['username'];
                            if ((model['firstName'] || '').length || (model['lastName'] || '')) {
                                labelOption = [(model['firstName'] || ''), (model['lastName'] || '')].join(' ').trim();
                            }
                            return labelOption;
                        },
                    }));
    }
}
