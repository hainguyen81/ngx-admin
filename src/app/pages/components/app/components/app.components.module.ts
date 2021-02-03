import {CommonModule} from '@angular/common';
import {TreeviewModule} from 'ngx-treeview';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContextMenuModule} from 'ngx-contextmenu';
import {
    NbBadgeModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbOverlayModule,
    NbSelectModule,
} from '@nebular/theme';
import {AngularSplitModule} from 'angular-split';
import {Ng2SmartTableModule} from '@app/types/index';
import {ComponentsModule} from '../../components.module';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ThemeModule} from '../../../../@theme/theme.module';
import {LoggerModule} from 'ngx-logger';
import {AppConfig} from '../../../../config/app.config';
import {AppCommonComponentsModule} from './common/app.common.components.module';
import {NgxSelectModule} from 'ngx-select-ex';
import {CustomFormsModule} from 'ngx-custom-validators';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {ValidatorsModule} from 'ngx-validators';
import {NgSelectModule} from '@ng-select/ng-select';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {ModalDialogModule} from 'ngx-modal-dialog';
import {AppSmartTableComponent} from './app.table.component';
import {AppFormlyComponent} from './app.formly.component';
import {AppToolbarComponent} from './app.toolbar.component';
import {AppFlipcardComponent} from './app.flipcard.component';
import {AppTableFlipcardComponent} from './app.table.flipcard.component';
import {AppTableFlipcardFormComponent} from './app.table.flipcard.form.component';
import {AppTreeviewComponent} from './app.treeview.component';
import {AppSplitPaneComponent} from './app.splitpane.component';
import {AppTreeSplitFormComponent} from './app.treeview.splitpane.form.component';
import {AppTabsetComponent} from './app.tabset.component';
import {AppPanelComponent} from './app.panel.component';
import {AppSearchPanelComponent} from './app.search.panel.component';
import {AppFlipComponent} from './app.flip.component';
import {AppTableFlipComponent} from './app.table.flip.component';
import {AppTableFlipFormComponent} from './app.table.flip.form.component';
import {DynamicModule} from 'ng-dynamic-component';
import {FlipModule} from 'ngx-flip';
import {FormlyConfig} from 'app/config/formly.config';
import {AppLibraryModule} from '@app/app-library.module';
import {OverlayModule} from '@angular/cdk/overlay';
import {TabsModule} from '~/ngx-tabset';
import {AppTabset2Component} from '@app/pages/components/app/components/app.tabset2.component';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NbBadgeModule,
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

        /* Tree-view */
        TreeviewModule.forRoot(),

        /* SplitPane */
        AngularSplitModule.forRoot(),

        /* Selection Dropdown */
        SelectDropDownModule,

        /* Select-ex */
        NgxSelectModule,

        /* @ng-select/ng-select */
        NgSelectModule,

        /* Modal dialog */
        ModalDialogModule.forRoot(),

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

        /*Validators*/
        CustomFormsModule,
        ValidatorsModule,

        /* Material */
        AppLibraryModule,

        /* ngxTabset */
        TabsModule.forRoot(),

        /* Application components module */
        ComponentsModule,
        AppCommonComponentsModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        AppSmartTableComponent,
        AppFormlyComponent,
        AppToolbarComponent,
        AppFlipComponent,
        AppTableFlipComponent,
        AppTableFlipFormComponent,
        AppFlipcardComponent,
        AppTableFlipcardComponent,
        AppTableFlipcardFormComponent,
        AppTreeviewComponent,
        AppSplitPaneComponent,
        AppTreeSplitFormComponent,
        AppTabsetComponent,
        AppTabset2Component,
        AppPanelComponent,
        AppSearchPanelComponent,
    ],
    exports: [
        AppSmartTableComponent,
        AppFormlyComponent,
        AppToolbarComponent,
        AppFlipComponent,
        AppTableFlipComponent,
        AppTableFlipFormComponent,
        AppFlipcardComponent,
        AppTableFlipcardComponent,
        AppTableFlipcardFormComponent,
        AppTreeviewComponent,
        AppSplitPaneComponent,
        AppTreeSplitFormComponent,
        AppTabsetComponent,
        AppTabset2Component,
        AppPanelComponent,
        AppSearchPanelComponent,
    ],
    declarations: [
        AppSmartTableComponent,
        AppFormlyComponent,
        AppToolbarComponent,
        AppFlipComponent,
        AppTableFlipComponent,
        AppTableFlipFormComponent,
        AppFlipcardComponent,
        AppTableFlipcardComponent,
        AppTableFlipcardFormComponent,
        AppTreeviewComponent,
        AppSplitPaneComponent,
        AppTreeSplitFormComponent,
        AppTabsetComponent,
        AppTabset2Component,
        AppPanelComponent,
        AppSearchPanelComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class AppComponentsModule {
}
