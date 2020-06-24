import {CommonModule} from '@angular/common';
import {TreeviewModule} from 'ngx-treeview';
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
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {LoggerModule} from 'ngx-logger';
import {AppMaterialModule} from '../../../../../app.material.module';
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

        /* Select-ex */
        NgxSelectModule,

        /* Formly for form builder */
        ReactiveFormsModule,
        FormlyModule.forRoot({
            types: [
                {
                    name: 'select-ex-module',
                    component: AppModuleFormlySelectExFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ngx-module',
                    component: AppModuleFormlySelectFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ex-general-settings',
                    component: AppModuleSettingsFormlySelectExFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ngx-general-settings',
                    component: AppModuleSettingsFormlySelectFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ex-country',
                    component: AppCountryFormlySelectExFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ngx-country',
                    component: AppCountryFormlySelectFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ex-province',
                    component: AppProvinceFormlySelectExFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ngx-province',
                    component: AppProvinceFormlySelectFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ex-city',
                    component: AppCityFormlySelectExFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ngx-city',
                    component: AppCityFormlySelectFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'app-date-picker',
                    component: AppFormlyDatePickerFieldComponent,
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
    ],
})
export class AppCommonComponentsModule {
}
