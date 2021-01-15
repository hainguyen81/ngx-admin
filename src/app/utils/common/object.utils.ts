import {Observable} from 'rxjs';
import {Type} from '@angular/core';

export type NoParamConstructor<T> = new() => T;
export type Constructor<T> = new(...args: any[]) => T;
export const DeepCloner = require('clone-deep');

export type Enum<V> = Record<keyof any, V> & { [k: number]: V };

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
        try {
            return (value instanceof type ? value as K : undefined);
        } catch (e) {
            return undefined;
        }
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
            return cp.map((n: any) => ObjectUtils.deepCopy<any>(n)) as any;
        }
        if (typeof target === 'object' && target !== {}) {
            const cp = {...(target as { [key: string]: any })} as { [key: string]: any };
            Object.keys(cp).forEach(k => {
                cp[k] = ObjectUtils.deepCopy<any>(cp[k]);
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

    /**
     * Get all keys of the specified enum type
     * @param enumType to parse
     * @return all keys of the specified enum type
     */
    public static enumKeys<E extends Enum<E>>(enumType: Type<E>): string[] {
        return Object.keys(enumType).filter(k => typeof ObjectUtils.requireValue(enumType, k) === 'number');
    }
    /**
     * Get all values of the specified enum type
     * @param enumType to parse
     * @return all values of the specified enum type
     */
    public static enumValues<E extends Enum<E>>(enumType: Type<E>): number[] {
        const keys = Object.keys(enumType).filter(k => typeof ObjectUtils.requireValue(enumType, k) === 'number');
        return keys.map(k => ObjectUtils.requireTypedValue<number>(enumType, k));
    }

    /**
     * Get a boolean value indicating the specified object whether is null/undefined
     * @param obj to check
     * @return true for null/undefined; else false
     */
    public static isNou(obj: any): boolean {
        return (obj === null || obj === undefined);
    }

    /**
     * Get a boolean value indicating the specified object whether is not null/undefined
     * @param obj to check
     * @return true for non null/undefined; else false
     */
    public static isNotNou(obj: any): boolean {
        return !ObjectUtils.isNou(obj);
    }

    /**
     * Get a boolean value indicating the specified object/value whether is null/undefined
     * @param obj to check
     * @return true for null/undefined; else false
     */
    public static isEmpty(obj: any): boolean {
        return ObjectUtils.isNou(obj) || String(obj).length <= 0;
    }

    /**
     * Get a boolean value indicating the specified object/value whether is not null/undefined
     * @param obj to check
     * @return true for null/undefined; else false
     */
    public static isNotEmpty(obj: any): boolean {
        return !ObjectUtils.isEmpty(obj);
    }

    /**
     * Get a boolean value indicating the specified object whether is an object and not null/undefined
     * @param obj to check
     * @return true for non null/undefined object; else false
     */
    public static isObject(obj: any): boolean {
        return ObjectUtils.isNotNou(obj) && typeof obj === 'object';
    }

    /**
     * Get a boolean value indicating the specified object/value whether is null/undefined
     * @param obj to check
     * @return true for null/undefined; else false
     */
    public static isObjectEmpty(obj: any): boolean {
        return ObjectUtils.isEmpty(obj) || (typeof obj === 'object' && Object.keys(obj).length <= 0);
    }

    /**
     * Get a boolean value indicating the specified object/value whether is null/undefined
     * @param obj to check
     * @return true for null/undefined; else false
     */
    public static isObjectNotEmpty(obj: any): boolean {
        return !ObjectUtils.isObjectEmpty(obj);
    }

    /**
     * Require the property value of the specified object by key
     * @param obj to parse
     * @param k property key
     * @param defVal default value if not found
     * @return the property value or default value
     */
    public static requireValue(obj: any, k: string, defVal?: any): any {
        return (typeof obj === 'object' && ObjectUtils.isNotNou(obj)
        && (k || '').length && obj.hasOwnProperty(k) ? obj[k] : defVal);
    }

    /**
     * Require the property value of the specified object by key
     * @param obj to parse
     * @param k property key
     * @param defVal default value if not found
     * @return the property value or default value
     */
    public static requireTypedValue<T>(obj: any, k: string, defVal?: T): T {
        return <T>ObjectUtils.requireValue(obj, k, defVal);
    }

    /**
     * Cast the specified object to the typed value
     * @param obj to cast
     * @return the casted object or null/undefined
     */
    public static as<T>(obj: any): T {
        return <T>obj;
    }

    /**
     * Cast the specified object to the 'any' typed value
     * @param obj to cast
     * @return the casted 'any' object or null/undefined
     */
    public static any(obj: any): any {
        return <any>obj;
    }

    /**
     * Set value for the specified object property
     * @param obj to set property value
     * @param property to apply
     * @param value to apply
     */
    public static set(obj?: any, property?: string | null | undefined, value?: any): void {
        const anyObj: any = ObjectUtils.as(obj);
        if (ObjectUtils.isNou(anyObj) || ObjectUtils.isEmpty(property) || typeof anyObj !== 'object') {
            return;
        }
        anyObj[property || ''] = value;
    }

    /**
     * Get value for the specified object property
     * @param obj to get property value
     * @param property to check
     * @return the property value or null/undefined
     */
    public static get(obj?: any, property?: string | null | undefined): any {
        const anyObj: any = ObjectUtils.as(obj);
        if (ObjectUtils.isNou(anyObj) || ObjectUtils.isEmpty(property) || typeof anyObj !== 'object') {
            return undefined;
        }
        return anyObj[property || ''];
    }

    /**
     * Delete the specified object property
     * @param obj to delete property
     * @param property to delete
     */
    public static delete(obj?: any, property?: string | null | undefined): void {
        const anyObj: any = ObjectUtils.as(obj);
        if (ObjectUtils.isNou(anyObj) || ObjectUtils.isEmpty(property) || typeof anyObj !== 'object') {
            return undefined;
        }
        delete anyObj[property || ''];
    }
}
