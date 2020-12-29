import ObjectUtils from './object.utils';

/**
 * Number utilities
 */
export default class NumberUtils {

    /**
     * Get a boolean value indicating the specified object whether is a number
     * @param obj to check
     * @return true for being a number; else false
     */
    public static isNumber(obj: any): boolean {
        return ObjectUtils.isNotNou(obj) && (typeof obj === 'number' || !isNaN(<number>obj));
    }
}
