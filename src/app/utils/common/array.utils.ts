import ObjectUtils from './object.utils';

/**
 * Array utilities
 */
export default class ArrayUtils {

    /**
     * Get a boolean value indicating the specified object whether is an array
     * @param obj to check
     * @return true for being an array; else false
     */
    public static isArray(obj: any): boolean {
        return ObjectUtils.isNotNou(obj) && Array.isArray(obj);
    }

    /**
     * Get a boolean value indicating the specified object whether is an array and empty
     * @param obj to check
     * @return true for being an empty array; else false
     */
    public static isEmptyArray(obj: any): boolean {
        return ArrayUtils.isArray(obj) && Array.from(obj).length <= 0;
    }

    /**
     * Get a boolean value indicating the specified object whether is an array and non-empty
     * @param obj to check
     * @return true for being an non-empty array; else false
     */
    public static isNotEmptyArray(obj: any): boolean {
        return ArrayUtils.isArray(obj) && Array.from(obj).length > 0;
    }
}
