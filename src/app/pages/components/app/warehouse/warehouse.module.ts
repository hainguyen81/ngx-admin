import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule, NbLayoutModule, NbSearchModule,
    NbSelectModule, NbTabsetModule, NbThemeModule,
} from '@nebular/theme';
import {Ng2SmartTableModule} from '@app/types/index';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {LoggerModule} from 'ngx-logger';
import {AppConfig} from '../../../../config/app.config';
import {TranslateModule} from '@ngx-translate/core';
import {WarehouseItemModule} from './item/warehouse.item.module';
import {AngularSplitModule} from 'angular-split';
import {ThemeModule} from '../../../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialModule} from '../../../../app.material.module';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ToastrModule} from 'ngx-toastr';
import {TreeviewModule} from 'ngx-treeview';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {WarehouseCategoryModule} from './category/warehouse.category.module';
import {WarehouseProviders} from '../../../../config/app.providers';
import {WarehouseStorageModule} from './storage/warehouse.storage.module';
import {WarehouseSettingsModule} from './settings/warehouse.settings.module';
import {WarehouseBatchNoModule} from './batchno/warehouse.batch.module';
import {WarehouseInventoryModule} from './inventory/warehouse.inventory.module';
import {NgxSelectModule} from 'ngx-select-ex';
import {NgSelectModule} from '@ng-select/ng-select';
import {ModalDialogModule} from 'ngx-modal-dialog';
import {FeaturesComponentsModule} from '../module.components/features.components.module';
import {ComponentsModule} from '../../components.module';
import {AppComponentsModule} from '../components/app.components.module';
import {AppCommonComponentsModule} from '../components/common/app.common.components.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NbThemeModule,
        NbLayoutModule,
        NbInputModule,
        NbCheckboxModule,
        NbSelectModule,
        NbIconModule,
        NbButtonModule,
        NbCardModule,
        NbSearchModule,
        NbTabsetModule,
        FormsModule,

        /* Angular material modules */
        AppMaterialModule,

        // Specify AngularResizedEventModule library as an import
        AngularResizedEventModule,

        /* i18n */
        TranslateModule,

        /* Toaster */
        ToastrModule,

        /* Table */
        Ng2SmartTableModule,

        /* Context Menu */
        NbContextMenuModule,
        ContextMenuModule.forRoot({
            autoFocus: true,
            useBootstrap4: true,
        }),

        /* Tree-view */
        TreeviewModule.forRoot(),

        /* SplitPane */
        AngularSplitModule.forRoot(),

        /* Selection Dropdown */
        SelectDropDownModule,

        /* Select-ex */
        NgxSelectModule,

        /* @ng-select/ng-select */
        NgSelectModule,

        /* Modal dialog */
        ModalDialogModule.forRoot(),

        /* Formly for form builder */
        ReactiveFormsModule,
        FormlyModule.forRoot(),
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

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),

        /* Application components module */
        ComponentsModule,
        AppComponentsModule,
        AppCommonComponentsModule,
        FeaturesComponentsModule,

        /* Modules */
        WarehouseItemModule,
        WarehouseCategoryModule,
        WarehouseStorageModule,
        WarehouseSettingsModule,
        WarehouseBatchNoModule,
        WarehouseInventoryModule,
    ],
    providers: [ WarehouseProviders ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class WarehouseModule {
}
