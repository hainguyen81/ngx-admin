import {Injector, LOCALE_ID, StaticProvider} from '@angular/core';
import {APP_BASE_HREF, DatePipe} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpBackend, HttpClient, HttpXhrBackend} from '@angular/common/http';
import {NGXLogger, NGXLoggerHttpService, NGXMapperService} from 'ngx-logger';
import {AuthGuard} from '../auth/auth.guard.service';
import {NB_AUTH_INTERCEPTOR_HEADER, NbAuthService} from '@nebular/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {MockUserService} from '../@core/mock/users.service';
import {EmptyService} from '../services/empty.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NbxOAuth2AuthDbService, NbxOAuth2AuthHttpService} from '../auth/auth.oauth2.service';
import {NbxOAuth2AuthStrategy} from '../auth/auth.oauth2.strategy';
import {environment} from '../../environments/environment';
import {
  NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM,
  NBX_AUTH_INTERCEPTOR_COMPANY_HEADER,
  NbxAuthInterceptor,
} from '../auth/auth.interceptor';

export const CommonProviders: StaticProvider[] = [
  { provide: LOCALE_ID, useValue: 'vi' },
  { provide: DatePipe, useClass: DatePipe, deps: [] },
  { provide: HttpBackend, useClass: HttpXhrBackend, deps: [] },
  { provide: NGXMapperService, useClass: NGXMapperService,
    deps: [ HttpBackend ] },
  { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpService,
    deps: [ HttpBackend ] },
  { provide: HttpClient, useClass: HttpClient, deps: [] },
];

export const InterceptorProviders = [
  { provide: APP_BASE_HREF, useValue: environment.baseHref },
  { provide: NB_AUTH_INTERCEPTOR_HEADER, useValue: 'Authorization' },
  { provide: NBX_AUTH_INTERCEPTOR_COMPANY_HEADER, useValue: 'Company' },
  { provide: NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM, useValue: 'access_token' },
  { provide: HTTP_INTERCEPTORS, useClass: NbxAuthInterceptor, multi: true,
    deps: [ Injector, NB_AUTH_INTERCEPTOR_HEADER,
      NBX_AUTH_INTERCEPTOR_COMPANY_HEADER,
      NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM ] },
];

export const AuthenticationProviders: StaticProvider[] = [
  { provide: AuthGuard, useClass: AuthGuard,
    deps: [ NbAuthService, Router ] },
  { provide: MockUserService, useClass: MockUserService, deps: [] },
  { provide: EmptyService, useClass: EmptyService,
    deps: [ NgxIndexedDBService, NGXLogger ] },
  { provide: NbxOAuth2AuthHttpService, useClass: NbxOAuth2AuthHttpService,
    deps: [ HttpClient, NGXLogger, MockUserService ] },
  { provide: NbxOAuth2AuthDbService, useClass: NbxOAuth2AuthDbService,
    deps: [ NgxIndexedDBService, NGXLogger ] },
  { provide: NbxOAuth2AuthStrategy, useClass: NbxOAuth2AuthStrategy,
    deps: [ HttpClient, ActivatedRoute, NbxOAuth2AuthHttpService, NbxOAuth2AuthDbService, NGXLogger ] },
];

export const Providers: StaticProvider[] = CommonProviders
    .concat(InterceptorProviders)
    .concat(AuthenticationProviders);
