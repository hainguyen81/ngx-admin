import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {CustomerDatasource} from '../../../../../services/implementation/system/customer/customer.datasource';
import {CustomerDbService, CustomerHttpService} from '../../../../../services/implementation/system/customer/customer.service';
import {CustomerSmartTableComponent} from './customer.table.component';
import {CustomerToolbarComponent} from './customer.toolbar.component';
import {CustomerFormlyComponent} from './customer.formly.component';
import {CustomerComponent} from './customer.component';
import {ComponentsModule} from '../../../components.module';
import {AppComponentsModule} from '../../components/app.components.module';
import {AppCommonComponentsModule} from '../../components/common/app.common.components.module';
import {FeaturesComponentsModule} from '../../module.components/features.components.module';
import {CommonModule} from '@angular/common';
import {ThemeModule} from 'app/@theme/theme.module';
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
import {Ng2SmartTableModule} from 'app/@types/index';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DynamicModule} from 'ng-dynamic-component';
import {FlipModule} from 'ngx-flip';
import {AppMaterialModule} from 'app/app.material.module';
import {AngularResizedEventModule} from 'angular-resize-event';
import {TranslateModule} from '@ngx-translate/core';
import {ContextMenuModule} from 'ngx-contextmenu';
import {AngularSplitModule} from 'angular-split';
import {TreeviewModule} from 'ngx-treeview';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyConfig} from 'app/config/formly.config';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {AppConfig} from 'app/config/app.config';
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
    declarations: [
        CustomerSmartTableComponent,
        CustomerToolbarComponent,
        CustomerFormlyComponent,
        CustomerComponent,
    ],
    entryComponents: [
        CustomerSmartTableComponent,
        CustomerToolbarComponent,
        CustomerFormlyComponent,
        CustomerComponent,
    ],
    providers: [
        {
            provide: CustomerDatasource, useClass: CustomerDatasource,
            deps: [CustomerHttpService, CustomerDbService, NGXLogger],
        },
    ],
    exports: [
        CustomerSmartTableComponent,
        CustomerToolbarComponent,
        CustomerFormlyComponent,
        CustomerComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class CustomerModule {
}
