import {dbConfig} from './db.config';
import {BaseProviders, BusinessProviders, Providers} from './app.providers';
import {TOASTER} from './toaststr.config';
import {API} from './api.config';
import {COMMON} from './common.config';
import {environment} from '../../environments/environment';
import {i18n} from './i18n.config';
import {IdGenerators} from './generator.config';
import {
    createDefaultSecureStorageConfig,
    createDefaultStorageConfig,
} from './storage.config';
import {CryptoService} from './crypto.config';
import {ServiceWorkerScripts} from './worker.providers';

export const AppConfig = {
    PageConfig: {
        title: 'app',
    },
    Injector: undefined,
    appRef: undefined,
    viewRef: undefined,
    COMMON: COMMON,
    TOASTER: TOASTER,
    API: {},
    Db: dbConfig,
    Providers: {
        Base: BaseProviders,
        Business: BusinessProviders,
        All: Providers,
    },
    Env: environment,
    i18n: i18n,
    IdGenerators: IdGenerators,
    CryptoService: CryptoService,
    Storage: {
        storageConfig: {},
        secureConfig: {},
    },
    ServiceWorkers: ServiceWorkerScripts,
};
AppConfig.API = Object.assign({}, API);
AppConfig.Storage.storageConfig = Object.assign({}, createDefaultStorageConfig());
AppConfig.Storage.secureConfig = Object.assign({}, createDefaultSecureStorageConfig());
