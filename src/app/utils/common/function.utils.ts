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
     * @param emitErrorIfInvalidDelegate throw error if condition is matched but no delegate function to invoke
     * @param delegateTrue function to invoke if condition is <code>TRUE</code>
     * @param delegateFalse function to invoke if condition is <code>FALSE</code>
     * @param defaultValue the default returned value if invoking result is null/undefined
     * @param caller invoker
     * @param args function arguments
     * @return the result of invoking
     */
    private static internalInvoke(
        ifTrueOrNotNou?: any | null | undefined, emitErrorIfInvalidDelegate?: boolean | false,
        delegateTrue?: () => void | null | undefined, delegateFalse?: () => void | null | undefined,
        defaultValue?: any | null | undefined,
        caller?: any | null | undefined, ...args: any[] | null | undefined): any {
        const trueValue: boolean = (ObjectUtils.isNotNou(ifTrueOrNotNou)
                && ((typeof ifTrueOrNotNou === 'boolean' && ifTrueOrNotNou === true) || ObjectUtils.isObject(ifTrueOrNotNou)));
        (emitErrorIfInvalidDelegate === true) && (trueValue === true && FunctionUtils.isFunction(delegateTrue))
        && throwError('Invalid function to invoke while condition is TRUE!');
        (emitErrorIfInvalidDelegate === true) && (trueValue !== true && FunctionUtils.isFunction(delegateFalse))
        && throwError('Invalid function to invoke while condition is FALSE!');
        return (trueValue === true && FunctionUtils.isFunction(delegateTrue)
            ? (delegateTrue.apply(caller || this, args) || defaultValue)
            : (trueValue !== true && FunctionUtils.isFunction(delegateFalse))
            ? (delegateFalse.apply(caller || this, args) || defaultValue) : defaultValue);
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
        return this.internalInvoke(ifTrueOrNotNou, true, delegateTrue, delegateFalse, defaultValue, caller, args);
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
    public static invokeFalse(ifTrueOrNotNou?: any | null | undefined,
        delegateFalse?: () => void | null | undefined,
        caller?: any | null | undefined, defaultValue?: any | null | undefined, ...args: any[] | null | undefined): any {
        return this.internalInvoke(ifTrueOrNotNou, false, undefined, delegateFalse, defaultValue, caller, args);
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
    public static invokeTrue(ifTrueOrNotNou?: any | null | undefined,
        delegateTrue?: () => void | null | undefined,
        caller?: any | null | undefined, defaultValue?: any | null | undefined, ...args: any[] | null | undefined): any {
        return this.internalInvoke(ifTrueOrNotNou, false, delegateTrue, undefined, defaultValue, caller, args);
    }

    /**
     * Convert the specified object to Function
     * @param obj to convert
     * @return Function instance or null/undefined
     */
    public static asFunction(obj?: any): Function | null | undefined {
        return FunctionUtils.isFunction(obj) ? <Function>obj : undefined;
    }

    /**
     * Convert the specified property value of the specified object to Function
     * @param obj to convert
     * @param property to check
     * @return Function instance or null/undefined
     */
    public static propertyAsFunction(obj?: any, property?: string | null | undefined): Function | null | undefined {
        return FunctionUtils.asFunction(ObjectUtils.get(obj, property));
    }

    /**
     * Invoke the specified object as function if it's a function and return value if necessry
     * @param obj to invoke
     * @param caller the caller function instance or thisArg
     * @param args function arguments
     * @return the function returned value or null/undefined (as void)
     */
    public static invokeAsFunction(obj?: any, caller?: any, ...args: any[]): any {
        const objFunc: Function = FunctionUtils.asFunction(obj);
        return objFunc ? objFunc.apply(caller || this, args) : undefined;
    }

    /**
     * Invoke the specified object as function if it's a function and return value if necessry
     * @param obj to invoke
     * @param property to parse function
     * @param caller the caller function instance or thisArg
     * @param args function arguments
     * @return the function returned value or null/undefined (as void)
     */
    public static invokePropertyAsFunction(obj?: any, property?: string | null | undefined, caller?: any, ...args: any[]): any {
        const objPropFunc: Function = FunctionUtils.propertyAsFunction(obj, property);
        return objPropFunc ? objPropFunc.apply(caller || this, args) : undefined;
    }
}
