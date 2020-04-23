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
import {
    WarehouseSettingsDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.datasource';
import {
    WarehouseSettingsDbService,
    WarehouseSettingsHttpService,
} from '../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.service';
import {WarehouseSettingsFormlyComponent} from './warehouse.settings.formly.component';
import {WarehouseSettingsToolbarComponent} from './warehouse.settings.toolbar.component';
import {WarehouseSettingsSmartTableComponent} from './warehouse.settings.table.component';
import {WarehouseSettingsComponent} from './warehouse.settings.component';

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
        WarehouseSettingsSmartTableComponent,
        WarehouseSettingsFormlyComponent,
        WarehouseSettingsToolbarComponent,
        WarehouseSettingsComponent,
    ],
    providers: [
        {
            provide: WarehouseSettingsDatasource, useClass: WarehouseSettingsDatasource,
            deps: [WarehouseSettingsHttpService, WarehouseSettingsDbService, NGXLogger],
        },
    ],
})
export class WarehouseSettingsModule {
}
