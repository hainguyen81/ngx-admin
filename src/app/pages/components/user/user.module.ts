import {NgModule} from '@angular/core';
import {UserSmartTableComponent} from './user.component';
import {NbCardModule, NbContextMenuModule} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ContextMenuModule, ContextMenuService} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {UserDataSource} from '../../../services/implementation/user/user.datasource';
import {UserDbService, UserHttpService} from '../../../services/implementation/user/user.service';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {AppConfig} from '../../../config/app.config';

@NgModule({
    imports: [
        CommonModule,
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
        UserSmartTableComponent,
    ],
    providers: [
        {
            provide: UserDataSource, useClass: UserDataSource,
            deps: [UserHttpService, UserDbService, NGXLogger],
        },
        {provide: ContextMenuService, useClass: ContextMenuService, deps: []},
    ],
})
export class UserModule {
}
