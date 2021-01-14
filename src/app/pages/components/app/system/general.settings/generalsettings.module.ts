import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule, NbLayoutModule, NbSelectModule, NbThemeModule,} from '@nebular/theme';
import {Ng2SmartTableModule} from '@app/types/index';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularResizedEventModule} from 'angular-resize-event';
import {AngularSplitModule} from 'angular-split';
import {TreeviewModule} from 'ngx-treeview';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {ComponentsModule} from '../../../components.module';
import {AppComponentsModule} from '../../components/app.components.module';
import {GeneralSettingsSmartTableComponent} from './general.settings.table.component';
import {GeneralSettingsFormlyComponent} from './general.settings.formly.component';
import {GeneralSettingsToolbarComponent} from './general.settings.toolbar.component';
import {GeneralSettingsComponent} from './general.settings.component';
import {GeneralSettingsDatasource,} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {GeneralSettingsDbService, GeneralSettingsHttpService,} from '../../../../../services/implementation/system/general.settings/general.settings.service';
import {AppCommonComponentsModule} from '../../components/common/app.common.components.module';
import {FeaturesComponentsModule} from '../../module.components/features.components.module';

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

        /* SplitPane */
        AngularSplitModule.forRoot(),

        /* Tree-view */
        TreeviewModule.forRoot(),

        /* Formly for form builder */
        ReactiveFormsModule,
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
        GeneralSettingsSmartTableComponent,
        GeneralSettingsFormlyComponent,
        GeneralSettingsToolbarComponent,
        GeneralSettingsComponent,
    ],
    entryComponents: [
        GeneralSettingsSmartTableComponent,
        GeneralSettingsFormlyComponent,
        GeneralSettingsToolbarComponent,
        GeneralSettingsComponent,
    ],
    providers: [
        {
            provide: GeneralSettingsDatasource, useClass: GeneralSettingsDatasource,
            deps: [GeneralSettingsHttpService, GeneralSettingsDbService, NGXLogger],
        },
    ],
    exports: [
        GeneralSettingsSmartTableComponent,
        GeneralSettingsFormlyComponent,
        GeneralSettingsToolbarComponent,
        GeneralSettingsComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class GeneralSettingsModule {
}