import {NGXLogger, NGXLoggerHttpService, NgxLoggerLevel, NGXMapperService} from 'ngx-logger';
import {EmptyService} from '../services/empty.service';
import {NbxOAuth2AuthDbService, NbxOAuth2AuthHttpService} from '../auth/auth.oauth2.service';
import {AuthGuard} from '../auth/auth.guard.service';
import {Injector, StaticProvider} from '@angular/core';
import {dbConfig} from './db.config';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NbxOAuth2AuthStrategy} from '../auth/auth.oauth2.strategy';
import {HttpBackend, HttpClient, HttpXhrBackend} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {MockUserService} from '../@core/mock/users.service';
import {LogConfig} from './log.config';
import {DatePipe} from "@angular/common";

export const COMMON = {
  theme: 'dark',
  logConfig: LogConfig,
};

export const API = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Company': 'hsg',
  },
  user: {
    baseUrl: 'http://localhost:8082/api-rest-user/service',
    login: '/oauth/token?grant_type=client_credentials',
    method: 'POST',
  },
};

export const PROVIDERS: StaticProvider[] = [
  { provide: DatePipe, useClass: DatePipe, deps: [ 'vi_VN' ] },
  { provide: HttpBackend, useClass: HttpXhrBackend, deps: [] },
  { provide: NGXMapperService, useClass: NGXMapperService,
    deps: [ HttpBackend ] },
  { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpService,
    deps: [ HttpBackend ] },
  { provide: NGXLogger, useClass: NGXLogger,
    deps: [ NGXMapperService, NGXLoggerHttpService, COMMON.logConfig, 'XXX', DatePipe ] },
  { provide: HttpClient, useClass: HttpClient, deps: [] },
  { provide: AuthGuard, useClass: AuthGuard, deps: [] },
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

export const AppConfig = {
  Injector: Injector,
  COMMON: COMMON,
  API: API,
  Db: dbConfig,
  Providers: PROVIDERS,
  getService: (token: any) => {
    return AppConfig.Injector['get'].apply(this, token);
  }
};
