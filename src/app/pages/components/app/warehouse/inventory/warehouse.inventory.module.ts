import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule, NbLayoutModule, NbSelectModule, NbThemeModule,} from '@nebular/theme';
import {Ng2SmartTableModule} from '@app/types/index';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {LoggerModule} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularResizedEventModule} from 'angular-resize-event';
import {AngularSplitModule} from 'angular-split';
import {TreeviewModule} from 'ngx-treeview';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {ComponentsModule} from '../../../components.module';
import {AppComponentsModule} from '../../components/app.components.module';
import {WarehouseInventorySearchFormlyComponent,} from './warehouse.inventory.search.formly.component';
import {WarehouseInventorySearchToolbarComponent,} from './warehouse.inventory.search.toolbar.component';
import {WarehouseInventorySearchComponent} from './warehouse.inventory.search.panel.component';
import {WarehouseInventoryToolbarComponent} from './warehouse.inventory.toolbar.component';
import {WarehouseInventorySmartTableComponent} from './warehouse.inventory.table.component';
import {WarehouseInventoryPanelComponent} from './warehouse.inventory.panel.component';
import {WarehouseInventoryComponent} from './warehouse.inventory.component';
import {WarehouseInventoryMainFormlyComponent} from './warehouse.inventory.main.formly.component';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {NgxSelectModule} from 'ngx-select-ex';
import {NgSelectModule} from '@ng-select/ng-select';
import {ModalDialogModule} from 'ngx-modal-dialog';
import {AppCommonComponentsModule} from '../../components/common/app.common.components.module';
import {FeaturesComponentsModule} from '../../module.components/features.components.module';
import {WarehouseInventoryDetailSmartTableComponent} from './warehouse.inventory.detail.table.component';
import {WarehouseInventoryDetailPanelComponent} from './warehouse.inventory.detail.panel.component';
import {WarehouseProviders} from '../../../../../config/app.providers';

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

        /* Application components module */
        ComponentsModule,
        AppComponentsModule,
        AppCommonComponentsModule,
        FeaturesComponentsModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    declarations: [
        WarehouseInventorySearchFormlyComponent,
        WarehouseInventorySearchToolbarComponent,
        WarehouseInventorySearchComponent,
        WarehouseInventoryToolbarComponent,
        WarehouseInventorySmartTableComponent,
        WarehouseInventoryPanelComponent,
        WarehouseInventoryComponent,
        WarehouseInventoryMainFormlyComponent,
        WarehouseInventoryDetailSmartTableComponent,
        WarehouseInventoryDetailPanelComponent,
    ],
    entryComponents: [
        WarehouseInventorySearchFormlyComponent,
        WarehouseInventorySearchToolbarComponent,
        WarehouseInventorySearchComponent,
        WarehouseInventoryToolbarComponent,
        WarehouseInventorySmartTableComponent,
        WarehouseInventoryPanelComponent,
        WarehouseInventoryComponent,
        WarehouseInventoryMainFormlyComponent,
        WarehouseInventoryDetailSmartTableComponent,
        WarehouseInventoryDetailPanelComponent,
    ],
    exports: [
        WarehouseInventorySearchFormlyComponent,
        WarehouseInventorySearchToolbarComponent,
        WarehouseInventorySearchComponent,
        WarehouseInventoryToolbarComponent,
        WarehouseInventorySmartTableComponent,
        WarehouseInventoryPanelComponent,
        WarehouseInventoryComponent,
        WarehouseInventoryMainFormlyComponent,
        WarehouseInventoryDetailSmartTableComponent,
        WarehouseInventoryDetailPanelComponent,
    ],
    providers: WarehouseProviders,
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class WarehouseInventoryModule {
}
