import {LocalStorageService, NgxLocalstorageConfiguration, StorageSerializer,} from 'ngx-localstorage';
import {Inject, Injectable, InjectionToken} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {throwError} from 'rxjs';
import * as SecureLS from 'secure-ls';
import JsonUtils from '../../utils/common/json.utils';
import ObjectUtils from '../../utils/common/object.utils';

/**
 * Secure configuration
 */
export interface ISecureEncryptionConfig {
    isCompression?: boolean | false;
    encodingType?: string | null;
    encryptionSecret?: string | null;
    encryptionNamespace?: string | null;
}

export class SecuredLocalStorageEncryptionConfig implements ISecureEncryptionConfig {
    constructor(public isCompression?: boolean | false,
                public encodingType?: string | null,
                public encryptionSecret?: string | null,
                public encryptionNamespace?: string | null) {
    }
}

export class DefaultStorageSerializer implements StorageSerializer {

    serialize(value: any): string {
        return JSON.stringify(value);
    }

    deserialize(storedValue: string): any {
        return JsonUtils.safeParseJson(storedValue);
    }
}

export class LocalStorageConfiguration implements NgxLocalstorageConfiguration {
    constructor(public prefix?: string | null, public allowNull?: boolean | false) {
    }
}

export const TOKEN_SECURE_ENCRYPTION_CONFIG: InjectionToken<ISecureEncryptionConfig>
    = new InjectionToken<ISecureEncryptionConfig>('Local storage secure encryption configuration');
export const TOKEN_STORAGE_CONFIG: InjectionToken<NgxLocalstorageConfiguration>
    = new InjectionToken<NgxLocalstorageConfiguration>('Local storage configuration');
export const TOKEN_STORAGE_SERIALIZER: InjectionToken<StorageSerializer>
    = new InjectionToken<StorageSerializer>('Local storage serializer/deserializer injection');

/**
 * Local storage service
 */
@Injectable()
export class NgxLocalStorageService extends LocalStorageService {

    protected get logger(): NGXLogger {
        return this._logger;
    }

    protected get serializer(): StorageSerializer {
        return this._serializer;
    }

    constructor(@Inject(NGXLogger) private _logger: NGXLogger,
                @Inject(TOKEN_STORAGE_SERIALIZER) private _serializer?: StorageSerializer | null,
                @Inject(TOKEN_STORAGE_CONFIG) _storageConfig?: NgxLocalstorageConfiguration | null) {
        super(_serializer || new DefaultStorageSerializer(),
            _storageConfig || new LocalStorageConfiguration());
        _logger || throwError('Could not inject NGXLogger instance');
        _serializer || _logger.warn('Not inject serializer configuration! The default serializer will be used!');
        _serializer = (_serializer || new DefaultStorageSerializer());
        _storageConfig || _logger.warn(
            'Not inject storage configuration! The default configuration will be used!');
    }
}

/**
 * Local storage secure service
 */
@Injectable()
export class NgxLocalStorageEncryptionService {

    readonly _internalSecuredStorage: SecureLS;

    protected get secureConfig(): ISecureEncryptionConfig {
        return this._secureConfig;
    }

    protected get logger(): NGXLogger {
        return this._logger;
    }

    protected get serializer(): StorageSerializer {
        return this._serializer;
    }

    protected get storageConfig(): NgxLocalstorageConfiguration {
        return this._storageConfig;
    }

    private get internalSecuredStorage(): SecureLS {
        return this._internalSecuredStorage;
    }

    constructor(@Inject(NGXLogger) private _logger: NGXLogger,
                @Inject(TOKEN_STORAGE_SERIALIZER) private _serializer?: StorageSerializer | null,
                @Inject(TOKEN_STORAGE_CONFIG) private _storageConfig?: NgxLocalstorageConfiguration | null,
                @Inject(TOKEN_SECURE_ENCRYPTION_CONFIG) private _secureConfig?: ISecureEncryptionConfig | null) {
        _logger || throwError('Could not inject NGXLogger instance');
        _secureConfig || _logger.warn(
            'Not inject secure storage configuration! The default configuration will be used!');
        _secureConfig = (_secureConfig || new SecuredLocalStorageEncryptionConfig());
        const _config: {
            isCompression?: boolean,
            encodingType?: string,
            encryptionSecret?: string ,
            encryptionNamespace?: string,
        } = {
            isCompression: _secureConfig.isCompression,
            encodingType: _secureConfig.encodingType,
            encryptionNamespace: _secureConfig.encryptionNamespace,
            encryptionSecret: _secureConfig.encryptionSecret,
        };
        // @ts-ignore
        this._internalSecuredStorage = new SecureLS(_config);
    }

    private _transformKey(key: string): string {
        return (this.storageConfig.prefix || '').concat(key || '');
    }
    private _revertKey(key: string): string {
        return (key || '').substring((this.storageConfig.prefix || '').length);
    }

    getKey(index: number): string | null | undefined {
        const keys: string[] = this.getAllKeys();
        return ((keys || []).length && 0 <= index && index < keys.length ? keys[index] : undefined);
    }

    count(): number | undefined {
        const keys: string[] = this.getAllKeys();
        return (keys || []).length;
    }

    get(key: string, isAllKeysData?: boolean): any {
        const data: any = this.internalSecuredStorage.get(this._transformKey(key), isAllKeysData);
        // this.logger.warn('Get data from local storage', key, this._transformKey(key), data,
        //     this.serializer.deserialize(data));
        return (ObjectUtils.isNou(data) ? data : this.serializer.deserialize(data));
    }

    getDataFromLocalStorage(key: string): string | null {
        const data = this.internalSecuredStorage.getDataFromLocalStorage(this._transformKey(key));
        return (ObjectUtils.isNou(data) ? data : this.serializer.deserialize(data));
    }

    set(key: string, data: any): void {
        // this.logger.warn('Set data to local storage', key, this._transformKey(key), data,
        //     this.serializer.serialize(data));
        ((ObjectUtils.isNou(data) && this.storageConfig.allowNull)
            || ObjectUtils.isNotNou(data))
        && this.internalSecuredStorage.set(this._transformKey(key),
            ObjectUtils.isNou(data) ? data : this.serializer.serialize(data));
    }

    setDataToLocalStorage(key: string, data: string): void {
        ((ObjectUtils.isNou(data) && this.storageConfig.allowNull)
            || ObjectUtils.isNotNou(data))
        && this.internalSecuredStorage.set(this._transformKey(key),
            ObjectUtils.isNou(data) ? data : this.serializer.serialize(data));
    }

    remove(key: string): void {
        this.internalSecuredStorage.remove(this._transformKey(key));
    }

    getEncryptionSecret(): string {
        return this.internalSecuredStorage.getEncryptionSecret();
    }

    getAllKeys(): string[] {
        const keys: string[] = this.internalSecuredStorage.getAllKeys();
        let realKeys: string[];
        realKeys = [];
        (keys || []).forEach(key => realKeys.push(this._revertKey(key)));
        return realKeys;
    }

    removeAll(): void {
        this.internalSecuredStorage.removeAll();
    }

    clear(): void {
        this.internalSecuredStorage.clear();
    }

    resetAllKeys(): [] {
        return  this.internalSecuredStorage.resetAllKeys();
    }

    processData(data: any | string, isAllKeysData: boolean): string {
        return this.internalSecuredStorage.processData(data, isAllKeysData);
    }

    setMetaData(): void {
        this.internalSecuredStorage.setMetaData();
    }

    getMetaData(): { keys: string[] } {
        return this.internalSecuredStorage.getMetaData();
    }
}
