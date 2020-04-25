import {NgModule} from '@angular/core';
import {NbCardModule, NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule, NbSelectModule} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {UserDataSource} from '../../../../../services/implementation/system/user/user.datasource';
import {UserDbService, UserHttpService} from '../../../../../services/implementation/system/user/user.service';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {TranslateModule} from '@ngx-translate/core';
import {UserSmartTableComponent} from './user.table.component';
import {UserFormlyComponent} from './user.formly.component';
import {UserToolbarComponent} from './user.toolbar.component';

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
        UserSmartTableComponent,
        UserFormlyComponent,
        UserToolbarComponent,
    ],
    entryComponents: [
        UserSmartTableComponent,
        UserFormlyComponent,
        UserToolbarComponent,
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
