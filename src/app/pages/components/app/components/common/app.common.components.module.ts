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
                    name: 'select-ex-general-settings',
                    component: AppModuleSettingsFormlySelectExFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ex-country',
                    component: AppCountryFormlySelectExFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ex-province',
                    component: AppProvinceFormlySelectExFieldComponent,
                    wrappers: ['form-field'],
                },
                {
                    name: 'select-ex-city',
                    component: AppCityFormlySelectExFieldComponent,
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
        AppModuleFormlySelectExFieldComponent,
        AppCountryFormlySelectExFieldComponent,
        AppProvinceFormlySelectExFieldComponent,
        AppCityFormlySelectExFieldComponent,
        AppModuleSettingsFormlySelectExFieldComponent,
    ],
    exports: [
        AppModuleFormlySelectExFieldComponent,
        AppCountryFormlySelectExFieldComponent,
        AppProvinceFormlySelectExFieldComponent,
        AppCityFormlySelectExFieldComponent,
        AppModuleSettingsFormlySelectExFieldComponent,
    ],
    declarations: [
        AppModuleFormlySelectExFieldComponent,
        AppCountryFormlySelectExFieldComponent,
        AppProvinceFormlySelectExFieldComponent,
        AppCityFormlySelectExFieldComponent,
        AppModuleSettingsFormlySelectExFieldComponent,
    ],
})
export class AppCommonComponentsModule {
}
