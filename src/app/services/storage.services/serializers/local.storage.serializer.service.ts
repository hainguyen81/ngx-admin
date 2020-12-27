import {Inject, Injectable} from '@angular/core';
import {CryptoEncUtf8Service} from '../../../config/crypto.config';
import {isNullOrUndefined} from 'util';
import {StorageSerializer} from 'ngx-localstorage';
import {NGXLogger} from 'ngx-logger';
import {throwError} from 'rxjs';
import EncryptionUtils from '../../../utils/common/encryption.utils';

/**
 * Local storage serializer/deserializer service
 */
@Injectable({ providedIn: 'root' })
export class DefaultLocalStorageSerializerService implements StorageSerializer {

    protected get logger(): NGXLogger {
        return this._logger;
    }

    constructor(@Inject(NGXLogger) private _logger: NGXLogger) {
        this._logger || throwError('Could not inject NGXLogger instance');
    }

    serialize(value: any): string {
        return EncryptionUtils.base64Encode(':', value);
    }

    deserialize(storedValue: string): any {
        return EncryptionUtils.base64Decode(storedValue);
    }
}

/**
 * Local storage serializer/deserializer service
 */
@Injectable()
export class LocalStorageSerializerService extends DefaultLocalStorageSerializerService {

    private _crypto(): any {
        return CryptoEncUtf8Service;
    }

    constructor(@Inject(NGXLogger) _logger: NGXLogger) {
        super(_logger);
    }

    serialize(value: any): string {
        try {
            const _cryptoInst: any = this._crypto();
            return (isNullOrUndefined(_cryptoInst)
            || typeof _cryptoInst['stringify'] !== 'function' ? null
                : _cryptoInst['stringify']['apply'](this, [value]));
        } catch (e) {
            this.logger.warn('Could not serialize data to local storage!', e);
            return super.serialize(value);
        }
    }

    deserialize(storedValue: string): any {
        try {
            const _cryptoInst: any = this._crypto();
            return (isNullOrUndefined(_cryptoInst)
            || typeof _cryptoInst['parse'] !== 'function' ? null
                : _cryptoInst['parse']['apply'](this, [storedValue]));
        } catch (e) {
            this.logger.warn('Could not deserialize data from local storage!', e);
            return super.deserialize(storedValue);
        }
    }
}
