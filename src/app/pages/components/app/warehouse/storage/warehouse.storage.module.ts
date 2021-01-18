import {CommonModule} from '@angular/common';
import {TreeviewModule} from 'ngx-treeview';
import {AppComponentsModule} from '../../components/app.components.module';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContextMenuModule} from 'ngx-contextmenu';
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
import {AngularSplitModule} from 'angular-split';
import {WarehouseStorageTreeviewComponent} from './warehouse.storage.treeview.component';
import {Ng2SmartTableModule} from '@app/types/index';
import {WarehouseStorageFormlyComponent} from './warehouse.storage.formly.component';
import {ComponentsModule} from '../../../components.module';
import {WarehouseStorageToolbarComponent} from './warehouse.storage.toolbar.component';
import {FormlyModule} from '@ngx-formly/core';
import {WarehouseProviders} from '../../../../../config/app.providers';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {LoggerModule} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {WarehouseStorageSplitPaneComponent} from './warehouse.storage.component';
import {AppCommonComponentsModule} from '../../components/common/app.common.components.module';
import {FeaturesComponentsModule} from '../../module.components/features.components.module';
import {DynamicModule} from 'ng-dynamic-component';
import {FlipModule} from 'ngx-flip';
import {AppMaterialModule} from 'app/app.material.module';
import {FormlyConfig} from 'app/config/formly.config';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
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
    ],
    entryComponents: [
        WarehouseStorageTreeviewComponent,
        WarehouseStorageFormlyComponent,
        WarehouseStorageToolbarComponent,
        WarehouseStorageSplitPaneComponent,
    ],
    declarations: [
        WarehouseStorageTreeviewComponent,
        WarehouseStorageFormlyComponent,
        WarehouseStorageToolbarComponent,
        WarehouseStorageSplitPaneComponent,
    ],
    exports: [
        WarehouseStorageTreeviewComponent,
        WarehouseStorageFormlyComponent,
        WarehouseStorageToolbarComponent,
        WarehouseStorageSplitPaneComponent,
    ],
    providers: WarehouseProviders,
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class WarehouseStorageModule {
}
