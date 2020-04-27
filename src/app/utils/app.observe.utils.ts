import {FormlyFieldConfig} from '@ngx-formly/core';
import SystemDataUtils from './system/system.data.utils';
import {IGeneralSettings} from '../@core/data/system/general.settings';
import BaseModel, {IModel} from '../@core/data/base';
import {isArray, isNullOrUndefined} from 'util';
import {Type} from '@angular/core';
import {
    AppFormlySelectExFieldComponent,
} from '../pages/components/app/components/app.formly.select.ex.field.component';
import {TranslateService} from '@ngx-translate/core';
import {
    GeneralSettingsDatasource,
} from '../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import {Constants as CommonConstants} from '../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;

export default class AppObserveUtils {

    /**
     * Observe the general settings by code to the specified field component
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param field the form field that need to observe
     * @param fieldComponentType the field component type to apply settings values
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param noneOption the first none select option. NULL for not using
     * @param translateService need to translate settings values
     */
    public static observeGeneralSettingsFormField<
        T extends IModel, FC extends AppFormlySelectExFieldComponent<T>>(
            generalSettingsDatasource: GeneralSettingsDatasource,
            field: FormlyFieldConfig, fieldComponentType: Type<FC>,
            moduleCode: string, settingCode: string,
            noneOption?: T | null, translateService?: TranslateService | null): Promise<void> {
        generalSettingsDatasource || throwError('GeneralSettingsDatasource is required');
        field || throwError('Field is required');
        (moduleCode || '').length || throwError('Module code is required');
        (settingCode || '').length || throwError('Settings code is required');
        return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsSelectOptions(
            generalSettingsDatasource, '__general_settings_index_by_module_code',
            IDBKeyRange.only([moduleCode, settingCode]),
            translateService, {
                'title': (model: IGeneralSettings) => (isNullOrUndefined(translateService)
                    ? model.value : translateService.instant(model.value.toString())),
                'text': (model: IGeneralSettings) => (isNullOrUndefined(translateService)
                    ? model.value : translateService.instant(model.value.toString())),
            }).then((settings: IModel[]) => {
                let options: T[] = [];
                !isNullOrUndefined(noneOption) && options.push(noneOption);
                options = options.concat(settings as T[]);
                this.observeGeneralSettingsFormFieldComponent(field, fieldComponentType, options);
            });
    }
    /**
     * Observe the general settings by code to the specified field component
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param field the form field that need to observe
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param noneOption the first none select option. NULL for not using
     * @param translateService need to translate settings values
     */
    public static observeDefaultGeneralSettingsFormField<T extends IModel>(
            generalSettingsDatasource: GeneralSettingsDatasource, field: FormlyFieldConfig,
            moduleCode: string, settingCode: string,
            noneOption?: T | null, translateService?: TranslateService | null): Promise<void> {
        return this.observeGeneralSettingsFormField(
            generalSettingsDatasource, field, null,
            moduleCode, settingCode, noneOption, translateService);
    }
    /**
     * Observe the general settings by code to the specified field component
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param field the form field that need to observe
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param noneOption the first none select option. NULL for not using
     * @param translateService need to translate settings values
     */
    public static observeDefaultSystemGeneralSettingsFormField<T extends IModel>(
            generalSettingsDatasource: GeneralSettingsDatasource, field: FormlyFieldConfig,
            settingCode: string, noneOption?: T | null, translateService?: TranslateService | null): Promise<void> {
        return this.observeGeneralSettingsFormField(
            generalSettingsDatasource, field, null,
            MODULE_CODES.SYSTEM, settingCode, noneOption, translateService);
    }
    /**
     * Observe the general settings by code to the specified field component
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param field the form field that need to observe
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param noneOption the first none select option. NULL for not using
     * @param translateService need to translate settings values
     */
    public static observeDefaultWarehouseGeneralSettingsFormField<
        T extends IModel, FC extends AppFormlySelectExFieldComponent<T>>(
        generalSettingsDatasource: GeneralSettingsDatasource, field: FormlyFieldConfig,
        settingCode: string, noneOption?: T | null, translateService?: TranslateService | null): Promise<void> {
        return this.observeGeneralSettingsFormField(
            generalSettingsDatasource, field, null,
            MODULE_CODES.WAREHOUSE, settingCode, noneOption, translateService);
    }
    /**
     * Observe general settings field component
     * @param field to observe
     * @param options to apply
     */
    private static observeGeneralSettingsFormFieldComponent<
        T extends IModel, FC extends AppFormlySelectExFieldComponent<T>>(
            field: FormlyFieldConfig, fieldComponentType: Type<FC>, options: T[]): void {
        field || throwError('Field is required');
        const fieldComponentRef: any = (field.templateOptions && field.templateOptions['componentRef']
            ? <FC>field.templateOptions['componentRef'] : null);
        let settingsFieldComponent: AppFormlySelectExFieldComponent<T> = null;
        if (isNullOrUndefined(fieldComponentType)) {
            (fieldComponentRef && fieldComponentRef instanceof AppFormlySelectExFieldComponent)
            || throwError('Could not parse field component or invalid component type');
            settingsFieldComponent = <AppFormlySelectExFieldComponent<T>>fieldComponentRef;
        } else {
            (fieldComponentRef && fieldComponentRef instanceof fieldComponentType)
            || throwError('Could not parse field component or invalid component type');
            settingsFieldComponent = <FC>fieldComponentRef;
        }
        settingsFieldComponent || throwError('Could not parse field component or invalid component type');
        const noneOption: IModel = new BaseModel(null);
        if (settingsFieldComponent && !isNullOrUndefined(options)) {
            settingsFieldComponent.setItems(options);

        } else {
            settingsFieldComponent.setItems([]);
        }
    }

