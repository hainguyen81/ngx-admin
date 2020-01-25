import {Md5} from 'ts-md5';

export default class EncryptionUtils {
    public static base64Encode(sep: string, ...values: string[]): string {
        let separator: string;
        separator = ((sep || '').length ? sep : ':');
        let encrypted: string;
        encrypted = '';
        if (values && values.length) {
            encrypted = btoa(values.join(separator));
        }
        return encrypted;
    }

    public static md5Encode(sep: string, ...values: string[]): string {
        let separator: string;
        separator = ((sep || '').length ? sep : ':');
        let encryptedValues: string[];
        encryptedValues = [];
        if (values && values.length) {
            let md5: Md5;
            md5 = new Md5();
            values.forEach((value) => {
                if ((value || '').length) {
                    encryptedValues.push(md5.appendStr(value).end().toString());
                }
            });
        }
        return encryptedValues.join(separator);
    }
}
