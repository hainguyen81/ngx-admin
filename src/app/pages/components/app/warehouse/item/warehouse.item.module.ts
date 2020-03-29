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
import {WarehouseItemSmartTableComponent} from './warehouse.item.table.component';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {
    WarehouseItemDbService,
    WarehouseItemHttpService,
} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.service';
import {WarehouseItemFlipcardComponent} from './warehouse.item.flipcard.component';
import {WarehouseItemTabsetComponent} from './warehouse.item.tab.component';

@NgModule({
    imports: [
        CommonModule,
        NbIconModule,
        NbCardModule,
        NbInputModule,
        NbCheckboxModule,
        NbSelectModule,
        Ng2SmartTableModule,
        /* i18n */
        TranslateModule,
        /* Context Menu */
        NbContextMenuModule,
        ContextMenuModule.forRoot({
            autoFocus: true,
            useBootstrap4: true,
        }),
        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        WarehouseItemFlipcardComponent,
        WarehouseItemSmartTableComponent,
        WarehouseItemTabsetComponent,
    ],
    declarations: [
        WarehouseItemFlipcardComponent,
        WarehouseItemSmartTableComponent,
        WarehouseItemTabsetComponent,
    ],
    providers: [
        {
            provide: WarehouseItemDatasource, useClass: WarehouseItemDatasource,
            deps: [WarehouseItemHttpService, WarehouseItemDbService, NGXLogger],
        },
    ],
})
export class WarehouseItemModule {
}
