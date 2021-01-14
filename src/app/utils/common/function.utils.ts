import {throwError} from 'rxjs';
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

    /**
     * Invoke the specific function by condition
     * @param ifTrueOrNotNou boolean/object/any to check before invoking
     * @param delegateTrue function to invoke if condition is <code>TRUE</code>
     * @param delegateFalse function to invoke if condition is <code>FALSE</code>
     * @param defaultValue the default returned value if invoking result is null/undefined
     * @param caller invoker
     * @param args function arguments
     * @return the result of invoking
     */
    public static invoke(ifTrueOrNotNou?: any | null | undefined,
        delegateTrue?: () => void | null | undefined, delegateFalse?: () => void | null | undefined,
        defaultValue?: any | null | undefined,
        caller?: any | null | undefined, ...args: any[] | null | undefined): any {
        const trueValue: boolean = (ObjectUtils.isNotNou(ifTrueOrNotNou)
                && ((typeof ifTrueOrNotNou === 'boolean' && ifTrueOrNotNou === true) || ObjectUtils.isObject(ifTrueOrNotNou)));
        (trueValue === true && FunctionUtils.isFunction(delegateTrue)) && throwError('Invalid function to invoke while condition is TRUE!');
        (trueValue !== true && FunctionUtils.isFunction(delegateFalse)) && throwError('Invalid function to invoke while condition is FALSE!');
        return (trueValue === true ? (delegateTrue.apply(caller || this, args) || defaultValue) : (delegateFalse.apply(caller || this, args) || defaultValue));
    }
}
