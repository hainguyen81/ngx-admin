import {NgModule} from '@angular/core';
import {SmartTableComponent} from './smart-table.component';
import {
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule,
    NbSearchModule,
    NbSelectModule,
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

@NgModule({
    imports: [
        CommonModule,
        NbInputModule,
        NbCheckboxModule,
        NbSelectModule,
        NbIconModule,
        NbCardModule,
        /* i18n */
        TranslateModule,
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
        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
        NbSearchModule,
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
