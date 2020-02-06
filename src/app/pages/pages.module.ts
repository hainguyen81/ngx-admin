import {NgModule} from '@angular/core';
import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {ComponentsModule} from './components/components.module';
import {NbMenuModule} from '@nebular/theme';
/* system modules */
import {UserModule} from './components/app/system/user/user.module';
import {CustomerModule} from './components/app/system/customer/customer.module';
import {OrganizationModule} from './components/app/system/organization/organization.module';

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        NbMenuModule,
        ComponentsModule,

        /* System module */
        OrganizationModule,
        UserModule,
        CustomerModule,
    ],
    declarations: [
        PagesComponent,
    ],
})
export class PagesModule {
}