    /**
     * Observe general setting column by setting code
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param tableSettings {Ng2SmartTableComponent} settings to apply column
     * @param column need to apply
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param translateService need to translate settings values
     */
    public static observeGeneralSettingsTableColumn(
        generalSettingsDatasource: GeneralSettingsDatasource,
        tableSettings: any, column: string,
        moduleCode: string, settingCode: string,
        translateService?: TranslateService | null): Promise<void> {
        generalSettingsDatasource || throwError('GeneralSettingsDatasource is required');
        Object.keys(tableSettings || {}).length
        || throwError('Table settings is required');
        Object.keys(tableSettings['columns'] || {}).length
        || throwError('Table columns setting is required');
        ((column || '').length && Object.keys(tableSettings['columns'][column] || {}).length)
        || throwError('Table settings of the observed column is required');
        (moduleCode || '').length || throwError('Module code is required');
        (settingCode || '').length || throwError('Settings code is required');
        tableSettings['columns'][column]['editor'] =
            Object.assign({}, tableSettings['columns'][column]['editor']);
        tableSettings['columns'][column]['editor']['config'] =
            Object.assign({}, tableSettings['columns'][column]['editor']['config']);
        tableSettings['columns'][column]['editor']['config']['list'] =
            Object.assign({}, tableSettings['columns'][column]['editor']['config']['list']);
        tableSettings['columns'][column]['valuePrepareFunction'] =
            value => this.translateColumn(tableSettings, column, value);
        return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsOptions(
            generalSettingsDatasource, '__general_settings_index_by_module_code',
            IDBKeyRange.only([moduleCode, settingCode]), translateService, {
                'value': (model: IGeneralSettings) => model.name,
                'label': (model: IGeneralSettings) => (isNullOrUndefined(translateService)
                    ? model.value : translateService.instant(model.value.toString())),
            }).then((settings: { [key: string]: string | string[] | IGeneralSettings; }[]) => {
                tableSettings['columns'][column]['editor']['config']['list'] = settings;
            });
    }
    /**
     * Observe general setting column by setting code
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param tableSettings {Ng2SmartTableComponent} settings to apply column
     * @param column need to apply
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param translateService need to translate settings values
     */
    public static observeDefaultSystemGeneralSettingsTableColumn(
        generalSettingsDatasource: GeneralSettingsDatasource,
        tableSettings: any, column: string, settingCode: string,
        translateService?: TranslateService | null): Promise<void> {
        return this.observeGeneralSettingsTableColumn(
            generalSettingsDatasource, tableSettings, column,
            MODULE_CODES.SYSTEM, settingCode, translateService);
    }
    /**
     * Observe general setting column by setting code
     * @param generalSettingsDatasource {GeneralSettingsDatasource} to request data
     * @param tableSettings {Ng2SmartTableComponent} settings to apply column
     * @param column need to apply
     * @param moduleCode module code
     * @param settingCode the general settings code
     * @param translateService need to translate settings values
     */
    public static observeDefaultWarehouseGeneralSettingsTableColumn(
        generalSettingsDatasource: GeneralSettingsDatasource,
        tableSettings: any, column: string, settingCode: string,
        translateService?: TranslateService | null): Promise<void> {
        return this.observeGeneralSettingsTableColumn(
            generalSettingsDatasource, tableSettings, column,
            MODULE_CODES.WAREHOUSE, settingCode, translateService);
    }
    /**
     * Translate the table column value to the display value
     * @param tableSettings {Ng2SmartTableComponent} settings to apply column
     * @param column need to apply
     * @param value nned to translate
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
        if (!isNullOrUndefined(options) && isArray(options)) {
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
