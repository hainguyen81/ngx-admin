import {NgModule} from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule, NbLayoutModule,
    NbSelectModule, NbThemeModule,
} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialModule} from '../../../../../app.material.module';
import {AngularResizedEventModule} from 'angular-resize-event';
import {AngularSplitModule} from 'angular-split';
import {TreeviewModule} from 'ngx-treeview';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {ComponentsModule} from '../../../components.module';
import {AppComponentsModule} from '../../components/app.components.module';
import {WarehouseInventorySearchFormlyComponent} from './warehouse.inventory.search.formly.component';
import {
    WarehouseInventoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.inventory/warehouse.inventory.datasource';
import {
    WarehouseInventoryDbService,
    WarehouseInventoryHttpService,
} from '../../../../../services/implementation/warehouse/warehouse.inventory/warehouse.inventory.service';

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
    declarations: [
        WarehouseInventorySearchFormlyComponent,
    ],
    entryComponents: [
        WarehouseInventorySearchFormlyComponent,
    ],
    providers: [
        {
            provide: WarehouseInventoryDatasource, useClass: WarehouseInventoryDatasource,
            deps: [WarehouseInventoryHttpService, WarehouseInventoryDbService, NGXLogger],
        },
    ],
})
export class WarehouseInventoryModule {
}
