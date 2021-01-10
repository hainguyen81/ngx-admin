import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule, NbLayoutModule, NbSearchModule,
    NbSelectModule, NbTabsetModule, NbThemeModule,
} from '@nebular/theme';
import {Ng2SmartTableModule} from '@app/types/index';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {LoggerModule} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {TranslateModule} from '@ngx-translate/core';
import {WarehouseItemSmartTableComponent} from './warehouse.item.table.component';
import {WarehouseItemFlipcardComponent} from './warehouse.item.flipcard.component';
import {WarehouseItemTabsetComponent} from './warehouse.item.tab.component';
import {WarehouseItemSplitPaneComponent} from './warehouse.item.splitpane.component';
import {WarehouseItemToolbarComponent} from './warehouse.item.toolbar.component';
import {AngularSplitModule} from 'angular-split';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialModule} from '../../../../../app.material.module';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ToastrModule} from 'ngx-toastr';
import {TreeviewModule} from 'ngx-treeview';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {WarehouseItemSummaryComponent} from './warehouse.item.summary.component';
import {WarehouseItemOverviewFormlyComponent} from './warehouse.item.overview.component';
import {WarehouseItemOrdersSmartTableComponent} from './warehouse.item.orders.table.component';
import {WarehouseItemPurchaseOrdersSmartTableComponent} from './warehouse.item.purchase.orders.table.component';
import {WarehouseItemSaleOrdersSmartTableComponent} from './warehouse.item.sale.orders.table.component';
import {WarehouseItemInOutSmartTableComponent} from './warehouse.item.in.out.table.component';
import {WarehouseItemAdjustmentSmartTableComponent} from './warehouse.item.adjustment.table.component';
import {ComponentsModule} from '../../../components.module';
import {WarehouseProviders} from '../../../../../config/app.providers';
import {AppComponentsModule} from '../../components/app.components.module';
import {WarehouseItemVersionFormlyComponent} from './warehouse.item.version.formly.component';
import {WarehouseItemVersionSmartTableComponent} from './warehouse.item.version.table.component';
import {WarehouseItemVersionSplitPaneComponent} from './warehouse.item.version.splitpane.component';
import {AppCommonComponentsModule} from '../../components/common/app.common.components.module';
import {FeaturesComponentsModule} from '../../module.components/features.components.module';

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
        FormsModule,

        /* Angular material modules */
        AppMaterialModule,

        // Specify AngularResizedEventModule library as an import
        AngularResizedEventModule,

        /* i18n */
        TranslateModule,

        /* Toaster */
        ToastrModule,

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

        /* Application components module */
        ComponentsModule,
        AppComponentsModule,
        AppCommonComponentsModule,
        FeaturesComponentsModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        WarehouseItemFlipcardComponent,
        WarehouseItemSmartTableComponent,
        WarehouseItemTabsetComponent,
        WarehouseItemSplitPaneComponent,
        WarehouseItemToolbarComponent,
        WarehouseItemSummaryComponent,
        WarehouseItemOverviewFormlyComponent,
        WarehouseItemOrdersSmartTableComponent,
        WarehouseItemPurchaseOrdersSmartTableComponent,
        WarehouseItemSaleOrdersSmartTableComponent,
        WarehouseItemInOutSmartTableComponent,
        WarehouseItemAdjustmentSmartTableComponent,
        WarehouseItemVersionSmartTableComponent,
        WarehouseItemVersionFormlyComponent,
        WarehouseItemVersionSplitPaneComponent,
    ],
    declarations: [
        WarehouseItemFlipcardComponent,
        WarehouseItemSmartTableComponent,
        WarehouseItemTabsetComponent,
        WarehouseItemSplitPaneComponent,
        WarehouseItemToolbarComponent,
        WarehouseItemSummaryComponent,
        WarehouseItemOverviewFormlyComponent,
        WarehouseItemOrdersSmartTableComponent,
        WarehouseItemPurchaseOrdersSmartTableComponent,
        WarehouseItemSaleOrdersSmartTableComponent,
        WarehouseItemInOutSmartTableComponent,
        WarehouseItemAdjustmentSmartTableComponent,
        WarehouseItemVersionSmartTableComponent,
        WarehouseItemVersionFormlyComponent,
        WarehouseItemVersionSplitPaneComponent,
    ],
    exports: [
        WarehouseItemFlipcardComponent,
        WarehouseItemSmartTableComponent,
        WarehouseItemTabsetComponent,
        WarehouseItemSplitPaneComponent,
        WarehouseItemToolbarComponent,
        WarehouseItemSummaryComponent,
        WarehouseItemOverviewFormlyComponent,
        WarehouseItemOrdersSmartTableComponent,
        WarehouseItemPurchaseOrdersSmartTableComponent,
        WarehouseItemSaleOrdersSmartTableComponent,
        WarehouseItemInOutSmartTableComponent,
        WarehouseItemAdjustmentSmartTableComponent,
        WarehouseItemVersionSmartTableComponent,
        WarehouseItemVersionFormlyComponent,
        WarehouseItemVersionSplitPaneComponent,
    ],
    providers: WarehouseProviders,
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class WarehouseItemModule {
}
