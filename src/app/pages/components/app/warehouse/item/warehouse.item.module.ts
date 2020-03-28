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
    declarations: [
        WarehouseItemSmartTableComponent,
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
