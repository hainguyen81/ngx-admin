/**
 * Assertion utilities
 */
import ObjectUtils from '@app/utils/common/object.utils';
import {throwError} from '~/rxjs';
import ArrayUtils from '@app/utils/common/array.utils';

export default class AssertUtils {

    /**
     * Throw error with the specified message or default `The expression is invalid or not matched!`
     * @param message to be thrown
     */
    private static assertMessage(message?: string | null | undefined): void {
        throwError(message || 'The expression is invalid or not matched!');
        throw new Error(message || 'The expression is invalid or not matched!');
    }

    /**
     * Check the specified expression whether is <code>TRUE</code>.
     * If <code>FALSE/null/undefined</code>, then error will be thrown as default or as the specified message
     * @param expression to check
     * @param message to be thrown
     */
    public static isTrueValue(expression?: boolean | null | undefined, message?: string | null | undefined): void {
        (expression !== true)
        && AssertUtils.assertMessage(message || 'The expression value must be TRUE!');
    }

    /**
     * Check the specified expression whether is <code>FALSE</code>.
     * If <code>TRUE/null/undefined</code>, then error will be thrown as default or as the specified message
     * @param expression to check
     * @param message to be thrown
     */
    public static isFalseValue(expression?: boolean | null | undefined, message?: string | null | undefined): void {
        (expression !== false)
        && AssertUtils.assertMessage(message || 'The expression value must be FALSE!');
    }

    /**
     * Check the specified expression whether is not <code>TRUE</code>.
     * If <code>TRUE/null/undefined</code>, then error will be thrown as default or as the specified message
     * @param expression to check
     * @param message to be thrown
     */
    public static isNotTrueValue(expression?: boolean | null | undefined, message?: string | null | undefined): void {
        (expression === true)
        && AssertUtils.assertMessage(message || 'The expression value must be NOT TRUE!');
    }

    /**
     * Check the specified expression whether is not <code>FALSE</code>.
     * If <code>FALSE/null/undefined</code>, then error will be thrown as default or as the specified message
     * @param expression to check
     * @param message to be thrown
     */
    public static isNotFalseValue(expression?: boolean | null | undefined, message?: string | null | undefined): void {
        (expression === false)
        && AssertUtils.assertMessage(message || 'The expression value must be NOT TRUE!');
    }

    /**
     * Check the specified predicate whether is <code>TRUE</code>.
     * If <code>FALSE/null/undefined</code>, then error will be thrown as default or as the specified message
     * @param predicate to check
     * @param message to be thrown
     * @param caller the predicate caller instance
     * @param args the predicate arguments
     */
    public static isPredicateTrue(predicate?: () => boolean | null | undefined, message?: string | null | undefined,
                                  caller?: any | null | undefined, ...args: any[]): void {
        const predicateResult: boolean | null | undefined = ObjectUtils.isNotNou(predicate)
            ? predicate.apply(caller || this, [ ...args])
            : undefined;
        AssertUtils.isTrueValue(predicateResult, message);
    }

    /**
     * Check the specified predicate whether is not <code>TRUE</code>.
     * If <code>TRUE/null/undefined</code>, then error will be thrown as default or as the specified message
     * @param predicate to check
     * @param message to be thrown
     * @param caller the predicate caller instance
     * @param args the predicate arguments
     */
    public static isPredicateNotTrue(predicate?: () => boolean | null | undefined, message?: string | null | undefined,
                                     caller?: any | null | undefined, ...args: any[]): void {
        const predicateResult: boolean | null | undefined = ObjectUtils.isNotNou(predicate)
            ? predicate.apply(caller || this, [ ...args])
            : undefined;
        AssertUtils.isNotTrueValue(predicateResult, message);
    }

    /**
     * Check the specified predicate whether is <code>null/undefined</code>.
     * If not <code>null/undefined</code>, then error will be thrown as default or as the specified message
     * @param predicate to check
     * @param message to be thrown
     * @param caller the predicate caller instance
     * @param args the predicate arguments
     */
    public static isPredicateNou(predicate?: () => any | null | undefined, message?: string | null | undefined,
                                 caller?: any | null | undefined, ...args: any[]): void {
        const predicateResult: any | null | undefined = ObjectUtils.isNotNou(predicate)
            ? predicate.apply(caller || this, [ ...args])
            : undefined;
        AssertUtils.isValueNou(predicateResult, message);
    }

    /**
     * Check the specified expression whether is <code>null/undefined</code>.
     * If not <code>null/undefined</code>, then error will be thrown as default or as the specified message
     * @param expression to check
     * @param message to be thrown
     */
    public static isValueNou(expression?: any | null | undefined, message?: string | null | undefined): void {
        AssertUtils.isTrueValue(ObjectUtils.isNou(expression),
            message || 'The expression value must be NULL/UNDEFINED!');
    }

    /**
     * Check the specified predicate whether is not <code>null/undefined</code>.
     * If <code>null/undefined</code>, then error will be thrown as default or as the specified message
     * @param predicate to check
     * @param message to be thrown
     * @param caller the predicate caller instance
     * @param args the predicate arguments
     */
    public static isPredicateNotNou(predicate?: () => any | null | undefined, message?: string | null | undefined,
                                    caller?: any | null | undefined, ...args: any[]): void {
        const predicateResult: any | null | undefined = ObjectUtils.isNotNou(predicate)
            ? predicate.apply(caller || this, [ ...args])
            : undefined;
        AssertUtils.isValueNotNou(predicateResult, message);
    }

