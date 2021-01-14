import {ISecureEncryptionConfig, LocalStorageConfiguration, SecuredLocalStorageEncryptionConfig,} from '../services/storage.services/local.storage.services';
import {NgxLocalstorageConfiguration} from 'ngx-localstorage';

export const StorageConfig: {
    /**
     * Determines the key prefix. (Default: null)
     */
    prefix?: string;
    /**
     * Determines if null | 'null' values should be stored. (Default: true)
     */
    allowNull?: boolean;
} =  {
    prefix: 'hi_system_',
    allowNull: false,
};
export function createDefaultStorageConfig(): NgxLocalstorageConfiguration {
    return new LocalStorageConfiguration(StorageConfig.prefix, StorageConfig.allowNull);
}

export const SecureStorageConfig: {
    isCompression?: boolean | false;
    encodingType?: string | null;
    encryptionSecret?: string | null;
    encryptionNamespace?: string | null;
} =  {
    isCompression: true,
    encodingType: 'rc4',
    encryptionNamespace: 'hi-system',
    encryptionSecret: 's3cr3tPa$$w0rd@h1System',
};
export function createDefaultSecureStorageConfig(): ISecureEncryptionConfig {
    return new SecuredLocalStorageEncryptionConfig(
        SecureStorageConfig.isCompression,
        SecureStorageConfig.encodingType,
        SecureStorageConfig.encryptionSecret,
        SecureStorageConfig.encryptionNamespace);
}
