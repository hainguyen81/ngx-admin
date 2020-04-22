import {Injectable} from '@angular/core';
import {CryptoService} from '../../../config/crypto.config';
import {isNullOrUndefined} from 'util';
import {StorageSerializer} from 'ngx-localstorage';

/**
 * Local storage serializer/deserializer service
 */
@Injectable()
export class LocalStorageSerializerService implements StorageSerializer {

    private _crypto(): any {
        return CryptoService ((CryptoService || {})['enc'] || {})['Utf8'];
    }

    serialize(value: any): string {
        const _cryptoInst: any = this._crypto();
        return (isNullOrUndefined(_cryptoInst)
            || typeof _cryptoInst['stringify'] !== 'function' ? null
            : _cryptoInst['stringify']['apply'](this, [value]));
    }

    deserialize(storedValue: string): any {
        const _cryptoInst: any = this._crypto();
        return (isNullOrUndefined(_cryptoInst)
        || typeof _cryptoInst['parse'] !== 'function' ? null
            : _cryptoInst['parse']['apply'](this, [storedValue]));
    }
}
