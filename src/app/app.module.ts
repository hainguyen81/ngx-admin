/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {CoreModule} from './@core/core.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Inject, Injector, NgModule, OnInit} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ThemeModule} from './@theme/theme.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {throwError} from 'rxjs';
/* API Configuration */
import {AppConfig} from './config/app.config';
/* Authentication */
import {NbAuthModule} from '@nebular/auth';
import {NbxOAuth2AuthStrategy} from './auth/auth.oauth2.strategy';
import {NbxAuthOAuth2Token} from './auth/auth.oauth2.token';

import {
    NbChatModule, NbCheckboxModule,
    NbDatepickerModule,
    NbDialogModule, NbIconLibraries, NbIconModule, NbInputModule,
    NbMenuModule, NbSelectModule,
    NbSidebarModule,
    NbThemeModule,
    NbToastrModule,
    NbWindowModule,
} from '@nebular/theme';
/* Logger */
import {LoggerModule} from 'ngx-logger';
/* Database */
import {NgxIndexedDBModule} from 'ngx-indexed-db';
/* Toaster */
import {ToastrModule} from 'ngx-toastr';
/* Mock data services */
import {MockUserService} from './@core/mock/users.service';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,

        /* Core Module for layout */
        CoreModule.forRoot(),

        /* Theme */
        ThemeModule.forRoot(),
        NbThemeModule.forRoot({name: AppConfig.COMMON.theme}),
        NbIconModule,
        NbInputModule,
        NbCheckboxModule,
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

        /* Toaster */
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
    ],
    providers: AppConfig.Providers,
    bootstrap: [AppComponent],
})
export class AppModule implements OnInit {
    constructor(injector: Injector,
                iconLibraries: NbIconLibraries,
                @Inject(MockUserService) private mockUserService: MockUserService) {
        AppConfig.Env.production || mockUserService
        || throwError('Could not inject mock user service to initialize mock data');

        // @ts-ignore
        AppConfig.Injector = Injector.create({providers: AppConfig.Providers, parent: injector});
        iconLibraries.registerFontPack('fa', {packClass: 'fa', iconClassPrefix: 'fa'});
        iconLibraries.registerFontPack('far', {packClass: 'far', iconClassPrefix: 'fa'});
        iconLibraries.registerFontPack('ion', {iconClassPrefix: 'ion'});
    }

    ngOnInit(): void {
        if (AppConfig.Env.production) {
            return;
        }

        // initialize mock data for development mode
        this.mockUserService.initialize();
    }
}
