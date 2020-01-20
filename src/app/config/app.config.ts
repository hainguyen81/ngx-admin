import {Injector} from '@angular/core';
import {dbConfig} from './db.config';
import {Providers} from './app.providers';
import {TOASTER} from './toaststr.config';
import {API} from './api.config';
import {COMMON} from './common.config';

export const AppConfig = {
  Injector: Injector,
  COMMON: COMMON,
  TOASTER: TOASTER,
  API: API,
  Db: dbConfig,
  Providers: Providers,
  getService: (token: any) => {
    return AppConfig.Injector['get'].apply(this, token);
  },
};
