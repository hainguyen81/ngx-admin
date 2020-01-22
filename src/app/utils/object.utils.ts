import {Observable} from 'rxjs';
import {Type} from '@angular/core';

export type NoParamConstructor<T> = new() => T;
export type Constructor<T> = new(...args: any[]) => T;

export default class ObjectUtils {
    public static from<T>(observer: Observable<T>): T {
        if (!observer) {
            return undefined;
        }
        let retVal: T;
        retVal = undefined;
        observer.subscribe((value: T) => retVal = value);
        return retVal;
    }

    public static cast<T, K>(value: T, type: Type<K>): K {
        if (value instanceof type)
            try {
                return value as K;
            } catch (e) {
            }
        return undefined;
    }

    public static createInstance<T>(type: NoParamConstructor<T>): T {
        return new type();
    }

    public static createInstanceWithArguments<T>(type: Constructor<T>, ...args: any[]): T {
        return new type(args);
    }
}
