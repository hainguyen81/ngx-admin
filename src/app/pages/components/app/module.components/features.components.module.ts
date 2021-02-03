import {CommonModule} from '@angular/common';
import {TreeviewModule} from 'ngx-treeview';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContextMenuModule} from 'ngx-contextmenu';
import {
    NbBadgeModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbOverlayModule,
    NbSelectModule,
} from '@nebular/theme';
import {AngularSplitModule} from 'angular-split';
import {Ng2SmartTableModule} from '@app/types/index';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AngularResizedEventModule} from 'angular-resize-event';
import {LoggerModule} from 'ngx-logger';
import {NgxSelectModule} from 'ngx-select-ex';
import {AppComponentsModule} from '../components/app.components.module';
import {ThemeModule} from '../../../../@theme/theme.module';
import {ComponentsModule} from '../../components.module';
import {AppConfig} from '../../../../config/app.config';
import {AppCommonComponentsModule} from '../components/common/app.common.components.module';
import {VendorCustomerFormlySelectExFieldComponent} from './common/vendor.customer.select.ex.field.component';
import {SystemStatusFormlySelectExFieldComponent} from './common/system.status.select.ex.field.component';
import {SystemCurrencyFormlySelectExFieldComponent} from './common/system.currency.select.ex.field.component';
import {SystemCustomerLevelFormlySelectExFieldComponent} from './common/system.customer.level.select.ex.field.component';
import {SystemCustomerTypeFormlySelectExFieldComponent} from './common/system.customer.type.select.ex.field.component';
import {SystemOrganizationTypeFormlySelectExFieldComponent} from './common/system.organization.type.select.ex.field.component';
import {WarehouseInventoryStatusFormlySelectExFieldComponent} from './common/warehouse.inventory.status.select.ex.field.component';
import {WarehouseInventoryTypeFormlySelectExFieldComponent} from './common/warehouse.inventory.type.select.ex.field.component';
import {WarehouseSettingsTypeFormlySelectExFieldComponent} from './common/warehouse.settings.type.select.ex.field.component';
import {WarehouseCategoryTypeFormlySelectExFieldComponent} from './common/warehouse.category.type.select.ex.field.component';
import {AppLanguagesFormlySelectExFieldComponent} from './common/app.languages.select.ex.field.component';
import {WarehouseSettingsBrandFormlySelectExFieldComponent} from './warehouse/settings/warehouse.settings.brand.select.ex.field.component';
import {WarehouseSettingsItemFormlySelectExFieldComponent} from './warehouse/settings/warehouse.settings.item.select.ex.field.component';
import {OrganizationFormlyTreeviewFieldComponent} from './system/organization.formly.treeview.field.component';
import {WarehouseCategoryFormlyTreeviewFieldComponent} from './warehouse/category/warehouse.category.formly.treeview.field.component';
import {WarehouseSettingsBatchFormlySelectExFieldComponent} from './warehouse/settings/warehouse.settings.batch.select.ex.field.component';
import {WarehouseItemFormlySelectExFieldComponent} from './warehouse/item/warehouse.item.select.ex.field.component';
import {WarehouseItemCellComponent} from './warehouse/item/warehouse.item.cell.component';
import {AppLanguagesFormlySelectFieldComponent} from './common/app.languages.select.field.component';
import {SystemCurrencyFormlySelectFieldComponent} from './common/system.currency.select.field.component';
import {SystemCustomerLevelFormlySelectFieldComponent} from './common/system.customer.level.select.field.component';
import {SystemCustomerTypeFormlySelectFieldComponent} from './common/system.customer.type.select.field.component';
import {SystemOrganizationTypeFormlySelectFieldComponent} from './common/system.organization.type.select.field.component';
import {SystemStatusFormlySelectFieldComponent} from './common/system.status.select.field.component';
import {VendorCustomerFormlySelectFieldComponent} from './common/vendor.customer.select.field.component';
import {WarehouseCategoryTypeFormlySelectFieldComponent} from './common/warehouse.category.type.select.field.component';
import {WarehouseInventoryStatusFormlySelectFieldComponent} from './common/warehouse.inventory.status.select.field.component';
import {WarehouseInventoryTypeFormlySelectFieldComponent} from './common/warehouse.inventory.type.select.field.component';
import {WarehouseSettingsTypeFormlySelectFieldComponent} from './common/warehouse.settings.type.select.field.component';
import {WarehouseItemFormlySelectFieldComponent} from './warehouse/item/warehouse.item.select.field.component';
import {WarehouseSettingsBatchFormlySelectFieldComponent} from './warehouse/settings/warehouse.settings.batch.select.field.component';
import {WarehouseSettingsBrandFormlySelectFieldComponent} from './warehouse/settings/warehouse.settings.brand.select.field.component';
import {WarehouseSettingsItemFormlySelectFieldComponent} from './warehouse/settings/warehouse.settings.item.select.field.component';
import {WarehouseBatchNoFormlySelectFieldComponent} from './warehouse/batchno/warehouse.batch.select.field.component';
import {WarehouseInventoryDetailBatchNoCellComponent} from './warehouse/inventory/warehouse.inventory.detail.batch.cell.component';
import {WarehouseInventoryDetailSerialCellComponent} from './warehouse/inventory/warehouse.inventory.detail.serial.cell.component';
import {WarehouseStorageFormlySelectFieldComponent} from './warehouse/storage/warehouse.storage.select.field.component';
import {WarehouseInventoryDetailStorageCellComponent} from './warehouse/inventory/warehouse.inventory.detail.storage.cell.component';
import {WarehouseInventoryDetailSummaryComponent} from './warehouse/inventory/warehouse.inventory.detail.summary.component';
import {AppMultilinguageLabelComponent} from './common/app.multilinguage.label.component';
import {WarehouseStorageTypeFormlySelectExFieldComponent} from './common/warehouse.storage.type.select.ex.field.component';
import {WarehouseStorageTypeFormlySelectFieldComponent} from './common/warehouse.storage.type.select.field.component';
import {GeneralSettingsFormlySelectExFieldComponent} from './common/general.settings.select.ex.field.component';
import {GeneralSystemSettingsFormlySelectExFieldComponent} from './common/general.system.settings.select.ex.field.component';
import {GeneralSettingsFormlySelectFieldComponent} from './common/general.settings.select.field.component';
import {GeneralSystemSettingsFormlySelectFieldComponent} from './common/general.system.settings.select.field.component';
import {GeneralWarehouseSettingsFormlySelectExFieldComponent} from './common/general.warehouse.settings.select.ex.field.component';
import {GeneralWarehouseSettingsFormlySelectFieldComponent} from './common/general.warehouse.settings.select.field.component';
import {WarehouseSettingsFormlySelectExFieldComponent} from './warehouse/settings/warehouse.settings.select.ex.field.component';
import {WarehouseSettingsFormlySelectFieldComponent} from './warehouse/settings/warehouse.settings.select.field.component';
import {DynamicModule} from 'ng-dynamic-component';
import {FlipModule} from 'ngx-flip';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {FormlyConfig} from 'app/config/formly.config';
import {AppLibraryModule} from '@app/app-library.module';
import {OverlayModule} from '@angular/cdk/overlay';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NbBadgeModule,
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

        /* Dynamic component */
        DynamicModule,

        /* Flip */
        FlipModule,

        // Specify AngularResizedEventModule library as an import
        AngularResizedEventModule,

        /* i18n */
        TranslateModule,

        /* Context Menu */
        NbOverlayModule,
        NbContextMenuModule,
        OverlayModule,
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
        FormlyModule.forRoot(FormlyConfig),
        FormlyModule.forChild(FormlyConfig),
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
        FormlyMatDatepickerModule,

        /* Material */
        AppLibraryModule,

        /* Application components module */
        ComponentsModule,
        AppCommonComponentsModule,
        AppComponentsModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        AppMultilinguageLabelComponent,
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
        WarehouseStorageTypeFormlySelectExFieldComponent,
        WarehouseStorageTypeFormlySelectFieldComponent,
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
        WarehouseInventoryDetailSummaryComponent,
        GeneralSettingsFormlySelectExFieldComponent,
        GeneralSystemSettingsFormlySelectExFieldComponent,
        GeneralSettingsFormlySelectFieldComponent,
        GeneralSystemSettingsFormlySelectFieldComponent,
        GeneralWarehouseSettingsFormlySelectExFieldComponent,
        GeneralWarehouseSettingsFormlySelectFieldComponent,
        WarehouseSettingsFormlySelectExFieldComponent,
        WarehouseSettingsFormlySelectFieldComponent,
    ],
    exports: [
        AppMultilinguageLabelComponent,
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
        WarehouseStorageTypeFormlySelectExFieldComponent,
        WarehouseStorageTypeFormlySelectFieldComponent,
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
        WarehouseInventoryDetailSummaryComponent,
        GeneralSettingsFormlySelectExFieldComponent,
        GeneralSystemSettingsFormlySelectExFieldComponent,
        GeneralSettingsFormlySelectFieldComponent,
        GeneralSystemSettingsFormlySelectFieldComponent,
        GeneralWarehouseSettingsFormlySelectExFieldComponent,
        GeneralWarehouseSettingsFormlySelectFieldComponent,
        WarehouseSettingsFormlySelectExFieldComponent,
        WarehouseSettingsFormlySelectFieldComponent,
    ],
    declarations: [
        AppMultilinguageLabelComponent,
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
        WarehouseStorageTypeFormlySelectExFieldComponent,
        WarehouseStorageTypeFormlySelectFieldComponent,
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
        WarehouseInventoryDetailSummaryComponent,
        GeneralSettingsFormlySelectExFieldComponent,
        GeneralSystemSettingsFormlySelectExFieldComponent,
        GeneralSettingsFormlySelectFieldComponent,
        GeneralSystemSettingsFormlySelectFieldComponent,
        GeneralWarehouseSettingsFormlySelectExFieldComponent,
        GeneralWarehouseSettingsFormlySelectFieldComponent,
        WarehouseSettingsFormlySelectExFieldComponent,
        WarehouseSettingsFormlySelectFieldComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class FeaturesComponentsModule {
}
