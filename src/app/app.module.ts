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
import { API } from './app.config';

/* Authentication */
import {NbPasswordAuthStrategy, NbAuthModule, NbAuthOAuth2Token} from '@nebular/auth';
import { NgxLoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth-guard.service';

import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';

@NgModule({
  declarations: [AppComponent, NgxLoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    ThemeModule.forRoot(),

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

    /* Authentication */
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',

          baseEndpoint: API.user.baseUrl,

          token: {
            class: NbAuthOAuth2Token,
            key: 'elements.access_token', // this parameter tells where to look for the token
          },

          login: {
            endpoint: API.user.login,
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
      forms: {},
    }),
  ],
  providers: [
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
