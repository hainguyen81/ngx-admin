import {ConfigOption, TypeOption} from '@ngx-formly/core/lib/services/formly.config';
import {ImageGalleryFormFieldComponent} from 'app/pages/components/formly/formly.image.field.component';
import {FileGalleryFormFieldComponent} from 'app/pages/components/formly/formly.file.field.component';
import {DropdownTreeviewFormFieldComponent} from 'app/pages/components/formly/formly.treeview.dropdown.field.component';
import {SelectExFormFieldComponent} from 'app/pages/components/formly/formly.select.ex.field.component';
import {SelectFormFieldComponent} from 'app/pages/components/formly/formly.select.field.component';
import {PasswordFormFieldComponent} from 'app/pages/components/formly/formly.password.field.component';
import {DatePickerFormFieldComponent} from 'app/pages/components/formly/formly.datepicker.field.component';
import {AppModuleFormlySelectExFieldComponent} from 'app/pages/components/app/components/common/app.module.formly.select.ex.field.component';
import {AppModuleFormlySelectFieldComponent} from 'app/pages/components/app/components/common/app.module.formly.select.field.component';
import {AppModuleSettingsFormlySelectExFieldComponent} from 'app/pages/components/app/components/common/app.module.settings.formly.select.ex.field.component';
import {AppModuleSettingsFormlySelectFieldComponent} from 'app/pages/components/app/components/common/app.module.settings.formly.select.field.component';
import {AppCountryFormlySelectExFieldComponent} from 'app/pages/components/app/components/common/app.country.formly.select.ex.field.component';
import {AppCountryFormlySelectFieldComponent} from 'app/pages/components/app/components/common/app.country.formly.select.field.component';
import {AppProvinceFormlySelectExFieldComponent} from 'app/pages/components/app/components/common/app.province.formly.select.ex.field.component';
import {AppProvinceFormlySelectFieldComponent} from 'app/pages/components/app/components/common/app.province.formly.select.field.component';
import {AppCityFormlySelectExFieldComponent} from 'app/pages/components/app/components/common/app.city.formly.select.ex.field.component';
import {AppCityFormlySelectFieldComponent} from 'app/pages/components/app/components/common/app.city.formly.select.field.component';
import {AppFormlyDatePickerFieldComponent} from 'app/pages/components/app/components/common/app.formly.datepicker.field.component';
import {AppLanguagesFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/app.languages.select.ex.field.component';
import {AppLanguagesFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/app.languages.select.field.component';
import {VendorCustomerFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/vendor.customer.select.ex.field.component';
import {VendorCustomerFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/vendor.customer.select.field.component';
import {SystemStatusFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/system.status.select.ex.field.component';
import {SystemStatusFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/system.status.select.field.component';
import {SystemCurrencyFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/system.currency.select.ex.field.component';
import {SystemCurrencyFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/system.currency.select.field.component';
import {SystemCustomerLevelFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/system.customer.level.select.ex.field.component';
import {SystemCustomerLevelFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/system.customer.level.select.field.component';
import {SystemCustomerTypeFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/system.customer.type.select.ex.field.component';
import {SystemCustomerTypeFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/system.customer.type.select.field.component';
import {SystemOrganizationTypeFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/system.organization.type.select.ex.field.component';
import {SystemOrganizationTypeFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/system.organization.type.select.field.component';
import {WarehouseInventoryStatusFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/warehouse.inventory.status.select.ex.field.component';
import {WarehouseInventoryStatusFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/warehouse.inventory.status.select.field.component';
import {WarehouseInventoryTypeFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/warehouse.inventory.type.select.ex.field.component';
import {WarehouseInventoryTypeFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/warehouse.inventory.type.select.field.component';
import {WarehouseStorageTypeFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/warehouse.storage.type.select.ex.field.component';
import {WarehouseStorageTypeFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/warehouse.storage.type.select.field.component';
import {WarehouseSettingsTypeFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/warehouse.settings.type.select.ex.field.component';
import {WarehouseSettingsTypeFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/warehouse.settings.type.select.field.component';
import {WarehouseSettingsBrandFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/warehouse/settings/warehouse.settings.brand.select.ex.field.component';
import {WarehouseSettingsBrandFormlySelectFieldComponent} from 'app/pages/components/app/module.components/warehouse/settings/warehouse.settings.brand.select.field.component';
import {WarehouseSettingsItemFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/warehouse/settings/warehouse.settings.item.select.ex.field.component';
import {WarehouseSettingsItemFormlySelectFieldComponent} from 'app/pages/components/app/module.components/warehouse/settings/warehouse.settings.item.select.field.component';
import {WarehouseCategoryTypeFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/common/warehouse.category.type.select.ex.field.component';
import {WarehouseCategoryTypeFormlySelectFieldComponent} from 'app/pages/components/app/module.components/common/warehouse.category.type.select.field.component';
import {OrganizationFormlyTreeviewFieldComponent} from 'app/pages/components/app/module.components/system/organization.formly.treeview.field.component';
import {WarehouseCategoryFormlyTreeviewFieldComponent} from 'app/pages/components/app/module.components/warehouse/category/warehouse.category.formly.treeview.field.component';
import {WarehouseSettingsBatchFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/warehouse/settings/warehouse.settings.batch.select.ex.field.component';
import {WarehouseSettingsBatchFormlySelectFieldComponent} from 'app/pages/components/app/module.components/warehouse/settings/warehouse.settings.batch.select.field.component';
import {WarehouseItemFormlySelectExFieldComponent} from 'app/pages/components/app/module.components/warehouse/item/warehouse.item.select.ex.field.component';
import {WarehouseItemFormlySelectFieldComponent} from 'app/pages/components/app/module.components/warehouse/item/warehouse.item.select.field.component';
import {WarehouseBatchNoFormlySelectFieldComponent} from 'app/pages/components/app/module.components/warehouse/batchno/warehouse.batch.select.field.component';
import {WarehouseStorageFormlySelectFieldComponent} from 'app/pages/components/app/module.components/warehouse/storage/warehouse.storage.select.field.component';

export const BaseComponentsFormlyConfig: TypeOption[] = [
    {
        name: 'images-gallery',
        component: ImageGalleryFormFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'files-gallery',
        component: FileGalleryFormFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'treeview-dropdown',
        component: DropdownTreeviewFormFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'select-ex',
        component: SelectExFormFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'select-ngx',
        component: SelectFormFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'password',
        component: PasswordFormFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'date-picker',
        component: DatePickerFormFieldComponent,
        wrappers: ['form-field'],
    },
];

export const AppBaseComponentsFormlyConfig: TypeOption[] = [
    {
        name: 'select-ex-module',
        component: AppModuleFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'select-ngx-module',
        component: AppModuleFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'select-ex-general-settings',
        component: AppModuleSettingsFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'select-ngx-general-settings',
        component: AppModuleSettingsFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'select-ex-country',
        component: AppCountryFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'select-ngx-country',
        component: AppCountryFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'select-ex-province',
        component: AppProvinceFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'select-ngx-province',
        component: AppProvinceFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'select-ex-city',
        component: AppCityFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'select-ngx-city',
        component: AppCityFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'app-date-picker',
        component: AppFormlyDatePickerFieldComponent,
        wrappers: ['form-field'],
    },
];

export const AppComponentsFormlyConfig: TypeOption[] = [];

export const AppFeaturesComponentsFormlyConfig: TypeOption[] = [
    {
        name: 'system-language',
        component: AppLanguagesFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-system-language',
        component: AppLanguagesFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'vendor-customer',
        component: VendorCustomerFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-vendor-customer',
        component: VendorCustomerFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'system-status',
        component: SystemStatusFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-system-status',
        component: SystemStatusFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'system-currency',
        component: SystemCurrencyFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-system-currency',
        component: SystemCurrencyFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'system-customer-level',
        component: SystemCustomerLevelFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-system-customer-level',
        component: SystemCustomerLevelFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'system-customer-type',
        component: SystemCustomerTypeFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-system-customer-type',
        component: SystemCustomerTypeFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'system-organization-type',
        component: SystemOrganizationTypeFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-system-organization-type',
        component: SystemOrganizationTypeFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'warehouse-inventory-status',
        component: WarehouseInventoryStatusFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-warehouse-inventory-status',
        component: WarehouseInventoryStatusFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'warehouse-inventory-type',
        component: WarehouseInventoryTypeFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-warehouse-inventory-type',
        component: WarehouseInventoryTypeFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'warehouse-storage-type',
        component: WarehouseStorageTypeFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-warehouse-storage-type',
        component: WarehouseStorageTypeFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'warehouse-settings-type',
        component: WarehouseSettingsTypeFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-warehouse-settings-type',
        component: WarehouseSettingsTypeFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'warehouse-settings-brand',
        component: WarehouseSettingsBrandFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-warehouse-settings-brand',
        component: WarehouseSettingsBrandFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'warehouse-settings-item',
        component: WarehouseSettingsItemFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-warehouse-settings-item',
        component: WarehouseSettingsItemFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'warehouse-category-type',
        component: WarehouseCategoryTypeFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-warehouse-category-type',
        component: WarehouseCategoryTypeFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'organization-treeview',
        component: OrganizationFormlyTreeviewFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'warehouse-category-treeview',
        component: WarehouseCategoryFormlyTreeviewFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'warehouse-settings-batch',
        component: WarehouseSettingsBatchFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-warehouse-settings-batch',
        component: WarehouseSettingsBatchFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'warehouse-item',
        component: WarehouseItemFormlySelectExFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-warehouse-item',
        component: WarehouseItemFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-warehouse-batch',
        component: WarehouseBatchNoFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
    {
        name: 'ngx-warehouse-storage',
        component: WarehouseStorageFormlySelectFieldComponent,
        wrappers: ['form-field'],
    },
];

export const FormlyComponentsConfig: TypeOption[] = []
    .concat(...BaseComponentsFormlyConfig)
    .concat(...AppBaseComponentsFormlyConfig)
    .concat(...AppComponentsFormlyConfig)
    .concat(...AppFeaturesComponentsFormlyConfig);

export const FormlyConfig: ConfigOption = {
    types: FormlyComponentsConfig,
    validationMessages: [{
        name: 'required',
        message: 'common.form.required',
    }, {
        name: 'pattern_code',
        message: 'common.form.pattern_code',
    }],
};
