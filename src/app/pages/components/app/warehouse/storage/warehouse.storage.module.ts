import {CommonModule} from '@angular/common';
import {TreeviewModule} from 'ngx-treeview';
import {AppComponentsModule} from '../../components/app.components.module';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContextMenuModule} from 'ngx-contextmenu';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule, NbIconModule, NbInputModule,
    NbLayoutModule,
    NbSelectModule,
    NbThemeModule,
} from '@nebular/theme';
import {AngularSplitModule} from 'angular-split';
import {WarehouseStorageTreeviewComponent} from './warehouse.storage.treeview.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {WarehouseStorageFormlyComponent} from './warehouse.storage.formly.component';
import {ComponentsModule} from '../../../components.module';
import {WarehouseStorageToolbarComponent} from './warehouse.storage.toolbar.component';
import {FormlyModule} from '@ngx-formly/core';
import {WarehouseProviders} from '../../../../../config/app.providers';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {LoggerModule} from 'ngx-logger';
import {AppMaterialModule} from '../../../../../app.material.module';
import {AppConfig} from '../../../../../config/app.config';
import {WarehouseStorageSplitPaneComponent} from './warehouse.storage.component';

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

        /* Application components module */
        ComponentsModule,
        AppComponentsModule,

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
    providers: [ WarehouseProviders ],
    exports: [
        WarehouseStorageTreeviewComponent,
        WarehouseStorageFormlyComponent,
        WarehouseStorageToolbarComponent,
        WarehouseStorageSplitPaneComponent,
    ],
})
export class WarehouseStorageModule {
}
