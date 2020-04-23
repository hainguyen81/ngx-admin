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
import {
    WarehouseSettingsDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.datasource';
import {
    WarehouseSettingsDbService,
    WarehouseSettingsHttpService,
} from '../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.service';
import {WarehouseSettingsFormlyComponent} from './warehouse.settings.formly.component';
import {WarehouseSettingsToolbarComponent} from './warehouse.settings.toolbar.component';
import {WarehouseSettingsSmartTableComponent} from './warehouse.settings.table.component';
import {WarehouseSettingsComponent} from './warehouse.settings.component';
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
        WarehouseSettingsSmartTableComponent,
        WarehouseSettingsFormlyComponent,
        WarehouseSettingsToolbarComponent,
        WarehouseSettingsComponent,
    ],
    entryComponents: [
        WarehouseSettingsSmartTableComponent,
        WarehouseSettingsFormlyComponent,
        WarehouseSettingsToolbarComponent,
        WarehouseSettingsComponent,
    ],
    providers: [
        {
            provide: WarehouseSettingsDatasource, useClass: WarehouseSettingsDatasource,
            deps: [WarehouseSettingsHttpService, WarehouseSettingsDbService, NGXLogger],
        },
    ],
})
export class WarehouseSettingsModule {
}
