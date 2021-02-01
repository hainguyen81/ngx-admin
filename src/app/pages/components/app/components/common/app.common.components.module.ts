import {CommonModule} from '@angular/common';
import {TreeviewModule} from 'ngx-treeview';
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
import {Ng2SmartTableModule} from '@app/types/index';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {LoggerModule} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {AppCountryFormlySelectExFieldComponent} from './app.country.formly.select.ex.field.component';
import {NgxSelectModule} from 'ngx-select-ex';
import {ComponentsModule} from '../../../components.module';
import {AppCityFormlySelectExFieldComponent} from './app.city.formly.select.ex.field.component';
import {AppProvinceFormlySelectExFieldComponent} from './app.province.formly.select.ex.field.component';
import {AppModuleFormlySelectExFieldComponent} from './app.module.formly.select.ex.field.component';
import {AppModuleSettingsFormlySelectExFieldComponent} from './app.module.settings.formly.select.ex.field.component';
import {AppFormlyDatePickerFieldComponent} from './app.formly.datepicker.field.component';
import {AppCityFormlySelectFieldComponent} from './app.city.formly.select.field.component';
import {AppCountryFormlySelectFieldComponent} from './app.country.formly.select.field.component';
import {AppModuleFormlySelectFieldComponent} from './app.module.formly.select.field.component';
import {AppProvinceFormlySelectFieldComponent} from './app.province.formly.select.field.component';
import {AppModuleSettingsFormlySelectFieldComponent} from './app.module.settings.formly.select.field.component';
import {AppFormlySelectExFieldComponent} from './app.formly.select.ex.field.component';
import {AppFormlyTreeviewDropdownFieldComponent} from './app.formly.treeview.dropdown.field.component';
import {AppModuleDataFormlyTreeviewFieldComponent} from './app.module.data.formly.treeview.field.component';
import {AppModuleDataIndexFormlyTreeviewFieldComponent} from './app.module.data.index.formly.treeview.field.component';
import {AppModuleDataFormlySelectExFieldComponent} from './app.module.data.formly.select.ex.field.component';
import {AppFormlySelectFieldComponent} from './app.formly.select.field.component';
import {AppModuleDataFormlySelectFieldComponent} from './app.module.data.formly.select.field.component';
import {AppModuleDataIndexSettingsFormlySelectFieldComponent} from './app.module.data.index.formly.select.field.component';
import {AppModuleDataIndexSettingsFormlySelectExFieldComponent} from './app.module.data.index.formly.select.ex.field.component';
import {CustomFormsModule} from 'ngx-custom-validators';
import {ValidatorsModule} from 'ngx-validators';
import {FlipModule} from 'ngx-flip';
import {DynamicModule} from 'ng-dynamic-component';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {FormlyConfig} from 'app/config/formly.config';
import {AppLibraryModule} from '@app/app-library.module';
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

        /*Validators*/
        CustomFormsModule,
        ValidatorsModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        AppModuleSettingsFormlySelectFieldComponent,
        AppCityFormlySelectExFieldComponent,
        AppCityFormlySelectFieldComponent,
        AppCountryFormlySelectExFieldComponent,
        AppCountryFormlySelectFieldComponent,
        AppModuleFormlySelectExFieldComponent,
        AppModuleFormlySelectFieldComponent,
        AppFormlyDatePickerFieldComponent,
        AppProvinceFormlySelectExFieldComponent,
        AppProvinceFormlySelectFieldComponent,
        AppModuleSettingsFormlySelectExFieldComponent,
        AppFormlySelectExFieldComponent,
        AppFormlyTreeviewDropdownFieldComponent,
        AppModuleDataFormlyTreeviewFieldComponent,
        AppModuleDataIndexFormlyTreeviewFieldComponent,
        AppModuleDataFormlySelectExFieldComponent,
        AppFormlySelectFieldComponent,
        AppModuleDataFormlySelectFieldComponent,
        AppModuleDataIndexSettingsFormlySelectFieldComponent,
        AppModuleDataIndexSettingsFormlySelectExFieldComponent,
    ],
    exports: [
        AppModuleSettingsFormlySelectFieldComponent,
        AppCityFormlySelectExFieldComponent,
        AppCityFormlySelectFieldComponent,
        AppCountryFormlySelectExFieldComponent,
        AppCountryFormlySelectFieldComponent,
        AppModuleFormlySelectExFieldComponent,
        AppModuleFormlySelectFieldComponent,
        AppFormlyDatePickerFieldComponent,
        AppProvinceFormlySelectExFieldComponent,
        AppProvinceFormlySelectFieldComponent,
        AppModuleSettingsFormlySelectExFieldComponent,
        AppFormlySelectExFieldComponent,
        AppFormlyTreeviewDropdownFieldComponent,
        AppModuleDataFormlyTreeviewFieldComponent,
        AppModuleDataIndexFormlyTreeviewFieldComponent,
        AppModuleDataFormlySelectExFieldComponent,
        AppFormlySelectFieldComponent,
        AppModuleDataFormlySelectFieldComponent,
        AppModuleDataIndexSettingsFormlySelectFieldComponent,
        AppModuleDataIndexSettingsFormlySelectExFieldComponent,
    ],
    declarations: [
        AppModuleSettingsFormlySelectFieldComponent,
        AppCityFormlySelectExFieldComponent,
        AppCityFormlySelectFieldComponent,
        AppCountryFormlySelectExFieldComponent,
        AppCountryFormlySelectFieldComponent,
        AppModuleFormlySelectExFieldComponent,
        AppModuleFormlySelectFieldComponent,
        AppFormlyDatePickerFieldComponent,
        AppProvinceFormlySelectExFieldComponent,
        AppProvinceFormlySelectFieldComponent,
        AppModuleSettingsFormlySelectExFieldComponent,
        AppFormlySelectExFieldComponent,
        AppFormlyTreeviewDropdownFieldComponent,
        AppModuleDataFormlyTreeviewFieldComponent,
        AppModuleDataIndexFormlyTreeviewFieldComponent,
        AppModuleDataFormlySelectExFieldComponent,
        AppFormlySelectFieldComponent,
        AppModuleDataFormlySelectFieldComponent,
        AppModuleDataIndexSettingsFormlySelectFieldComponent,
        AppModuleDataIndexSettingsFormlySelectExFieldComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class AppCommonComponentsModule {
}
