import {from, Observable, of} from 'rxjs';
import {isPromise} from 'rxjs/internal-compatibility';

/**
 * Promise utilities
 */
export default class PromiseUtils {
    /**
     * Convert the specified Promise to Observable
     * @param promise to convert
     * @return the converted observable
     */
    public static promiseToObservable<K>(promise: Promise<K>): Observable<K> {
        if (!promise || !isPromise(promise)) {
            return of(null);
        }
        return from(promise.then(value => value));
    }
}