    /**
     * Check the specified expression whether is not <code>null/undefined</code>.
     * If <code>null/undefined</code>, then error will be thrown as default or as the specified message
     * @param expression to check
     * @param message to be thrown
     */
    public static isValueNotNou(expression?: any | null | undefined, message?: string | null | undefined): void {
        AssertUtils.isTrueValue(ObjectUtils.isNotNou(expression),
            message || 'The expression value must be NOT NULL/UNDEFINED!');
    }

    /**
     * Check the specified predicate whether is <code>an array</code>.
     * If not <code>an array</code>, then error will be thrown as default or as the specified message
     * @param predicate to check
     * @param message to be thrown
     * @param caller the predicate caller instance
     * @param args the predicate arguments
     */
    public static isPredicateArray(predicate?: () => any[] | null | undefined, message?: string | null | undefined,
                                   caller?: any | null | undefined, ...args: any[]): void {
        const predicateResult: any[] | null | undefined = ObjectUtils.isNotNou(predicate)
            ? predicate.apply(caller || this, [ ...args])
            : undefined;
        AssertUtils.isValueArray(predicateResult, message);
    }

    /**
     * Check the specified expression whether is <code>an array</code>.
     * If not <code>an array</code>, then error will be thrown as default or as the specified message
     * @param expression to check
     * @param message to be thrown
     */
    public static isValueArray(expression?: any[] | null | undefined, message?: string | null | undefined): void {
        AssertUtils.isTrueValue(ArrayUtils.isArray(expression), message || 'The expression value must be AN ARRAY!');
    }

    /**
     * Check the specified predicate whether is not <code>an array</code>.
     * If <code>an array</code>, then error will be thrown as default or as the specified message
     * @param predicate to check
     * @param message to be thrown
     * @param caller the predicate caller instance
     * @param args the predicate arguments
     */
    public static isPredicateNotArray(predicate?: () => any[] | null | undefined, message?: string | null | undefined,
                                      caller?: any | null | undefined, ...args: any[]): void {
        const predicateResult: any[] | null | undefined = ObjectUtils.isNotNou(predicate)
            ? predicate.apply(caller || this, [ ...args])
            : undefined;
        AssertUtils.isValueNotArray(predicateResult, message);
    }

    /**
     * Check the specified expression whether is not <code>an array</code>.
     * If <code>an array</code>, then error will be thrown as default or as the specified message
     * @param expression to check
     * @param message to be thrown
     */
    public static isValueNotArray(expression?: any[] | null | undefined, message?: string | null | undefined): void {
        AssertUtils.isTrueValue(!ArrayUtils.isArray(expression), message || 'The expression value must be NOT AN ARRAY!');
    }

    /**
     * Check the specified predicate whether is <code>an array and empty</code>.
     * If not <code>an array and empty</code>, then error will be thrown as default or as the specified message
     * @param predicate to check
     * @param message to be thrown
     * @param caller the predicate caller instance
     * @param args the predicate arguments
     */
    public static isPredicateEmptyArray(predicate?: () => any[] | null | undefined, message?: string | null | undefined,
                                        caller?: any | null | undefined, ...args: any[]): void {
        const predicateResult: any[] | null | undefined = ObjectUtils.isNotNou(predicate)
            ? predicate.apply(caller || this, [ ...args])
            : undefined;
        AssertUtils.isValueEmptyArray(predicateResult, message);
    }

    /**
     * Check the specified expression whether is <code>an array and empty</code>.
     * If not <code>an array and empty</code>, then error will be thrown as default or as the specified message
     * @param expression to check
     * @param message to be thrown
     */
    public static isValueEmptyArray(expression?: any[] | null | undefined, message?: string | null | undefined): void {
        AssertUtils.isTrueValue(ArrayUtils.isEmptyArray(expression), message || 'The expression value must be AN ARRAY AND EMPTY!');
    }

    /**
     * Check the specified predicate whether is not <code>an array and not empty</code>.
     * If not <code>an array and not empty</code>, then error will be thrown as default or as the specified message
     * @param predicate to check
     * @param message to be thrown
     * @param caller the predicate caller instance
     * @param args the predicate arguments
     */
    public static isPredicateNotEmptyArray(predicate?: () => any[] | null | undefined, message?: string | null | undefined,
                                           caller?: any | null | undefined, ...args: any[]): void {
        const predicateResult: any[] | null | undefined = ObjectUtils.isNotNou(predicate)
            ? predicate.apply(caller || this, [ ...args])
            : undefined;
        AssertUtils.isValueNotEmptyArray(predicateResult, message);
    }

    /**
     * Check the specified expression whether is not <code>an array and not empty</code>.
     * If not <code>an array and not empty</code>, then error will be thrown as default or as the specified message
     * @param expression to check
     * @param message to be thrown
     */
    public static isValueNotEmptyArray(expression?: any[] | null | undefined, message?: string | null | undefined): void {
        AssertUtils.isTrueValue(ArrayUtils.isNotEmptyArray(expression), message || 'The expression value must be A NON-EMPTY ARRAY!');
    }
}
