import {NgModule} from '@angular/core';
import {SmartTableComponent} from './smart-table/smart-table.component';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbSearchModule,
    NbSelectModule,
    NbThemeModule,
} from '@nebular/theme';
import {LocalDataSource, Ng2SmartTableModule} from 'ng2-smart-table';
import {NotFoundComponent} from './not-found.component';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {LoggerModule} from 'ngx-logger';
import {AppConfig} from '../../config/app.config';
import {TreeviewModule} from 'ngx-treeview';
import {TranslateModule} from '@ngx-translate/core';
import {AngularSplitModule} from 'angular-split';
import {NgxTreeviewComponent} from './treeview/treeview.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {NgxFormlyComponent} from './formly/formly.component';
import {NgxSplitPaneComponent} from './splitpane/splitpane.component';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AppMaterialModule} from '../../app.material.module';
import {ThemeModule} from '../../@theme/theme.module';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ToastContainerModule, ToastrModule} from 'ngx-toastr';
import {NgxToolbarComponent} from './toolbar/toolbar.component';
import {AlertPopupModule, ConfirmPopupModule, PromptPopupModule} from 'ngx-material-popup';
import {ModalDialogModule} from 'ngx-modal-dialog';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {CellModule} from 'ng2-smart-table/components/cell/cell.module';
import {CheckboxCellComponent} from './smart-table/checkbox.cell.component';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NbThemeModule,
        NbLayoutModule,
        NbInputModule,
        NbCheckboxModule,
        NbSelectModule,
        NbIconModule,
        NbButtonModule,
        NbCardModule,
        NbSearchModule,
        FormsModule,

        /* Angular material modules */
        AppMaterialModule,

        /* Popup, Dialogs */
        AlertPopupModule,
        ConfirmPopupModule,
        PromptPopupModule,
        ModalDialogModule.forRoot(),

        // Specify AngularResizedEventModule library as an import
        AngularResizedEventModule,

        /* i18n */
        TranslateModule,

        /* Toaster */
        ToastrModule,
        ToastContainerModule,

        /* Table */
        Ng2SmartTableModule,
        CellModule,

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
        FormlyMatDatepickerModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        CheckboxCellComponent,
    ],
    declarations: [
        SmartTableComponent,
        CheckboxCellComponent,
        NgxToolbarComponent,
        NgxTreeviewComponent,
        NgxFormlyComponent,
        NgxSplitPaneComponent,
        NotFoundComponent,
    ],
    providers: [
        {provide: DataSource, useClass: LocalDataSource, deps: []},
    ],
})
export class ComponentsModule {
}
