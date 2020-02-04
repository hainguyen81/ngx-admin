import {Injector} from '@angular/core';
import {dbConfig} from './db.config';
import {Providers} from './app.providers';
import {TOASTER} from './toaststr.config';
import {API} from './api.config';
import {COMMON} from './common.config';
import {environment} from '../../environments/environment';
import {i18n} from './i18n.config';
import {IdGenerators} from './generator.config';

export const AppConfig = {
    Injector: Injector,
    COMMON: COMMON,
    TOASTER: TOASTER,
    API: API,
    Db: dbConfig,
    Providers: Providers,
    Env: environment,
    i18n: i18n,
    IdGenerators: IdGenerators,
    getService: (token: any) => {
        return AppConfig.Injector['get'].apply(this, token);
    },
};
