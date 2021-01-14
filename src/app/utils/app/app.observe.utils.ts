import {FormlyFieldConfig} from '@ngx-formly/core';
import SystemDataUtils from '../system/system.data.utils';
import {IGeneralSettings} from '../../@core/data/system/general.settings';
import {IModel} from '../../@core/data/base';
import {Type} from '@angular/core';
import {AppFormlySelectExFieldComponent,} from '../../pages/components/app/components/common/app.formly.select.ex.field.component';
import {GeneralSettingsDatasource,} from '../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import {Constants as CommonConstants} from '../../@core/data/constants/common.constants';
import {IDbService, IHttpService} from '../../services/common/interface.service';
import {BaseDataSource} from '../../services/common/datasource.service';
import ObjectUtils from '../common/object.utils';
import ArrayUtils from '../common/array.utils';

export default class AppObserveUtils {

    /**
     * Observe the data source by index to the specified field component
     * @param datasource {Datasource} to request data
     * @param indexName to search
     * @param keyRange to filter
     * @param field the form field that need to observe
     * @param fieldComponentType the field component type to apply settings values
     * @param dataFilter to filter data
     * @param keysMapper mappers to map model to option value key
     * @param noneOption the first none select option. NULL for not using
     */
    public static observeDatasourceFormField<
        T extends IModel, H extends IHttpService<T>, D extends IDbService<T>,
        DS extends BaseDataSource<T, H, D>,
        FC extends AppFormlySelectExFieldComponent<T>>(
            datasource: DS, indexName: string, keyRange: IDBKeyRange,
            field: FormlyFieldConfig, fieldComponentType: Type<FC>,
            dataFilter?: (option: T) => boolean,
            keysMapper?: { [key: string]: (model: T) => string | string[] | T } | null,
            noneOption?: T | null): Promise<void> {
        datasource || throwError('Datasource is required');
        field || throwError('Field is required');
        (indexName || '').length || throwError('DB index name is required');
        keyRange || throwError('Criteria is required');
        return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsSelectOptions(
            datasource, indexName, keyRange, null, keysMapper).then(
                (settings: IModel[]) => {
                    let options: T[] = [];
                    ObjectUtils.isNotNou(noneOption) && options.push(noneOption);
                    options = options.concat(settings as T[]);
                    this.observeGeneralSettingsFormFieldComponent(
                        field, dataFilter, fieldComponentType, options);
                });
    }
    /**
     * Observe the general settings by code to the specified field component
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param field the form field that need to observe
     * @param fieldComponentType the field component type to apply settings values
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param settingFilter to filter settings
     * @param noneOption the first none select option. NULL for not using
     */
    public static observeGeneralSettingsFormField<
        FC extends AppFormlySelectExFieldComponent<IGeneralSettings>>(
            generalSettingsDatasource: GeneralSettingsDatasource,
            field: FormlyFieldConfig, fieldComponentType: Type<FC>,
            moduleCode: string, settingCode: string,
            settingFilter?: (option: IGeneralSettings) => boolean,
            noneOption?: IGeneralSettings | null): Promise<void> {
        return this.observeDatasourceFormField(
            generalSettingsDatasource,
            '__general_settings_index_by_module_code', IDBKeyRange.only([moduleCode, settingCode]),
            field, fieldComponentType,
            settingFilter, {
                'title': (model: IGeneralSettings) => model.value.toString(),
                'text': (model: IGeneralSettings) => model.value.toString(),
            }, noneOption);
    }
    /**
     * Observe the general settings by code to the specified field component
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param field the form field that need to observe
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param settingFilter to filter settings
     * @param noneOption the first none select option. NULL for not using
     */
    public static observeDefaultGeneralSettingsFormField(
            generalSettingsDatasource: GeneralSettingsDatasource, field: FormlyFieldConfig,
            moduleCode: string, settingCode: string,
            settingFilter?: (option: IGeneralSettings) => boolean,
            noneOption?: IGeneralSettings | null): Promise<void> {
        return this.observeGeneralSettingsFormField(
            generalSettingsDatasource, field, null,
            moduleCode, settingCode,
            settingFilter, noneOption);
    }
    /**
     * Observe the general settings by code to the specified field component
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param field the form field that need to observe
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param settingFilter to filter settings
     * @param noneOption the first none select option. NULL for not using
     */
    public static observeDefaultSystemGeneralSettingsFormField(
            generalSettingsDatasource: GeneralSettingsDatasource, field: FormlyFieldConfig,
            settingCode: string,
            settingFilter?: (option: IGeneralSettings) => boolean,
            noneOption?: IGeneralSettings | null): Promise<void> {
        return this.observeGeneralSettingsFormField(
            generalSettingsDatasource, field, null,
            CommonConstants.COMMON.MODULE_CODES.SYSTEM, settingCode,
            settingFilter, noneOption);
    }
    /**
     * Observe the general settings by code to the specified field component
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param field the form field that need to observe
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param settingFilter to filter settings
     * @param noneOption the first none select option. NULL for not using
     */
    public static observeDefaultWarehouseGeneralSettingsFormField(
        generalSettingsDatasource: GeneralSettingsDatasource, field: FormlyFieldConfig,
        settingCode: string,
        settingFilter?: (option: IGeneralSettings) => boolean,
        noneOption?: IGeneralSettings | null): Promise<void> {
        return this.observeGeneralSettingsFormField(
            generalSettingsDatasource, field, null,
            CommonConstants.COMMON.MODULE_CODES.WAREHOUSE, settingCode,
            settingFilter, noneOption);
    }
    /**
     * Observe general settings field component
     * @param field to observe
     * @param settingFilter to filter settings
     * @param fieldComponentType field editor component
     * @param options to apply
     */
    private static observeGeneralSettingsFormFieldComponent<
        T extends IModel, FC extends AppFormlySelectExFieldComponent<T>>(
            field: FormlyFieldConfig, settingFilter: (option: T) => boolean,
            fieldComponentType: Type<FC>, options: T[]): void {
        field || throwError('Field is required');
        const fieldComponentRef: any = (field.templateOptions && field.templateOptions['componentRef']
            ? <FC>field.templateOptions['componentRef'] : null);
        let settingsFieldComponent: AppFormlySelectExFieldComponent<T> = null;
        if (ObjectUtils.isNou(fieldComponentType)) {
            (fieldComponentRef && fieldComponentRef instanceof AppFormlySelectExFieldComponent)
            || throwError('Could not parse field component or invalid component type');
            settingsFieldComponent = <AppFormlySelectExFieldComponent<T>>fieldComponentRef;
        } else {
            (fieldComponentRef && fieldComponentRef instanceof fieldComponentType)
            || throwError('Could not parse field component or invalid component type');
            settingsFieldComponent = <FC>fieldComponentRef;
        }
        settingsFieldComponent || throwError('Could not parse field component or invalid component type');
        options = (ObjectUtils.isNou(settingFilter) ? options : (options || []).filter(settingFilter));
        if (settingsFieldComponent && ObjectUtils.isNotNou(options)) {
            settingsFieldComponent.items = options;
        }
    }

