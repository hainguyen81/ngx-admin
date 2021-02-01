import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {ComponentsModule} from './components/components.module';
import {NbButtonModule, NbMenuModule, NbThemeModule} from '@nebular/theme';
// @ts-ignore
import {NgPipesModule} from 'ngx-pipes';
import {LightboxModule} from 'ngx-lightbox';
import {ToastContainerModule, ToastrModule} from 'ngx-toastr';
import {AlertPopupModule, ConfirmPopupModule, PromptPopupModule} from 'ngx-material-popup';
import {ModalDialogModule} from 'ngx-modal-dialog';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {SystemModule} from './components/app/system/system.module';
import {WarehouseModule} from './components/app/warehouse/warehouse.module';
import {AppComponentsModule} from '@app/pages/components/app/components/app.components.module';

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        NbThemeModule,
        NbButtonModule,
        NbMenuModule,

        /* Popup, Dialogs */
        AlertPopupModule,
        ConfirmPopupModule,
        PromptPopupModule,
        ModalDialogModule.forRoot(),

        /* Pipes */
        NgPipesModule,

        /* Lightbox */
        LightboxModule,

        /* Toaster */
        ToastrModule,
        ToastContainerModule,

        /* Selection Dropdown */
        SelectDropDownModule,

        /* Base components module */
        ComponentsModule,
        /* Application components module */
        AppComponentsModule,
        /* System module */
        SystemModule,
        /* Warehouse module */
        WarehouseModule,
    ],
    declarations: [
        PagesComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class PagesModule {
}
