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
import {OrganizationTreeviewComponent} from './organization.treeview.component';
import {OrganizationDataSource} from '../../../../../services/implementation/system/organization/organization.datasource';
import {
    OrganizationDbService,
    OrganizationHttpService,
} from '../../../../../services/implementation/system/organization/organization.service';
import {TreeviewModule} from 'ngx-treeview';
import {OrganizationFormlyComponent} from './organization.formly.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {OrganizationSplitPaneComponent} from './organization.component';
import {AngularSplitModule} from 'angular-split';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {AngularResizedEventModule} from 'angular-resize-event';
import {AppMaterialModule} from '../../../../../app.material.module';
import {OrganizationToolbarComponent} from './organization.toolbar.component';
import {OrganizationFormlyTreeviewDropdownFieldComponent} from './organization.formly.treeview.dropdown.field';
import {ComponentsModule} from "../../../components.module";

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
                    name: 'organization-treeview-dropdown',
                    component: OrganizationFormlyTreeviewDropdownFieldComponent,
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
        OrganizationTreeviewComponent,
        OrganizationFormlyComponent,
        OrganizationToolbarComponent,
        OrganizationFormlyTreeviewDropdownFieldComponent,
    ],
    declarations: [
        OrganizationTreeviewComponent,
        OrganizationFormlyComponent,
        OrganizationToolbarComponent,
        OrganizationSplitPaneComponent,
        OrganizationFormlyTreeviewDropdownFieldComponent,
    ],
    providers: [
        {
            provide: OrganizationDataSource, useClass: OrganizationDataSource,
            deps: [OrganizationHttpService, OrganizationDbService, NGXLogger],
        },
    ],
    exports: [
        OrganizationTreeviewComponent,
        OrganizationFormlyComponent,
        OrganizationToolbarComponent,
        OrganizationSplitPaneComponent,
        OrganizationFormlyTreeviewDropdownFieldComponent,
    ],
})
export class OrganizationModule {
}
