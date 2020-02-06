import {NgModule} from '@angular/core';
import {NbCardModule, NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule, NbSelectModule} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {TranslateModule} from '@ngx-translate/core';
import {OrganizationTreeviewComponent} from './organization.treeview.component';
import {OrganizationDataSource} from '../../../../../services/implementation/organization/organization.datasource';
import {
    OrganizationDbService,
    OrganizationHttpService,
} from '../../../../../services/implementation/organization/organization.service';

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
        OrganizationTreeviewComponent,
    ],
    providers: [
        {
            provide: OrganizationDataSource, useClass: OrganizationDataSource,
            deps: [OrganizationHttpService, OrganizationDbService, NGXLogger],
        },
    ],
})
export class OrganizationModule {
}
