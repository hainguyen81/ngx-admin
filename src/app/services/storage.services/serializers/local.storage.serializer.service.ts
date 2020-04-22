import {DefaultSerializer} from 'ngx-localstorage/lib/classes/default-serializer';
import {CryptoService} from '../../../config/crypto.config';
import {Injectable} from '@angular/core';

/**
 * Local storage serializer/deserializer service
 */
@Injectable()
export class LocalStorageSerializerService extends DefaultSerializer {

    serialize(value: any): string {
        return CryptoService.enc.Utf8.stringify(value);
    }

    deserialize(storedValue: string): any {
        return CryptoService.enc.Utf8.parse(storedValue);
    }
}
