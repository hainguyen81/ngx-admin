/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {CoreModule} from './@core/core.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Injector, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ThemeModule} from './@theme/theme.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
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
import {NbxAuthOAuth2Token} from './auth/auth.oauth2.token';
/* Logger */
import {LoggerModule} from 'ngx-logger';
/* Database */
import {NgxIndexedDBModule} from 'ngx-indexed-db';
/* i18n */
import {TranslateModule} from '@ngx-translate/core';
/* Toaster */
import {ToasterModule} from 'angular2-toaster';
import {ToastrModule} from 'ngx-toastr';
/* Mock data */
import {MockDataModule} from './@core/mock/mock.data.module';
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
import {NgPipesModule} from 'ngx-pipes';
/* Lightbox */
import {LightboxModule} from 'ngx-lightbox';
/* Infinite Scroll */
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
/* Support for Infinite Scroll Module */
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,

        /* Angular material modules */
        AppMaterialModule,

        /* Core Module for layout */
        CoreModule.forRoot(),

        /* Mock Data Module */
        MockDataModule.forRoot(),

        /* Device Detector */
        DeviceDetectorModule.forRoot(),

        /* Pipes */
        NgPipesModule,

        /* Lightbox */
        LightboxModule,

        /* Infinite Scroll */
        InfiniteScrollModule,

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
        ToasterModule.forRoot(),
        ToastrModule.forRoot(AppConfig.TOASTER),

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),

        /* Database */
        NgxIndexedDBModule.forRoot(AppConfig.Db),

        /* Authentication */
        NbAuthModule.forRoot({
            strategies: [
                NbxOAuth2AuthStrategy.setup({
                    name: 'email',
                    baseEndpoint: AppConfig.API.user.baseUrl,

                    token: {
                        class: NbxAuthOAuth2Token,
                        key: 'access_token', // this parameter tells where to look for the token
                    },

                    login: {
                        endpoint: AppConfig.API.user.login,
                        method: AppConfig.API.user.method,
                        headers: AppConfig.API.headers,
                        redirect: {
                            success: '/dashboard',
                            failure: null, // stay on the same page
                        },
                    },

                    register: {
                        redirect: {
                            success: '/dashboard',
                            failure: null, // stay on the same page
                        },
                    },
                }),
            ],
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
    ],
    providers: AppConfig.Providers,
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(injector: Injector,
                iconLibraries: NbIconLibraries) {
        // @ts-ignore
        AppConfig.Injector = Injector.create({providers: AppConfig.Providers, parent: injector});
        iconLibraries.registerFontPack('fa', {packClass: 'fa', iconClassPrefix: 'fa'});
        iconLibraries.registerFontPack('far', {packClass: 'far', iconClassPrefix: 'fa'});
        iconLibraries.registerFontPack('ion', {iconClassPrefix: 'ion'});
        platformBrowserDynamic().bootstrapModule(AppModule);
   }
}
