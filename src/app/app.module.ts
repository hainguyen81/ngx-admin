/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {CoreModule} from './@core/core.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ThemeModule} from './@theme/theme.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
/* Prototypes */
import './config/prototypes.import';
/* Nebular Theme */
import {
    NbButtonModule,
    NbChatModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbDialogModule,
    NbIconLibraries,
    NbIconModule,
    NbInputModule,
    NbMenuModule,
    NbSelectModule,
    NbSidebarModule,
    NbThemeModule,
    NbToastrModule,
    NbWindowModule,
} from '@nebular/theme';
/* API Configuration */
import {AppConfig} from './config/app.config';
/* Authentication */
import {NbAuthModule} from '@nebular/auth';
import {NbxOAuth2AuthStrategy} from './auth/auth.oauth2.strategy';
import {AUTH_STRATEGY_OPTIONS} from './config/auth.config';
import {NbxAuthOAuth2Token} from './auth/auth.oauth2.token';
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
import {AppMaterialModule} from './app.material.module';
/* Device Detector */
import {DeviceDetectorModule} from 'ngx-device-detector';
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
import {ServiceWorkerProviders} from './config/worker.providers';
import {environment} from '../environments/environment';
import {registerBrowserServiceWorkers} from './sw/core/service.workers.registration';


@NgModule({
    declarations: [AppComponent],
    imports: [
        ServiceWorkerProviders,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,

        /* local storage */
        NgxLocalStorageModule.forRoot(),

        /* Angular material modules */
        AppMaterialModule,

        /* Popup, Dialogs */
        AlertPopupModule,
        ConfirmPopupModule,
        PromptPopupModule,
        ModalDialogModule.forRoot(),

        /* Core Module for layout */
        CoreModule.forRoot(),

        /* Device Detector */
        DeviceDetectorModule.forRoot(),

        /* Pipes */
        NgPipesModule,

        /* Lightbox */
        LightboxModule,

        /* Theme */
        ThemeModule.forRoot(),
        NbThemeModule.forRoot({name: AppConfig.COMMON.theme}),
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
            strategies: [ [NbxOAuth2AuthStrategy, AUTH_STRATEGY_OPTIONS] ],
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
        FormlyModule.forRoot(),
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

        /* Mock data module */
        MockDataModule,
    ],
    providers: AppConfig.Providers.All,
    bootstrap: [AppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class AppModule {
    constructor(injector: Injector,
                iconLibraries: NbIconLibraries) {
        // @ts-ignore
        AppConfig.Injector = Injector.create({providers: AppConfig.Providers.All, parent: injector});
        iconLibraries.registerFontPack('fa', {packClass: 'fa', iconClassPrefix: 'fa'});
        iconLibraries.registerFontPack('fas', {packClass: 'fas', iconClassPrefix: 'fa'});
        iconLibraries.registerFontPack('far', {packClass: 'far', iconClassPrefix: 'fa'});
        iconLibraries.registerFontPack('ion', {iconClassPrefix: 'ion'});

        // register application service workers
        registerBrowserServiceWorkers();
   }
}
