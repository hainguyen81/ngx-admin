/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {CoreModule, throwIfAlreadyLoaded} from './@core/core.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule, NO_ERRORS_SCHEMA, Optional, SkipSelf} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ThemeModule} from './@theme/theme.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
/* Prototypes */
import './config/prototypes.import';
/* Nebular Theme */
import {
    NbBadgeModule,
    NbButtonModule,
    NbChatModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbDatepickerModule,
    NbDialogModule,
    NbIconLibraries,
    NbIconModule,
    NbInputModule,
    NbMenuModule,
    NbOverlayModule,
    NbSelectModule,
    NbSidebarModule,
    NbToastrModule,
    NbWindowModule,
} from '@nebular/theme';
/* API Configuration */
import {AppConfig} from './config/app.config';
/* Authentication */
import {NbAuthModule} from '@nebular/auth';
import {NbxOAuth2AuthStrategy} from './auth/auth.oauth2.strategy';
/* Logger */
import {LoggerModule} from 'ngx-logger';
/* Database */
import {NgxIndexedDBModule} from 'ngx-indexed-db';
/* i18n */
import {TranslateModule} from '@ngx-translate/core';
/* Toaster */
import {ToastContainerModule, ToastrModule} from 'ngx-toastr';
/* SplitPane */
import {AngularSplitModule} from 'angular-split';
/* Formly for form builder */
import {ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
/* Treeview */
import {TreeviewModule} from 'ngx-treeview';
/* Angular material modules */
import {AppLibraryModule} from './app-library.module';
/* Pipes */
// @ts-ignore
import {NgPipesModule} from 'ngx-pipes';
/* Lightbox */
import {LightboxModule} from 'ngx-lightbox';
/* Popup, Dialogs */
import {AlertPopupModule, ConfirmPopupModule, PromptPopupModule} from 'ngx-material-popup';
import {ModalDialogModule} from 'ngx-modal-dialog';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
/* Select-ex */
import {NgxSelectModule} from 'ngx-select-ex';
/* @ng-select/ng-select */
import {NgSelectModule} from '@ng-select/ng-select';
/* Local storage */
import {NgxLocalStorageModule} from 'ngx-localstorage';
/* Datepicker */
import {DpDatePickerModule} from 'ng2-date-picker';
/* Barcode */
import {NgxBarcodeModule} from 'ngx-barcode';
import {BarecodeScannerLivestreamModule} from 'ngx-barcode-scanner';
/* Mock data while application initialization */
import {MockDataModule} from './@core/mock/mock.data.module';
/* service worker */
import {registerBrowserServiceWorkers} from './sw/core/service.workers.registration';
import {ServiceWorkerProviders} from './config/worker.providers';
import {InjectionConfig} from './config/injection.config';
import {DynamicModule} from 'ng-dynamic-component';
import {FlipModule} from 'ngx-flip';
import {FormlyConfig} from 'app/config/formly.config';
import {ContextMenuModule} from 'ngx-contextmenu';
import {OverlayModule} from '@angular/cdk/overlay';
import {TabsModule} from '~/ngx-tabset';
import {ComponentsModule} from '@app/pages/components/components.module';
import {AppComponentsModule} from '@app/pages/components/app/components/app.components.module';
import {SystemModule} from '@app/pages/components/app/system/system.module';
import {WarehouseModule} from '@app/pages/components/app/warehouse/warehouse.module';

@NgModule({
    imports: [
        ServiceWorkerProviders,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,

        /* Dynamic component */
        DynamicModule,

        /* Flip */
        FlipModule,

        /* local storage */
        NgxLocalStorageModule.forRoot(),

        /* Angular material modules */
        AppLibraryModule,

        /* ngxTabset */
        TabsModule.forRoot(),

        /* Popup, Dialogs */
        AlertPopupModule,
        ConfirmPopupModule,
        PromptPopupModule,
        ModalDialogModule.forRoot(),

        /* Core Module for layout */
        CoreModule.forRoot(),

        /* Pipes */
        NgPipesModule,

        /* Lightbox */
        LightboxModule,

        /* Context Menu */
        NbOverlayModule,
        NbContextMenuModule,
        OverlayModule,
        ContextMenuModule.forRoot({
            autoFocus: true,
            useBootstrap4: true,
        }),

        /* Theme */
        ThemeModule.forRoot(),
        NbBadgeModule,
        NbIconModule,
        NbInputModule,
        NbCheckboxModule,
        NbButtonModule,
        NbSelectModule,
        NbSidebarModule.forRoot(),
        NbMenuModule.forRoot(),
        NbDatepickerModule.forRoot(),
        NbDialogModule.forRoot(),
        NbWindowModule.forRoot(),
        NbToastrModule.forRoot(),
        NbChatModule.forRoot({
            messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
        }),

        /* i18n */
        TranslateModule.forRoot(),

        /* Toaster */
        ToastrModule.forRoot(AppConfig.TOASTER),
        ToastContainerModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),

        /* Database */
        NgxIndexedDBModule.forRoot(AppConfig.Db),

        /* Authentication */
        NbAuthModule.forRoot({
            strategies: [ NbxOAuth2AuthStrategy.setup() ],
            forms: {
                login: {
                    // delay before redirect after a successful login, while success message is shown to the user
                    redirectDelay: 500,
                    strategy: 'email',  // strategy id key.
                    rememberMe: false,   // whether to show or not the `rememberMe` checkbox
                    showMessages: {     // show/not show success/error messages
                        success: false,
                        error: true,
                    },
                    socialLinks: [], // social links at the bottom of a page
                },
            },
        }),

        /* SplitPane */
        AngularSplitModule.forRoot(),

        /* Tree-view */
        TreeviewModule.forRoot(),

        /* Select-ex */
        NgxSelectModule,

        /* @ng-select/ng-select */
        NgSelectModule,

        /* Formly for form builder */
        ReactiveFormsModule,
        FormlyModule.forRoot(FormlyConfig),
        FormlyModule.forChild(FormlyConfig),
        /**
         * - Bootstrap:    FormlyBootstrapModule
         * - Material2:    FormlyMaterialModule
         * - Ionic:        FormlyIonicModule
         * - PrimeNG:      FormlyPrimeNGModule
         * - Kendo:        FormlyKendoModule
         * - NativeScript: FormlyNativescriptModule
         */
        /*FormlyBootstrapModule,*/
        FormlyMaterialModule,
        FormlyMatDatepickerModule,

        /* Date-picker */
        DpDatePickerModule,

        /* Barcode */
        NgxBarcodeModule.forRoot(),
        BarecodeScannerLivestreamModule,

        /* Base components module */
        ComponentsModule,
        /* Application components module */
        AppComponentsModule,
        /* System module */
        SystemModule,
        /* Warehouse module */
        WarehouseModule,

        /* Mock data module */
        MockDataModule.forRoot(),
    ],
    declarations: [AppComponent],
    providers: AppConfig.Providers.All,
    bootstrap: [AppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class AppModule {

    private readonly moduleInjector: Injector;

    constructor(@Optional() @SkipSelf() parentModule: AppModule,
                injector: Injector,
                iconLibraries: NbIconLibraries) {
        // @ts-ignore
        throwIfAlreadyLoaded(parentModule, 'AppModule');
        this.moduleInjector = Injector.create({ providers: AppConfig.Providers.All, parent: injector, name: 'AppModuleInjector' });
        InjectionConfig.Injector = this.moduleInjector;
        AppConfig.Injection = InjectionConfig;
        iconLibraries.registerFontPack('fa', {packClass: 'fa', iconClassPrefix: 'fa'});
        iconLibraries.registerFontPack('fas', {packClass: 'fas', iconClassPrefix: 'fa'});
        iconLibraries.registerFontPack('far', {packClass: 'far', iconClassPrefix: 'fa'});
        iconLibraries.registerFontPack('ion', {iconClassPrefix: 'ion'});

        // register application service workers
        registerBrowserServiceWorkers();
    }
}
