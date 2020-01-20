import {Injector, StaticProvider} from '@angular/core';
import {dbConfig} from './db.config';
import {LogConfig} from './log.config';
import {Providers} from './app.providers';

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

export const AppConfig = {
  Injector: Injector,
  COMMON: COMMON,
  API: API,
  Db: dbConfig,
  Providers: Providers,
  getService: (token: any) => {
    return AppConfig.Injector['get'].apply(this, token);
  },
};