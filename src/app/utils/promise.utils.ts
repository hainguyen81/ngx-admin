import {from, Observable, of} from 'rxjs';
import {isPromise} from 'rxjs/internal-compatibility';

export default class PromiseUtils {
    public static promiseToObservable<K>(promise: Promise<K>): Observable<K> {
        if (!promise || !isPromise(promise)) {
            return of(null);
        }
        const _this = this;
        return from(promise.then(value => value));
    }
}
