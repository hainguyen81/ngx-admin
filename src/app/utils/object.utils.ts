import {Observable} from 'rxjs';
import {Type} from '@angular/core';

export type NoParamConstructor<T> = new() => T;
export type Constructor<T> = new(...args: any[]) => T;
export const DeepCloner = require('clone-deep');

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
    public static createInstanceByType<T>(type: Type<T>): T {
        return new type();
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

    /**
     * Convert the specified Map to Object
     * @param m to convert
     * @return Object or undefined
     */
    public static fromMap<K, V>(m: Map<K, V>): Object {
        if (!m || m.size <= 0) {
            return undefined;
        }
        return Array.from(m).reduce((o, [k, v]) => {
            // Be careful! Maps can have non-String keys; object literals can't.
            // @ts-ignore
            return Object.assign(o, {[k]: v});
        }, {});
    }

    /**
     * Deep copy function for TypeScript.
     * @param T Generic type of target/copied value.
     * @param target Target value to be copied.
     * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
     * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
     */
    public static deepCopy<T>(target: T): T {
        if (target === null) {
            return target;
        }
        if (target instanceof Date) {
            return new Date(target.getTime()) as any;
        }
        if (target instanceof Array) {
            const cp = [] as any[];
            (target as any[]).forEach((v) => {
                cp.push(v);
            });
            return cp.map((n: any) => this.deepCopy<any>(n)) as any;
        }
        if (typeof target === 'object' && target !== {}) {
            const cp = {...(target as { [key: string]: any })} as { [key: string]: any };
            Object.keys(cp).forEach(k => {
                cp[k] = this.deepCopy<any>(cp[k]);
            });
            return cp as T;
        }
        return target;
    }

    /**
     * Get the first occurred value that is not un-defined in the specified arguments
     * @param args to detect
     * @return the first occurred value or undefined
     */
    public static ifDefined(...args: any): any {
        for (const arg of args) {
            if (arg) {
                return arg;
            }
        }
        return undefined;
    }

    /**
     * Get a boolean value indicating that the specified object
     * whether exists the specified property name
     * @param obj to check
     * @param propertyName to check
     * @return true for existed; else false
     */
    public static propertyExists(obj: object, propertyName: string): boolean {
        return (obj && (obj.hasOwnProperty(propertyName) || (propertyName in obj)));
    }
}
