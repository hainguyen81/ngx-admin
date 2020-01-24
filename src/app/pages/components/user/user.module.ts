import {NgModule} from '@angular/core';
import {UserSmartTableComponent} from './user.component';
import {NbCardModule, NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule, NbSelectModule} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {UserDataSource} from '../../../services/implementation/user/user.datasource';
import {UserDbService, UserHttpService} from '../../../services/implementation/user/user.service';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {AppConfig} from '../../../config/app.config';

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
        UserSmartTableComponent,
    ],
    providers: [
        {
            provide: UserDataSource, useClass: UserDataSource,
            deps: [UserHttpService, UserDbService, NGXLogger],
        },
    ],
})
export class UserModule {
}
