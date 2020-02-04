import {NgModule} from '@angular/core';
import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {UserModule} from './components/user/user.module';
import {ComponentsModule} from './components/components.module';
import {NbMenuModule} from '@nebular/theme';
import {CustomerModule} from './components/customer/customer.module';

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        NbMenuModule,
        ComponentsModule,

        /* System module */
        UserModule,
        CustomerModule,
    ],
    declarations: [
        PagesComponent,
    ],
})
export class PagesModule {
}
