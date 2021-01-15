import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA,} from '@angular/core';
import {SmartTableComponent} from './smart-table/smart-table.component';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbSearchModule,
    NbSelectModule,
    NbTabsetModule,
    NbThemeModule,
    NbTooltipModule,
} from '@nebular/theme';
import {LocalDataSource, Ng2SmartTableModule} from 'ng2-smart-table';
import {NotFoundComponent} from './not-found.component';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {DataSource} from '@app/types/index';
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
import {ThemeModule} from '../../@theme/theme.module';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ToastrModule} from 'ngx-toastr';
import {NgxToolbarComponent} from './toolbar/toolbar.component';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {NgxFlipCardComponent} from './flipcard/flipcard.component';
import {NgxRevealCardComponent} from './revealcard/revealcard.component';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {CheckboxCellComponent} from './smart-table/checkbox.cell.component';
import {NgxTabsetComponent} from './tab/tab.component';
import {ComponentPlaceholderDirective} from './component.placeholder.directive';
import {ImageCellComponent} from './smart-table/image.cell.component';
import {LightboxModule} from 'ngx-lightbox';
import {NgxImageGalleryComponent} from './image/image.component';
import {ImageGalleryFormFieldComponent} from './formly/formly.image.field.component';
import {DropdownTreeviewFormFieldComponent} from './formly/formly.treeview.dropdown.field.component';
import {NgxDropdownTreeviewComponent} from './treeview/treeview.dropdown.component';
import {NgxSelectModule} from 'ngx-select-ex';
import {NgxSelectExComponent} from './select-ex/select.ex.component';
import {SelectExFormFieldComponent} from './formly/formly.select.ex.field.component';
import {CustomFormsModule} from 'ngx-custom-validators';
import {ValidatorsModule} from 'ngx-validators';
import {PasswordFormFieldComponent} from './formly/formly.password.field.component';
import {SelectTranslateCellComponent} from './smart-table/select.translate.cell.component';
import {NumberCellComponent} from './smart-table/number.cell.component';
import {RowNumberCellComponent} from './smart-table/row.number.cell.component';
import {BarcodeCellComponent} from './smart-table/barcode.cell.component';
import {NgxBarcodeModule} from 'ngx-barcode';
import {BarecodeScannerLivestreamModule} from 'ngx-barcode-scanner';
import {ModalDialogModule} from 'ngx-modal-dialog';
import {HtmlCellComponent} from './smart-table/html.cell.component';
import {DpDatePickerModule} from 'ng2-date-picker';
import {NgxDatePickerComponent} from './datepicker/datepicker.component';
import {DatePickerCellComponent} from './smart-table/datepicker.cell.component';
import {DatePickerFormFieldComponent} from './formly/formly.datepicker.field.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxPanelComponent} from './panel/panel.component';
import {ObserveCellComponent} from './smart-table/observe.cell.component';
import {NgxFileGalleryComponent} from './file/file.component';
import {FileGalleryFormFieldComponent} from './formly/formly.file.field.component';
import {NgxSelectComponent} from './select/select.component';
import {SelectFormFieldComponent} from './formly/formly.select.field.component';
import {BaseSmartTableComponent} from './smart-table/base.smart-table.component';
import {BaseFormlyComponent} from './formly/base.formly.component';
import {BaseNgxToolbarComponent} from './toolbar/base.toolbar.component';
import {BaseFlipcardComponent} from './flipcard/base.flipcard.component';
import {BaseNgxTreeviewComponent} from './treeview/base.treeview.component';
import {BaseNgxDropdownTreeviewComponent} from './treeview/base.treeview.dropdown.component';
import {BaseSplitPaneComponent} from './splitpane/base.splitpane.component';
import {BaseTabsetComponent} from './tab/base.tab.component';
import {BasePanelComponent} from './panel/base.panel.component';
import {FlipModule} from 'ngx-flip';
import {NgxFlipComponent} from 'app/pages/components/flip/flip.component';
import {BaseFlipComponent} from 'app/pages/components/flip/base.flip.component';
import {DynamicModule} from 'ng-dynamic-component';
import {FormlyConfig} from 'app/config/formly.config';
import {AppMaterialModule} from 'app/app.material.module';

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
        NbTabsetModule,
        NbDatepickerModule,
        NbTooltipModule,
        FormsModule,

        /* Dynamic component */
        DynamicModule,

        /* Flip */
        FlipModule,

        // Specify AngularResizedEventModule library as an import
        AngularResizedEventModule,

        /* i18n */
        TranslateModule,

        /* Toaster */
        ToastrModule,

        /* Lightbox */
        LightboxModule,

        /* Flip */
        FlipModule,

        /* Table */
        Ng2SmartTableModule,

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

        /*Validators*/
        CustomFormsModule,
        ValidatorsModule,

        /* Datepicker */
        DpDatePickerModule,

        /* Barcode */
        NgxBarcodeModule.forRoot(),
        BarecodeScannerLivestreamModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        SelectTranslateCellComponent,
        CheckboxCellComponent,
        ImageCellComponent,
        NgxImageGalleryComponent,
        ImageGalleryFormFieldComponent,
        NgxTreeviewComponent,
        NgxDropdownTreeviewComponent,
        DropdownTreeviewFormFieldComponent,
        NgxSelectExComponent,
        SelectExFormFieldComponent,
        PasswordFormFieldComponent,
        NumberCellComponent,
        RowNumberCellComponent,
        BarcodeCellComponent,
        HtmlCellComponent,
        NgxDatePickerComponent,
        DatePickerCellComponent,
        DatePickerFormFieldComponent,
        NgxPanelComponent,
        ObserveCellComponent,
        NgxFileGalleryComponent,
        FileGalleryFormFieldComponent,
        NgxSelectComponent,
        SelectFormFieldComponent,
    ],
    declarations: [
        BaseSmartTableComponent,
        SmartTableComponent,
        NgxToolbarComponent,
        BaseNgxToolbarComponent,
        NgxTreeviewComponent,
        BaseNgxTreeviewComponent,
        BaseNgxDropdownTreeviewComponent,
        NgxFormlyComponent,
        BaseFormlyComponent,
        SelectTranslateCellComponent,
        NumberCellComponent,
        RowNumberCellComponent,
        CheckboxCellComponent,
        ImageCellComponent,
        NgxSplitPaneComponent,
        BaseSplitPaneComponent,
        NgxFlipComponent,
        BaseFlipComponent,
        NgxFlipCardComponent,
        BaseFlipcardComponent,
        NgxRevealCardComponent,
        NgxTabsetComponent,
        BaseTabsetComponent,
        NotFoundComponent,
        ComponentPlaceholderDirective,
        NgxImageGalleryComponent,
        ImageGalleryFormFieldComponent,
        NgxDropdownTreeviewComponent,
        DropdownTreeviewFormFieldComponent,
        NgxSelectExComponent,
        SelectExFormFieldComponent,
        PasswordFormFieldComponent,
        BarcodeCellComponent,
        HtmlCellComponent,
        NgxDatePickerComponent,
        DatePickerCellComponent,
        DatePickerFormFieldComponent,
        NgxPanelComponent,
        BasePanelComponent,
        ObserveCellComponent,
        NgxFileGalleryComponent,
        FileGalleryFormFieldComponent,
        NgxSelectComponent,
        SelectFormFieldComponent,
    ],
    exports: [
        BaseSmartTableComponent,
        SmartTableComponent,
        NgxToolbarComponent,
        BaseNgxToolbarComponent,
        NgxTreeviewComponent,
        BaseNgxTreeviewComponent,
        BaseNgxDropdownTreeviewComponent,
        NgxFormlyComponent,
        BaseFormlyComponent,
        SelectTranslateCellComponent,
        NumberCellComponent,
        RowNumberCellComponent,
        CheckboxCellComponent,
        ImageCellComponent,
        NgxSplitPaneComponent,
        BaseSplitPaneComponent,
        NgxFlipComponent,
        BaseFlipComponent,
        NgxFlipCardComponent,
        BaseFlipcardComponent,
        NgxRevealCardComponent,
        NgxTabsetComponent,
        BaseTabsetComponent,
        NotFoundComponent,
        ComponentPlaceholderDirective,
        NgxImageGalleryComponent,
        ImageGalleryFormFieldComponent,
        NgxDropdownTreeviewComponent,
        DropdownTreeviewFormFieldComponent,
        NgxSelectExComponent,
        SelectExFormFieldComponent,
        PasswordFormFieldComponent,
        BarcodeCellComponent,
        HtmlCellComponent,
        NgxDatePickerComponent,
        DatePickerCellComponent,
        DatePickerFormFieldComponent,
        NgxPanelComponent,
        BasePanelComponent,
        ObserveCellComponent,
        NgxFileGalleryComponent,
        FileGalleryFormFieldComponent,
        NgxSelectComponent,
        SelectFormFieldComponent,
    ],
    providers: [
        {provide: DataSource, useClass: LocalDataSource, deps: []},
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class ComponentsModule {
}
