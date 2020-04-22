import {Inject, Injectable} from '@angular/core';
import {CryptoEncUtf8Service} from '../../../config/crypto.config';
import {isNullOrUndefined} from 'util';
import {StorageSerializer} from 'ngx-localstorage';
import {NGXLogger} from 'ngx-logger';
import {throwError} from 'rxjs';
import EncryptionUtils from '../../../utils/encryption.utils';

/**
 * Local storage serializer/deserializer service
 */
@Injectable()
export class LocalStorageSerializerService implements StorageSerializer {

    private _crypto(): any {
        return CryptoEncUtf8Service;
    }

    protected get logger(): NGXLogger {
        return this._logger;
    }

    constructor(@Inject(NGXLogger) private _logger: NGXLogger) {
        this._logger || throwError('Could not inject NGXLogger instance');
    }

    serialize(value: any): string {
        try {
            const _cryptoInst: any = this._crypto();
            return (isNullOrUndefined(_cryptoInst)
            || typeof _cryptoInst['stringify'] !== 'function' ? null
                : _cryptoInst['stringify']['apply'](this, [value]));
        } catch (e) {
            this.logger.warn('Could not encrypt data to local storage!', e);
            return EncryptionUtils.base64Encode(':', value);
        }
    }

    deserialize(storedValue: string): any {
        try {
            const _cryptoInst: any = this._crypto();
            return (isNullOrUndefined(_cryptoInst)
            || typeof _cryptoInst['parse'] !== 'function' ? null
                : _cryptoInst['parse']['apply'](this, [storedValue]));
        } catch (e) {
            this.logger.warn('Could not descrypt data from local storage!', e);
            return EncryptionUtils.base64Decode(storedValue);
        }
    }
}
