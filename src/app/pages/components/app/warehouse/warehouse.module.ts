import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbOverlayModule,
    NbSelectModule,
    NbThemeModule,
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
import {AngularResizedEventModule} from 'angular-resize-event';
import {TreeviewModule} from 'ngx-treeview';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {WarehouseCategoryModule} from './category/warehouse.category.module';
import {WarehouseProviders} from '../../../../config/app.providers';
import {WarehouseStorageModule} from './storage/warehouse.storage.module';
import {WarehouseSettingsModule} from './settings/warehouse.settings.module';
import {WarehouseBatchNoModule} from './batchno/warehouse.batch.module';
import {WarehouseInventoryModule} from './inventory/warehouse.inventory.module';
import {FeaturesComponentsModule} from '../module.components/features.components.module';
import {ComponentsModule} from '../../components.module';
import {AppComponentsModule} from '../components/app.components.module';
import {AppCommonComponentsModule} from '../components/common/app.common.components.module';
import {DynamicModule} from 'ng-dynamic-component';
import {FlipModule} from 'ngx-flip';
import {AppMaterialModule} from 'app/app.material.module';
import {FormlyConfig} from 'app/config/formly.config';
import {OverlayModule} from '@angular/cdk/overlay';

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
        Ng2SmartTableModule,
        FormsModule,

        /* Dynamic component */
        DynamicModule,

        /* Flip */
        FlipModule,

        /* Angular material modules */
        AppMaterialModule,

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
        AppMaterialModule,

        /* Application components module */
        ComponentsModule,
        AppCommonComponentsModule,
        AppComponentsModule,
        FeaturesComponentsModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),

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
