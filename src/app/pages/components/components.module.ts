import {NgModule} from '@angular/core';
import {SmartTableComponent} from './smart-table.component';
import {NbCardModule, NbContextMenuModule, NbIconModule} from '@nebular/theme';
import {LocalDataSource, Ng2SmartTableModule} from 'ng2-smart-table';
import {NotFoundComponent} from './not-found.component';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {LoggerModule} from 'ngx-logger';
import {AppConfig} from '../../config/app.config';

@NgModule({
    imports: [
        CommonModule,
        NbIconModule,
        NbCardModule,
        Ng2SmartTableModule,
        NbContextMenuModule,
        ContextMenuModule.forRoot({
            autoFocus: true,
            useBootstrap4: true,
        }),
        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    declarations: [
        SmartTableComponent,
        NotFoundComponent,
    ],
    providers: [
        {provide: DataSource, useClass: LocalDataSource, deps: []},
    ],
})
export class ComponentsModule {
}
