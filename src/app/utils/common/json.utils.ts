import ObjectUtils, {NoParamConstructor} from './object.utils';
import BooleanUtils from './boolean.utils';
import ArrayUtils from './array.utils';

/**
 * JSON utilities
 */
export default class JsonUtils {
    /**
     * Parse HTTP response json data
     * @param data HTTP response data to parse
     */
    public static parseResponseJson(data?: any): any {
        data = this.safeParseJson(data);
        if (data) {
            let isValid: boolean;
            isValid = (ObjectUtils.isObject(data) && Object.keys(data).length > 0);
            isValid = isValid && (ObjectUtils.isObject(data['status']) && data['status']['code'] === 200);
            isValid = isValid && (BooleanUtils.isBoolean(data['status']['success']) && (data['status']['success'] || false));
            isValid = isValid && (ArrayUtils.isArray(data['elements']) && Array.from(data['elements']).length > 0);
            if (isValid) {
                data = Array.from(data['elements']);
            }
        }
        return data;
    }

    /**
     * Parse the first JSON element from the HTTP response data
     * @param data HTTP response data to parse
     */
    public static parseFisrtResponseJson(data?: any): any {
        data = JsonUtils.parseResponseJson(data);
        if (ArrayUtils.isArray(data)) {
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
        let data: any;
        data = this.safeParseJson(source);
        return (data ? Object.assign(new type(), data) : undefined);
    }

    /**
     * Alias of {JSON#parse} in safety mode.
     * If invalid JSON source or could not parse; then an undefined value will be returned
     * @param source to convert
     * @return the converted value or undefined
     */
    public static safeParseJson(source: any): any {
        if (!source) {
            return undefined;
        }
        try {
            return JSON.parse(typeof source === 'string' ? source : JSON.stringify(source));
        } catch (e) {
            window.console.error(['Could not parse JSON', source, e]);
            return undefined;
        }
    }
}
