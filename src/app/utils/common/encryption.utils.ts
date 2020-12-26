import {Md5} from 'ts-md5';

/**
 * Encryption utilities
 */
export default class EncryptionUtils {
    /**
     * Encode the specified values array with the separator to base64 encoded value
     * @param sep value separator
     * @param values to encode
     * @return base64 encoded value
     */
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

    /**
     * Decode the specified base64 encoded value
     * @param base64Value to decode
     * @return base64 decoded value
     */
    public static base64Decode(base64Value: string): string {
        return (!(base64Value || '').length ? '' : atob(base64Value));
    }

    /**
     * Encode MD5 the specified values array with the separator
     * @param sep value separator
     * @param values to encode
     * @return MD5 encoded value
     */
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
