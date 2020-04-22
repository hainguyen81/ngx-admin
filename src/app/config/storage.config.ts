import {
    ISecureEncryptionConfig,
    LocalStorageConfiguration,
    SecuredLocalStorageEncryptionConfig,
} from '../services/storage.services/local.storage.services';
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
export const StorageConfiguration: NgxLocalstorageConfiguration =
    new LocalStorageConfiguration(StorageConfig.prefix, StorageConfig.allowNull);

export const SecureStorageConfig: {
    isCompression?: boolean | false;
    encodingType?: string | null;
    encryptionSecret?: string | null;
    encryptionNamespace?: string | null;
} =  {
    isCompression: true,
    encodingType: 'base64',
    encryptionNamespace: 'hi-system',
};
export const SecureStorageConfiguration: ISecureEncryptionConfig =
    new SecuredLocalStorageEncryptionConfig(
        SecureStorageConfig.isCompression,
        SecureStorageConfig.encodingType,
        SecureStorageConfig.encryptionSecret,
        SecureStorageConfig.encryptionNamespace);
