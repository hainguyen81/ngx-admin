import {Injector} from '@angular/core';
import {dbConfig} from './db.config';
import {HttpLoaderFactory, Providers} from './app.providers';
import {TOASTER} from './toaststr.config';
import {API} from './api.config';
import {COMMON} from './common.config';
import {environment} from '../../environments/environment';
import {TranslateLoader} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';

export const AppConfig = {
    Injector: Injector,
    COMMON: COMMON,
    TOASTER: TOASTER,
    API: API,
    Db: dbConfig,
    Providers: Providers,
    Env: environment,
    i18n: {
        defaultLang: 'en',
        config: {
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        },
    },
    getService: (token: any) => {
        return AppConfig.Injector['get'].apply(this, token);
    },
};
