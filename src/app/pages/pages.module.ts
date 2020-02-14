import {NgModule} from '@angular/core';
import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {ComponentsModule} from './components/components.module';
import {NbButtonModule, NbMenuModule, NbThemeModule} from '@nebular/theme';
/* system modules */
import {UserModule} from './components/app/system/user/user.module';
import {CustomerModule} from './components/app/system/customer/customer.module';
import {OrganizationModule} from './components/app/system/organization/organization.module';
import {AppMaterialModule} from '../app.material.module';
import {NgPipesModule} from 'ngx-pipes';
import {LightboxModule} from 'ngx-lightbox';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {ToastContainerModule, ToastrModule} from 'ngx-toastr';

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        NbThemeModule,
        NbButtonModule,
        NbMenuModule,
        ComponentsModule,

        /* Angular material modules */
        AppMaterialModule,

        /* Device Detector */
        DeviceDetectorModule,

        /* Pipes */
        NgPipesModule,

        /* Lightbox */
        LightboxModule,

        /* Toaster */
        ToastrModule,
        ToastContainerModule,

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
