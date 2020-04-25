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
import {CustomerDatasource} from '../../../../../services/implementation/system/customer/customer.datasource';
import {TranslateModule} from '@ngx-translate/core';
import {CustomerDbService, CustomerHttpService} from '../../../../../services/implementation/system/customer/customer.service';
import {CustomerSmartTableComponent} from './customer.table.component';
import {CustomerToolbarComponent} from './customer.toolbar.component';
import {CustomerFormlyComponent} from './customer.formly.component';
import {CustomerComponent} from './customer.component';

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
        CustomerSmartTableComponent,
        CustomerToolbarComponent,
        CustomerFormlyComponent,
        CustomerComponent,
    ],
    providers: [
        {
            provide: CustomerDatasource, useClass: CustomerDatasource,
            deps: [CustomerHttpService, CustomerDbService, NGXLogger],
        },
    ],
})
export class CustomerModule {
}
