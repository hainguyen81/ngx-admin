import {Observable} from 'rxjs';
import {Type} from '@angular/core';

export type NoParamConstructor<T> = new() => T;
export type Constructor<T> = new(...args: any[]) => T;

/**
 * Object utilities
 */
export default class ObjectUtils {
    /**
     * Observe the specified observer
     * @param observer to observe
     * @return the observed value or undefined
     */
    public static from<T>(observer: Observable<T>): T {
        if (!observer) {
            return undefined;
        }
        let retVal: T;
        retVal = undefined;
        observer.subscribe((value: T) => retVal = value);
        return retVal;
    }

    /**
     * Cast the specified value to the specified new type
     * @param value to convert
     * @param type the destination converted type
     * @return the converted value or undefined
     */
    public static cast<T, K>(value: T, type: Type<K>): K {
        if (value instanceof type)
            try {
                return value as K;
            } catch (e) {
            }
        return undefined;
    }

    /**
     * Create a new instance of the specified type
     * @param type to create
     * @return new instance
     */
    public static createInstance<T>(type: NoParamConstructor<T>): T {
        return new type();
    }

    /**
     * Create a new instance of the specified type
     * @param type to create
     * @param args arguments of the new constructor type
     * @return new instance
     */
    public static createInstanceWithArguments<T>(type: Constructor<T>, ...args: any[]): T {
        return new type(args);
    }
}
