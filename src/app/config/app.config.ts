import {dbConfig} from './db.config';
import {Providers} from './app.providers';
import {TOASTER} from './toaststr.config';
import {API} from './api.config';
import {COMMON} from './common.config';
import {environment} from '../../environments/environment';
import {i18n} from './i18n.config';
import {IdGenerators} from './generator.config';
import {SecureStorageConfiguration, StorageConfiguration} from './storage.config';
import {CryptoService} from './crypto.config';

export const AppConfig = {
    PageConfig: {
        title: 'app',
    },
    Injector: undefined,
    viewRef: undefined,
    COMMON: COMMON,
    TOASTER: TOASTER,
    API: API,
    Db: dbConfig,
    Providers: Providers,
    Env: environment,
    i18n: i18n,
    IdGenerators: IdGenerators,
    CryptoService: CryptoService,
    Storage: {
        storageConfig: StorageConfiguration,
        secureConfig: SecureStorageConfiguration,
    },
};
