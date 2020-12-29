import ObjectUtils from './object.utils';

/**
 * Boolean utilities
 */
export default class BooleanUtils {

    /**
     * Get a boolean value indicating the specified object whether is a boolean value
     * @param obj to check
     * @return true for being a boolean value; else false
     */
    public static isBoolean(obj: any): boolean {
        return ObjectUtils.isNotNou(obj) && typeof obj === 'boolean';
    }
}
