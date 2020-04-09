import {NgModule} from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbSelectModule,
    NbThemeModule,
} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {TranslateModule} from '@ngx-translate/core';
import {TreeviewModule} from 'ngx-treeview';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AngularSplitModule} from 'angular-split';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {AngularResizedEventModule} from 'angular-resize-event';
import {AppMaterialModule} from '../../../../../app.material.module';
import {WarehouseCategoryFormlyComponent} from './warehouse.category.formly.component';
import {WarehouseCategorySplitPaneComponent} from './warehouse.category.component';
import {WarehouseCategoryToolbarComponent} from './warehouse.category.toolbar.component';
import {WarehouseCategoryTreeviewComponent} from './warehouse.category.treeview.component';
import {
    WarehouseCategoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import {
    WarehouseCategoryDbService,
    WarehouseCategoryHttpService,
} from '../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.service';
import {ComponentsModule} from '../../../components.module';
import {WarehouseCategoryFormlyTreeviewDropdownFieldComponent} from './warehouse.category.formly.treeview.dropdown.field';

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
        FormlyModule.forRoot({
            types: [
                {
                    name: 'warehouse-category-treeview-dropdown',
                    component: WarehouseCategoryFormlyTreeviewDropdownFieldComponent,
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

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        WarehouseCategoryTreeviewComponent,
        WarehouseCategoryFormlyComponent,
        WarehouseCategoryToolbarComponent,
        WarehouseCategorySplitPaneComponent,
        WarehouseCategoryFormlyTreeviewDropdownFieldComponent,
    ],
    declarations: [
        WarehouseCategoryTreeviewComponent,
        WarehouseCategoryFormlyComponent,
        WarehouseCategoryToolbarComponent,
        WarehouseCategorySplitPaneComponent,
        WarehouseCategoryFormlyTreeviewDropdownFieldComponent,
    ],
    providers: [
        {
            provide: WarehouseCategoryDatasource, useClass: WarehouseCategoryDatasource,
            deps: [WarehouseCategoryHttpService, WarehouseCategoryDbService, NGXLogger],
        },
    ],
    exports: [
        WarehouseCategoryFormlyTreeviewDropdownFieldComponent,
    ],
})
export class WarehouseCategoryModule {
}
