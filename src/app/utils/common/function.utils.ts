import ObjectUtils from './object.utils';

/**
 * Function utilities
 */
export default class FunctionUtils {

    /**
     * Get a boolean value indicating the specified object whether is a function
     * @param obj to check
     * @return true for being a function; else false
     */
    public static isFunction(obj: any): boolean {
        return ObjectUtils.isNotNou(obj) && typeof obj === 'function';
    }
}
