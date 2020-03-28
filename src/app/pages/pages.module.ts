import {NgModule} from '@angular/core';
import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {ComponentsModule} from './components/components.module';
import {NbButtonModule, NbMenuModule, NbThemeModule} from '@nebular/theme';
import {AppMaterialModule} from '../app.material.module';
// @ts-ignore
import {NgPipesModule} from 'ngx-pipes';
import {LightboxModule} from 'ngx-lightbox';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {ToastContainerModule, ToastrModule} from 'ngx-toastr';
import {AlertPopupModule, ConfirmPopupModule, PromptPopupModule} from 'ngx-material-popup';
import {ModalDialogModule} from 'ngx-modal-dialog';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {SystemModule} from './components/app/system/system.module';
import {WarehouseModule} from './components/app/warehouse/warehouse.module';

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

        /* Popup, Dialogs */
        AlertPopupModule,
        ConfirmPopupModule,
        PromptPopupModule,
        ModalDialogModule.forRoot(),

        /* Device Detector */
        DeviceDetectorModule,

        /* Pipes */
        NgPipesModule,

        /* Lightbox */
        LightboxModule,

        /* Toaster */
        ToastrModule,
        ToastContainerModule,

        /* Selection Dropdown */
        SelectDropDownModule,

        /* System module */
        SystemModule,

        /* Warehouse module */
        WarehouseModule,
    ],
    declarations: [
        PagesComponent,
    ],
})
export class PagesModule {
}
