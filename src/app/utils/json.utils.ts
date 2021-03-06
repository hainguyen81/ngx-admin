import {isArray, isBoolean, isObject} from 'util';
import {NoParamConstructor} from './object.utils';

/**
 * JSON utilities
 */
export default class JsonUtils {
    /**
     * Parse HTTP response json data
     * @param data HTTP response data to parse
     */
    public static parseResponseJson(data?: any): any {
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
            }
        }
        let isValid: boolean;
        isValid = (isObject(data) && Object.keys(data).length > 0);
        isValid = isValid && (isObject(data['status']) && data['status']['code'] === 200);
        isValid = isValid && (isBoolean(data['status']['success']) && (data['status']['success'] || false));
        isValid = isValid && (isArray(data['elements']) && Array.from(data['elements']).length > 0);
        if (isValid) {
            data = Array.from(data['elements']);
        }
        return data;
    }

    /**
     * Parse the first JSON element from the HTTP response data
     * @param data HTTP response data to parse
     */
    public static parseFisrtResponseJson(data?: any): any {
        data = JsonUtils.parseResponseJson(data);
        if (isArray(data)) {
            data = Array.from(data).shift();
        }
        return data;
    }

    /**
     * Convert the specified source JSON to the specified type
     * @param source to convert
     * @param type the destination type
     * @return the converted value or undefined
     */
    public static jsonToInstance<T>(source: any, type: NoParamConstructor<T>): T {
        if (!source) {
            return undefined;
        }
        try {
            return Object.assign(new type(), JSON.parse(source));
        } catch (e) {
            return undefined;
        }
    }
}
