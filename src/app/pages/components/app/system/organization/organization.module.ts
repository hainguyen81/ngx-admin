import {NgModule} from '@angular/core';
import {
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {TranslateModule} from '@ngx-translate/core';
import {OrganizationTreeviewComponent} from './organization.treeview.component';
import {OrganizationDataSource} from '../../../../../services/implementation/organization/organization.datasource';
import {
    OrganizationDbService,
    OrganizationHttpService,
} from '../../../../../services/implementation/organization/organization.service';
import {TreeviewModule} from 'ngx-treeview';
import {OrganizationFormlyComponent} from './organization.formly.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {OrganizationSplitPaneComponent} from './organization.component';
import {AngularSplitModule} from 'angular-split';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {AngularResizedEventModule} from 'angular-resize-event';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NbIconModule,
        NbCardModule,
        NbInputModule,
        NbCheckboxModule,
        NbSelectModule,
        Ng2SmartTableModule,

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

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        OrganizationTreeviewComponent,
        OrganizationFormlyComponent,
    ],
    declarations: [
        OrganizationTreeviewComponent,
        OrganizationFormlyComponent,
        OrganizationSplitPaneComponent,
    ],
    providers: [
        {
            provide: OrganizationDataSource, useClass: OrganizationDataSource,
            deps: [OrganizationHttpService, OrganizationDbService, NGXLogger],
        },
    ],
})
export class OrganizationModule {
}
