import {NgModule} from '@angular/core';
import {NbCardModule, NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule, NbSelectModule} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {UserDataSource} from '../../../services/implementation/user/user.datasource';
import {UserDbService, UserHttpService} from '../../../services/implementation/user/user.service';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {AppConfig} from '../../../config/app.config';
import {CustomerSmartTableComponent} from './customer.component';
import {CustomerDatasource} from '../../../services/implementation/customer/customer.datasource';

@NgModule({
    imports: [
        CommonModule,
        NbIconModule,
        NbCardModule,
        NbInputModule,
        NbCheckboxModule,
        NbSelectModule,
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
        CustomerSmartTableComponent,
    ],
    providers: [
        {
            provide: CustomerDatasource, useClass: UserDataSource,
            deps: [UserHttpService, UserDbService, NGXLogger],
        },
    ],
})
export class CustomerModule {
}
