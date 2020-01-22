import {NgModule} from '@angular/core';
import {NbMenuModule} from '@nebular/theme';
import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {UserModule} from './components/user/user.module';

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        NbMenuModule,

        UserModule,
    ],
    declarations: [
        PagesComponent,
    ],
})
export class PagesModule {
}
