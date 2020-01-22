import {NgModule} from '@angular/core';
import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {UserModule} from './components/user/user.module';
import {ComponentsModule} from './components/components.module';
import {NbMenuModule} from '@nebular/theme';

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        NbMenuModule,
        ComponentsModule,

        UserModule,
    ],
    declarations: [
        PagesComponent,
    ],
})
export class PagesModule {
}
