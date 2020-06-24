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
import {ComponentsModule} from '../../components.module';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ThemeModule} from '../../../../@theme/theme.module';
import {LoggerModule} from 'ngx-logger';
import {AppMaterialModule} from '../../../../app.material.module';
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
import {AppTableFlipComponent} from './app.table.flip.component';
import {AppTableFlipFormComponent} from './app.table.flip.form.component';
import {AppTreeviewComponent} from './app.treeview.component';
import {AppSplitPaneComponent} from './app.splitpane.component';
import {AppTreeSplitFormComponent} from './app.treeview.splitpane.form.component';
import {AppTabsetComponent} from './app.tabset.component';
import {AppPanelComponent} from './app.panel.component';

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
        FormlyModule.forRoot({
            validationMessages: [{
                name: 'required',
                message: 'common.form.required',
            }, {
                name: 'pattern_code',
                message: 'common.form.pattern_code',
            }],
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
        FormlyMatDatepickerModule,

        /*Validators*/
        CustomFormsModule,
        ValidatorsModule,

        /* Application components module */
        ComponentsModule,

        /* Application common components module */
        AppCommonComponentsModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        AppSmartTableComponent,
        AppFormlyComponent,
        AppToolbarComponent,
        AppFlipcardComponent,
        AppTableFlipComponent,
        AppTableFlipFormComponent,
        AppTreeviewComponent,
        AppSplitPaneComponent,
        AppTreeSplitFormComponent,
        AppTabsetComponent,
        AppPanelComponent,
    ],
    exports: [
        AppSmartTableComponent,
        AppFormlyComponent,
        AppToolbarComponent,
        AppFlipcardComponent,
        AppTableFlipComponent,
        AppTableFlipFormComponent,
        AppTreeviewComponent,
        AppSplitPaneComponent,
        AppTreeSplitFormComponent,
        AppTabsetComponent,
        AppPanelComponent,
    ],
    declarations: [
        AppSmartTableComponent,
        AppFormlyComponent,
        AppToolbarComponent,
        AppFlipcardComponent,
        AppTableFlipComponent,
        AppTableFlipFormComponent,
        AppTreeviewComponent,
        AppSplitPaneComponent,
        AppTreeSplitFormComponent,
        AppTabsetComponent,
        AppPanelComponent,
    ],
})
export class AppComponentsModule {
}
