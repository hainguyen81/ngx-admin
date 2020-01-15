/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

/* API Configuration */
import {API, COMMON} from './app.config';

/* Authentication */
import { NbAuthModule } from '@nebular/auth';
import { AuthGuard } from './auth/auth.guard.service';
import { NbxOAuth2AuthStrategy } from './auth/auth.oauth2.strategy';
import {NbxAuthOAuth2Token} from './auth/auth.oauth2.token';

import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule, NbThemeModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';

/* Logger */
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';

/* Database */
import {NgxIndexedDBModule} from 'ngx-indexed-db';
import {dbConfig} from './db.config';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    /* Theme */
    ThemeModule.forRoot(),
    NbThemeModule.forRoot({ name: COMMON.theme }),

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),

    /* Logger */
    LoggerModule.forRoot({
      level: COMMON.log.level,
      serverLogLevel: COMMON.log.serverLogLevel,
    }),

    /* Database */
    NgxIndexedDBModule.forRoot(dbConfig),

    /* Authentication */
    NbAuthModule.forRoot({
      strategies: [
        NbxOAuth2AuthStrategy.setup({
          name: 'email',
          baseEndpoint: API.user.baseUrl,

          token: {
            class: NbxAuthOAuth2Token,
            key: 'access_token', // this parameter tells where to look for the token
          },

          login: {
            endpoint: API.user.login,
            method: API.user.method,
            headers: API.headers,
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
  providers: [
    AuthGuard,
    NbxOAuth2AuthStrategy,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
