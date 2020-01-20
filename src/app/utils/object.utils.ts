import {Observable} from 'rxjs';
import {Type} from '@angular/core';

export default class ObjectUtils {
    static from<T>(observer: Observable<T>): T {
        if (!observer) {
            return undefined;
        }
        let retVal: T;
        retVal = undefined;
        observer.subscribe((value: T) => retVal = value);
        return retVal;
    }

    static cast<T, K>(value: T, type: Type<K>): K {
        if (value instanceof type)
            try {
                return <K>value;
            } catch (e) {}
        return undefined;
    }
}