    /**
     * Observe general setting column by setting code
     * @param datasource {Datasource} to request data
     * @param indexName to search
     * @param keyRange to filter
     * @param tableSettings {Ng2SmartTableComponent} settings to apply column
     * @param column need to apply
     * @param dataFilter to filter data
     * @param keysMapper mappers to map model to option value key
     */
    public static observeDatasourceTableColumn<
        T extends IModel, H extends IHttpService<T>, D extends IDbService<T>,
        DS extends BaseDataSource<T, H, D>>(
            datasource: DS, indexName: string, keyRange: IDBKeyRange,
            tableSettings: any, column: string,
            dataFilter?: (option: { [key: string]: string | string[] | T; }) => boolean,
            keysMapper?: { [key: string]: (model: T) => string | string[] | T } | null): Promise<void> {
        datasource || throwError('Datasource is required');
        (indexName || '').length || throwError('DB index name is required');
        keyRange || throwError('Criteria is required');
        Object.keys(tableSettings || {}).length
        || throwError('Table settings is required');
        Object.keys(tableSettings['columns'] || {}).length
        || throwError('Table columns setting is required');
        ((column || '').length && Object.keys(tableSettings['columns'][column] || {}).length)
        || throwError('Table settings of the observed column is required');
        tableSettings['columns'][column]['editor'] =
            Object.assign({}, tableSettings['columns'][column]['editor']);
        tableSettings['columns'][column]['editor']['config'] =
            Object.assign({}, tableSettings['columns'][column]['editor']['config']);
        tableSettings['columns'][column]['editor']['config']['list'] =
            Object.assign({}, tableSettings['columns'][column]['editor']['config']['list']);
        tableSettings['columns'][column]['valuePrepareFunction'] =
            value => this.translateColumn(tableSettings, column, value);
        return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsOptions(
            datasource, indexName, keyRange, null, keysMapper).then(
                (data: { [key: string]: string | string[] | T; }[]) => {
                    const filteredData: { [key: string]: string | string[] | T; }[] =
                        (ObjectUtils.isNou(dataFilter) ? data : data.filter(dataFilter));
                    tableSettings['columns'][column]['editor']['config']['list'] = data;
                });
    }
    /**
     * Observe general setting column by setting code
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param tableSettings {Ng2SmartTableComponent} settings to apply column
     * @param column need to apply
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param settingFilter to filter settings
     */
    public static observeGeneralSettingsTableColumn(
        generalSettingsDatasource: GeneralSettingsDatasource,
        tableSettings: any, column: string,
        moduleCode: string, settingCode: string,
        settingFilter?: (setting: { [key: string]: string | string[] | IGeneralSettings; }) => boolean): Promise<void> {
        return this.observeDatasourceTableColumn(
            generalSettingsDatasource,
            '__general_settings_index_by_module_code', IDBKeyRange.only([moduleCode, settingCode]),
            tableSettings, column,
            settingFilter, {
                'value': (model: IGeneralSettings) => model.name,
                'label': (model: IGeneralSettings) => model.value.toString(),
            });
    }
    /**
     * Observe general setting column by setting code
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param tableSettings {Ng2SmartTableComponent} settings to apply column
     * @param column need to apply
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param settingFilter to filter settings
     */
    public static observeDefaultSystemGeneralSettingsTableColumn(
        generalSettingsDatasource: GeneralSettingsDatasource,
        tableSettings: any, column: string, settingCode: string,
        settingFilter?: (setting: { [key: string]: string | string[] | IGeneralSettings; }) => boolean): Promise<void> {
        return this.observeGeneralSettingsTableColumn(
            generalSettingsDatasource, tableSettings, column,
            CommonConstants.COMMON.MODULE_CODES.SYSTEM, settingCode,
            settingFilter);
    }
    /**
     * Observe general setting column by setting code
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param tableSettings {Ng2SmartTableComponent} settings to apply column
     * @param column need to apply
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param settingFilter to filter settings
     */
    public static observeDefaultWarehouseGeneralSettingsTableColumn(
        generalSettingsDatasource: GeneralSettingsDatasource,
        tableSettings: any, column: string, settingCode: string,
        settingFilter?: (setting: { [key: string]: string | string[] | IGeneralSettings; }) => boolean): Promise<void> {
        return this.observeGeneralSettingsTableColumn(
            generalSettingsDatasource, tableSettings, column,
            CommonConstants.COMMON.MODULE_CODES.WAREHOUSE, settingCode,
            settingFilter);
    }
    /**
     * Translate the table column value to the display value
     * @param tableSettings {Ng2SmartTableComponent} settings to apply column
     * @param column need to apply
     * @param value need to translate
     */
    private static translateColumn(tableSettings: any, column: string, value?: string | null): string {
        Object.keys(tableSettings || {}).length
        || throwError('Table settings is required');
        Object.keys(tableSettings['columns'] || {}).length
        || throwError('Table columns setting is required');
        ((column || '').length && Object.keys(tableSettings['columns'][column] || {}).length)
        || throwError('Table settings of the observed column is required');
        (Object.keys(tableSettings['columns'][column]['editor'] || {}).length
            && Object.keys(tableSettings['columns'][column]['editor']['config'] || {}).length
            && Object.keys(tableSettings['columns'][column]['editor']['config']['list'] || {}).length)
        || throwError('Table editor settings of the observed column is required');
        const options: { [key: string]: string | string[] | IGeneralSettings; }[] =
            <{ [key: string]: string | string[] | IGeneralSettings; }[]>
                tableSettings['columns'][column]['editor']['config']['list'];
        if (ObjectUtils.isNotNou(options) && ArrayUtils.isArray(options)) {
            for (const option of options) {
                if (option.value === value) {
                    return (option.label && option.label.toString().length
                        ? option.label.toString() : undefined);
                }
            }
        }
        return undefined;
    }
}
