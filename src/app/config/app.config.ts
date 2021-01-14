import {dbConfig} from './db.config';
import {BaseProviders, BusinessProviders, Providers} from './app.providers';
import {TOASTER} from './toaststr.config';
import {API} from './api.config';
import {COMMON} from './common.config';
import {environment} from '../../environments/environment';
import {i18n} from './i18n.config';
import {IdGenerators} from './generator.config';
import {createDefaultSecureStorageConfig, createDefaultStorageConfig,} from './storage.config';
import {CryptoService} from './crypto.config';
import {ServiceWorkerScripts} from './worker.providers';

const MainConfig = {
    PageConfig: {
        title: 'app',
    },
    Injection: <any>null,
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
MainConfig.API = Object.assign({}, API);
MainConfig.Storage.storageConfig = Object.assign({}, createDefaultStorageConfig());
MainConfig.Storage.secureConfig = Object.assign({}, createDefaultSecureStorageConfig());
export const AppConfig = MainConfig;
