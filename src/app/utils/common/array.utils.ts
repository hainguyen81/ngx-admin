import ObjectUtils from './object.utils';
import NumberUtils from '@app/utils/common/number.utils';

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
     * Get the length of the specified object whether is an array
     * @param obj to check
     * @return array length or 0 if be not an array
     */
    public static lengthOf(obj: any): number {
        return ArrayUtils.isArray(obj) ? Array.from(obj).length : 0;
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

    /**
     * Get a item at the specified index of the specified object whether is an array
     * @param obj to check
     * @param index to get
     * @return item or null/undefined
     */
    public static get<T>(obj: any, index?: number | null | undefined): T {
        return ObjectUtils.as<T>(ArrayUtils.isNotEmptyArray(obj) && NumberUtils.isNumber(index)
            && 0 < index && index < ArrayUtils.lengthOf(obj)
            ? Array.from(obj)[index] : undefined);
    }

    /**
     * Get a item at the first index of the specified object whether is an array
     * @param obj to check
     * @param index to get
     * @return item or null/undefined
     */
    public static first<T>(obj: any): T {
        return ArrayUtils.get<T>(obj, 0);
    }

    /**
     * Get a item at the last index of the specified object whether is an array
     * @param obj to check
     * @param index to get
     * @return item or null/undefined
     */
    public static last<T>(obj: any): T {
        return ArrayUtils.get<T>(obj, ArrayUtils.lengthOf(obj) - 1);
    }
}
