import {NgModule, Renderer2} from '@angular/core';
import {
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule, NbTabsetModule,
} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse-item/warehouse-item.datasource';
import {TranslateModule} from '@ngx-translate/core';
import {
    WarehouseItemDbService,
    WarehouseItemHttpService,
} from '../../../../../services/implementation/warehouse-item/warehouse-item.service';
import {WarehouseItemFlipcardComponent} from './warehouse-item.component';
import {WarehouseItemTabsetComponent} from './warehouse-item.tabset.component';
import {WarehouseItemSmartTableComponent} from './warehouse-item.smarttable.component';

@NgModule({
    imports: [
        CommonModule,
        NbIconModule,
        NbCardModule,
        NbInputModule,
        NbCheckboxModule,
        NbSelectModule,
        Ng2SmartTableModule,
        NbTabsetModule,
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
        WarehouseItemSmartTableComponent,
        WarehouseItemTabsetComponent,
    ],
    declarations: [
        WarehouseItemSmartTableComponent,
        WarehouseItemTabsetComponent,
        WarehouseItemFlipcardComponent,
    ],
    providers: [
        {
            provide: WarehouseItemDatasource, useClass: WarehouseItemDatasource,
            deps: [WarehouseItemHttpService, WarehouseItemDbService, NGXLogger],
        },
        { provide: WarehouseItemSmartTableComponent, useClass: WarehouseItemSmartTableComponent },
    ],
})
export class WarehouseItemModule {
}
