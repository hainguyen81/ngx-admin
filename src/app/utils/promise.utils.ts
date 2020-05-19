import {from, isObservable, Observable, of, Subscribable} from 'rxjs';
import {isPromise} from 'rxjs/internal-compatibility';
import {isNullOrUndefined} from 'util';

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

    /**
     * Invoke multiple promises for combining into one promise by running sequentially
     * @param initialValue initial value if promises array is empty or error
     * @param calculateResult the function to combine multiple result to one.
     * The first parameter is result that will be returned (combined),
     * the second parameter is result of every promise to combine
     * @param promises promises array to invoke
     * @return the combined promise or promise of default value
     */
    public static sequencePromises<K>(initialValue: K,
                                      calculateResult: (result: K, value: K) => K,
                                      promises: Promise<K>[]): Promise<K> {
        if (!promises || !promises.length) {
            return Promise.resolve(initialValue);
        }

        let result: K;
        result = initialValue;
        return promises.reduce((previousValue, currentValue, currentIndex) => {
            return previousValue.then((prevValue) => {
                result = (calculateResult ? calculateResult(result, prevValue) : prevValue);
                return currentValue.then((curValue) => {
                    return Promise.resolve(
                        calculateResult ? calculateResult(result, curValue) : result);

                }).catch((errors) => {
                    return Promise.resolve(result);
                });

            }).catch((errors) => {
                return Promise.resolve(initialValue);
            });
        }, Promise.resolve(initialValue));
    }

    /**
     * Invoke multiple promises for combining into one promise by running parallel
     * @param initialValue initial value if promises array is empty or error
     * @param calculateResult the function to combine multiple result to one.
     * The first parameter is result that will be returned (combined),
     * the second parameter is result of every promise to combine
     * @param promises promises array to invoke
     * @return the combined promise or promise of default value
     */
    public static parallelPromises<K>(initialValue: K,
                                      calculateResult: (result: K, value: K) => K,
                                      promises: Promise<K>[]): Promise<K> {
        if (!promises || !promises.length) {
            return Promise.resolve(initialValue);
        }

        return Promise.all(promises).then((values: K[]) => {
            let result: K;
            result = initialValue;
            calculateResult && (values || []).forEach(value => result = calculateResult(result, value));
            return result;

        }).catch((errors) => {
            return initialValue;
        });
    }

    /**
     * Unsubscribe an observer {Subscribable}
     * @param observer to unsubscribe
     */
    public static unsubscribe<T>(observer: Subscribable<T>): void {
        if (!isNullOrUndefined(observer) && isObservable(observer)) {
            let closed: boolean;
            if ((<Object>observer).hasOwnProperty('closed')) {
                closed = observer['closed'] as boolean || false;

            } else {
                closed = false;
            }
            if (!closed && typeof observer['unsubscribe'] === 'function') {
                try {
                    observer['unsubscribe']['apply'](observer);
                } catch (e) {
                    window.console.warn(['Could not unsubscribe', e]);
                }
            }
        }
    }
}
