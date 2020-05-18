import {CommonModule} from '@angular/common';
import {TreeviewModule} from 'ngx-treeview';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContextMenuModule} from 'ngx-contextmenu';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbSelectModule,
    NbThemeModule,
} from '@nebular/theme';
import {AngularSplitModule} from 'angular-split';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AngularResizedEventModule} from 'angular-resize-event';
import {LoggerModule} from 'ngx-logger';
import {NgxSelectModule} from 'ngx-select-ex';
import {AppComponentsModule} from '../components/app.components.module';
import {ThemeModule} from '../../../../@theme/theme.module';
import {ComponentsModule} from '../../components.module';
import {AppMaterialModule} from '../../../../app.material.module';
import {AppConfig} from '../../../../config/app.config';
import {AppCommonComponentsModule} from '../components/common/app.common.components.module';
import {
    VendorCustomerFormlySelectExFieldComponent,
} from './common/vendor.customer.select.ex.field.component';
import {
    SystemStatusFormlySelectExFieldComponent,
} from './common/system.status.select.ex.field.component';
import {
    SystemCurrencyFormlySelectExFieldComponent,
} from './common/system.currency.select.ex.field.component';
import {
    SystemCustomerLevelFormlySelectExFieldComponent,
} from './common/system.customer.level.select.ex.field.component';
import {
    SystemCustomerTypeFormlySelectExFieldComponent,
} from './common/system.customer.type.select.ex.field.component';
import {
    SystemOrganizationTypeFormlySelectExFieldComponent,
} from './common/system.organization.type.select.ex.field.component';
import {
    WarehouseInventoryStatusFormlySelectExFieldComponent,
} from './common/warehouse.inventory.status.select.ex.field.component';
import {
    WarehouseInventoryTypeFormlySelectExFieldComponent,
} from './common/warehouse.inventory.type.select.ex.field.component';
import {
    WarehouseSettingsTypeFormlySelectExFieldComponent,
} from './common/warehouse.settings.type.select.ex.field.component';
import {
    WarehouseCategoryTypeFormlySelectExFieldComponent,
} from './common/warehouse.category.type.select.ex.field.component';
import {
    AppLanguagesFormlySelectExFieldComponent,
} from './common/app.languages.select.ex.field.component';
import {
    WarehouseSettingsBrandFormlySelectExFieldComponent,
} from './warehouse/settings/warehouse.settings.brand.select.ex.field.component';
import {
    WarehouseSettingsItemFormlySelectExFieldComponent,
} from './warehouse/settings/warehouse.settings.item.select.ex.field.component';
import {
    OrganizationFormlyTreeviewFieldComponent,
} from './system/organization.formly.treeview.field.component';
import {
    WarehouseCategoryFormlyTreeviewFieldComponent,
} from './warehouse/category/warehouse.category.formly.treeview.field.component';
import {
    WarehouseSettingsBatchFormlySelectExFieldComponent,
} from './warehouse/settings/warehouse.settings.batch.select.ex.field.component';
import {
    WarehouseItemFormlySelectExFieldComponent,
} from './warehouse/item/warehouse.item.select.ex.field.component';
import {WarehouseItemCellComponent} from './warehouse/item/warehouse.item.cell.component';
import {
    AppLanguagesFormlySelectFieldComponent,
} from './common/app.languages.select.field.component';
import {
    SystemCurrencyFormlySelectFieldComponent,
} from './common/system.currency.select.field.component';
import {
    SystemCustomerLevelFormlySelectFieldComponent,
} from './common/system.customer.level.select.field.component';
import {
    SystemCustomerTypeFormlySelectFieldComponent,
} from './common/system.customer.type.select.field.component';
import {
    SystemOrganizationTypeFormlySelectFieldComponent,
} from './common/system.organization.type.select.field.component';
import {
    SystemStatusFormlySelectFieldComponent,
} from './common/system.status.select.field.component';
import {
    VendorCustomerFormlySelectFieldComponent,
} from './common/vendor.customer.select.field.component';
import {
    WarehouseCategoryTypeFormlySelectFieldComponent,
} from './common/warehouse.category.type.select.field.component';
import {
    WarehouseInventoryStatusFormlySelectFieldComponent,
} from './common/warehouse.inventory.status.select.field.component';
import {
    WarehouseInventoryTypeFormlySelectFieldComponent,
} from './common/warehouse.inventory.type.select.field.component';
import {
    WarehouseSettingsTypeFormlySelectFieldComponent,
} from './common/warehouse.settings.type.select.field.component';
import {
    WarehouseItemFormlySelectFieldComponent,
} from './warehouse/item/warehouse.item.select.field.component';
import {
    WarehouseSettingsBatchFormlySelectFieldComponent,
} from './warehouse/settings/warehouse.settings.batch.select.field.component';
import {
    WarehouseSettingsBrandFormlySelectFieldComponent,
} from './warehouse/settings/warehouse.settings.brand.select.field.component';
import {
    WarehouseSettingsItemFormlySelectFieldComponent,
} from './warehouse/settings/warehouse.settings.item.select.field.component';
import {
    WarehouseBatchNoFormlySelectFieldComponent,
} from './warehouse/batchno/warehouse.batch.select.field.component';
import {
    WarehouseInventoryDetailBatchNoCellComponent,
} from './warehouse/inventory/warehouse.inventory.detail.batch.cell.component';
import {
    WarehouseInventoryDetailSerialCellComponent,
} from './warehouse/inventory/warehouse.inventory.detail.serial.cell.component';
import {
    WarehouseStorageFormlySelectFieldComponent,
} from './warehouse/storage/warehouse.storage.select.field.component';
import {
    WarehouseInventoryDetailStorageCellComponent,
} from './warehouse/inventory/warehouse.inventory.detail.storage.cell.component';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NbThemeModule,
        NbIconModule,
        NbCardModule,
        NbInputModule,
        NbCheckboxModule,
        NbSelectModule,
        NbButtonModule,
        NbLayoutModule,
        NbDatepickerModule,
        Ng2SmartTableModule,
        FormsModule,

        /* Angular material modules */
        AppMaterialModule,

        // Specify AngularResizedEventModule library as an import
        AngularResizedEventModule,

        /* i18n */
        TranslateModule,

        /* Context Menu */
        NbContextMenuModule,
        ContextMenuModule.forRoot({
            autoFocus: true,
            useBootstrap4: true,
        }),

        /* SplitPane */
        AngularSplitModule.forRoot(),

        /* Tree-view */
        TreeviewModule.forRoot(),

        /* Select-ex */
        NgxSelectModule,

        /* Formly for form builder */
        ReactiveFormsModule,
        FormlyModule.forRoot({
            types: [
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
            ],
        }),
        /**
         * - Bootstrap:    FormlyBootstrapModule
         * - Material2:    FormlyMaterialModule
         * - Ionic:        FormlyIonicModule
         * - PrimeNG:      FormlyPrimeNGModule
         * - Kendo:        FormlyKendoModule
         * - NativeScript: FormlyNativescriptModule
         */
        /*FormlyBootstrapModule,*/
        FormlyMaterialModule,

        /* Application components module */
        ComponentsModule,
        AppComponentsModule,
        AppCommonComponentsModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        AppLanguagesFormlySelectExFieldComponent,
        AppLanguagesFormlySelectFieldComponent,
        VendorCustomerFormlySelectExFieldComponent,
        VendorCustomerFormlySelectFieldComponent,
        SystemStatusFormlySelectExFieldComponent,
        SystemStatusFormlySelectFieldComponent,
        SystemCurrencyFormlySelectExFieldComponent,
        SystemCurrencyFormlySelectFieldComponent,
        SystemCustomerLevelFormlySelectExFieldComponent,
        SystemCustomerLevelFormlySelectFieldComponent,
        SystemCustomerTypeFormlySelectExFieldComponent,
        SystemCustomerTypeFormlySelectFieldComponent,
        SystemOrganizationTypeFormlySelectExFieldComponent,
        SystemOrganizationTypeFormlySelectFieldComponent,
        WarehouseInventoryStatusFormlySelectExFieldComponent,
        WarehouseInventoryStatusFormlySelectFieldComponent,
        WarehouseInventoryTypeFormlySelectExFieldComponent,
        WarehouseInventoryTypeFormlySelectFieldComponent,
        WarehouseSettingsTypeFormlySelectExFieldComponent,
        WarehouseSettingsTypeFormlySelectFieldComponent,
        WarehouseCategoryTypeFormlySelectExFieldComponent,
        WarehouseCategoryTypeFormlySelectFieldComponent,
        WarehouseSettingsBrandFormlySelectExFieldComponent,
        WarehouseSettingsBrandFormlySelectFieldComponent,
        WarehouseSettingsItemFormlySelectExFieldComponent,
        WarehouseSettingsItemFormlySelectFieldComponent,
        OrganizationFormlyTreeviewFieldComponent,
        WarehouseCategoryFormlyTreeviewFieldComponent,
        WarehouseSettingsBatchFormlySelectExFieldComponent,
        WarehouseSettingsBatchFormlySelectFieldComponent,
        WarehouseItemFormlySelectExFieldComponent,
        WarehouseItemFormlySelectFieldComponent,
        WarehouseItemCellComponent,
        WarehouseBatchNoFormlySelectFieldComponent,
        WarehouseInventoryDetailBatchNoCellComponent,
        WarehouseInventoryDetailSerialCellComponent,
        WarehouseStorageFormlySelectFieldComponent,
        WarehouseInventoryDetailStorageCellComponent,
    ],
    exports: [
        AppLanguagesFormlySelectExFieldComponent,
        AppLanguagesFormlySelectFieldComponent,
        VendorCustomerFormlySelectExFieldComponent,
        VendorCustomerFormlySelectFieldComponent,
        SystemStatusFormlySelectExFieldComponent,
        SystemStatusFormlySelectFieldComponent,
        SystemCurrencyFormlySelectExFieldComponent,
        SystemCurrencyFormlySelectFieldComponent,
        SystemCustomerLevelFormlySelectExFieldComponent,
        SystemCustomerLevelFormlySelectFieldComponent,
        SystemCustomerTypeFormlySelectExFieldComponent,
        SystemCustomerTypeFormlySelectFieldComponent,
        SystemOrganizationTypeFormlySelectExFieldComponent,
        SystemOrganizationTypeFormlySelectFieldComponent,
        WarehouseInventoryStatusFormlySelectExFieldComponent,
        WarehouseInventoryStatusFormlySelectFieldComponent,
        WarehouseInventoryTypeFormlySelectExFieldComponent,
        WarehouseInventoryTypeFormlySelectFieldComponent,
        WarehouseSettingsTypeFormlySelectExFieldComponent,
        WarehouseSettingsTypeFormlySelectFieldComponent,
        WarehouseCategoryTypeFormlySelectExFieldComponent,
        WarehouseCategoryTypeFormlySelectFieldComponent,
        WarehouseSettingsBrandFormlySelectExFieldComponent,
        WarehouseSettingsBrandFormlySelectFieldComponent,
        WarehouseSettingsItemFormlySelectExFieldComponent,
        WarehouseSettingsItemFormlySelectFieldComponent,
        OrganizationFormlyTreeviewFieldComponent,
        WarehouseCategoryFormlyTreeviewFieldComponent,
        WarehouseSettingsBatchFormlySelectExFieldComponent,
        WarehouseSettingsBatchFormlySelectFieldComponent,
        WarehouseItemFormlySelectExFieldComponent,
        WarehouseItemFormlySelectFieldComponent,
        WarehouseItemCellComponent,
        WarehouseBatchNoFormlySelectFieldComponent,
        WarehouseInventoryDetailBatchNoCellComponent,
        WarehouseInventoryDetailSerialCellComponent,
        WarehouseStorageFormlySelectFieldComponent,
        WarehouseInventoryDetailStorageCellComponent,
    ],
    declarations: [
        AppLanguagesFormlySelectExFieldComponent,
        AppLanguagesFormlySelectFieldComponent,
        VendorCustomerFormlySelectExFieldComponent,
        VendorCustomerFormlySelectFieldComponent,
        SystemStatusFormlySelectExFieldComponent,
        SystemStatusFormlySelectFieldComponent,
        SystemCurrencyFormlySelectExFieldComponent,
        SystemCurrencyFormlySelectFieldComponent,
        SystemCustomerLevelFormlySelectExFieldComponent,
        SystemCustomerLevelFormlySelectFieldComponent,
        SystemCustomerTypeFormlySelectExFieldComponent,
        SystemCustomerTypeFormlySelectFieldComponent,
        SystemOrganizationTypeFormlySelectExFieldComponent,
        SystemOrganizationTypeFormlySelectFieldComponent,
        WarehouseInventoryStatusFormlySelectExFieldComponent,
        WarehouseInventoryStatusFormlySelectFieldComponent,
        WarehouseInventoryTypeFormlySelectExFieldComponent,
        WarehouseInventoryTypeFormlySelectFieldComponent,
        WarehouseSettingsTypeFormlySelectExFieldComponent,
        WarehouseSettingsTypeFormlySelectFieldComponent,
        WarehouseCategoryTypeFormlySelectExFieldComponent,
        WarehouseCategoryTypeFormlySelectFieldComponent,
        WarehouseSettingsBrandFormlySelectExFieldComponent,
        WarehouseSettingsBrandFormlySelectFieldComponent,
        WarehouseSettingsItemFormlySelectExFieldComponent,
        WarehouseSettingsItemFormlySelectFieldComponent,
        OrganizationFormlyTreeviewFieldComponent,
        WarehouseCategoryFormlyTreeviewFieldComponent,
        WarehouseSettingsBatchFormlySelectExFieldComponent,
        WarehouseSettingsBatchFormlySelectFieldComponent,
        WarehouseItemFormlySelectExFieldComponent,
        WarehouseItemFormlySelectFieldComponent,
        WarehouseItemCellComponent,
        WarehouseBatchNoFormlySelectFieldComponent,
        WarehouseInventoryDetailBatchNoCellComponent,
        WarehouseInventoryDetailSerialCellComponent,
        WarehouseStorageFormlySelectFieldComponent,
        WarehouseInventoryDetailStorageCellComponent,
    ],
})
export class FeaturesComponentsModule {
}
