import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {throwError} from 'rxjs';
import {Inject} from '@angular/core';
import {LogConfig} from '../config/log.config';
import {IDbService} from './interface.service';
import {ConnectionService} from 'ng-connection-service';

/**
 * The delegate Promise function type for delete/update delegate function of IndexDb service
 * @param <T> entity type
 * @param <K> argument type
 */
export type PromiseExecutor<T, K> = (resolve: (value?: T | PromiseLike<T>) => void,
                                     reject: (reason?: any) => void,
                                     ...args: K[]) => void;

/**
 * Abstract IndexedDb database service
 * @param <T> entity type
 */
export abstract class AbstractDbService<T> implements IDbService<T> {

    protected getDbService(): NgxIndexedDBService {
        return this.dbService;
    }

    protected getConnectionService(): ConnectionService {
        return this.connectionService;
    }

    protected getDbStore(): string {
        return this.dbStore;
    }

    protected getLogger(): NGXLogger {
        return this.logger;
    }

    protected constructor(@Inject(NgxIndexedDBService) private dbService: NgxIndexedDBService,
                          @Inject(NGXLogger) private logger: NGXLogger,
                          @Inject(ConnectionService) private connectionService: ConnectionService,
                          private dbStore: string) {
        dbService || throwError('Could not inject IndexDb!');
        logger || throwError('Could not inject logger!');
        connectionService || throwError('Could not inject connection service!');
        logger.updateConfig(LogConfig);
        connectionService.monitor().subscribe((connected) => {
            if (connected) {
                this.synchronize();
            } else {
                this.getLogger().warn('Not found internet connection to synchronize offline data');
            }
        });
    }

    abstract deleteExecutor: PromiseExecutor<number, T>;

    updateExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: T[]) => {
        if (args && args.length) {
            this.getLogger().debug('Update data', args, 'First data', args[0]);
            this.getDbService().update(this.getDbStore(), args[0])
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error('Could not update data', errors);
                    reject(errors);
                });
        } else resolve(0);
    }

    delete(entity: T): Promise<number> {
        const _this: AbstractDbService<T> = this;
        return new Promise((resolve, reject) => {
            this.deleteExecutor.apply(_this, [resolve, reject, entity]);
        });
    }

    update(entity: T): Promise<number> {
        const _this: AbstractDbService<T> = this;
        return new Promise((resolve, reject) => {
            this.updateExecutor.apply(_this, [resolve, reject, entity]);
        });
    }

    findEntities(indexName: string, criteria?: any): Promise<T[]> {
        if (!criteria) return this.getAll();
        return new Promise((resolve, reject) => {
            this.getDbService().getByIndex(this.getDbStore(), indexName, criteria)
                .then((value: T[]) => resolve(value),
                    (errors) => {
                        this.getLogger().error(errors);
                        reject(errors);
                    });
        });
    }

    findById(id?: any): Promise<T> {
        return new Promise((resolve, reject) => {
            this.getDbService().getByIndex(this.getDbStore(), 'id', id)
                .then((value: T) => resolve(value),
                    (errors) => {
                        this.getLogger().error(errors);
                        reject(errors);
                    });
        });
    }

    insert(entity: T): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getDbService().add(this.getDbStore(), entity)
                .then((affected) => resolve(affected), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        });
    }

    clear(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getDbService().clear(this.getDbStore())
                .then(() => resolve(), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        });
    }

    getAll(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.getDbService().getAll(this.getDbStore())
                .then((value: T[]) => resolve(value), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        });
    }

    insertEntities(entities: T[]): Promise<number> {
        if (!(entities || []).length) {
            return Promise.resolve(0);
        }

        let promises: Promise<number>[];
        promises = [];
        entities.forEach((entity: T) => promises.push(this.insert(entity)));
        return this.invokePromises(0,
            (result: number, value: number) => (result + (value > 0 ? 1 : 0)),
            promises);
    }

    deleteEntities(entities: T[]): Promise<number> {
        if (!(entities || []).length) {
            return Promise.resolve(0);
        }

        let promises: Promise<number>[];
        promises = [];
        entities.forEach((entity: T) => promises.push(this.delete(entity)));
        return this.invokePromises(0,
            (result: number, value: number) => (result + (value > 0 ? 1 : 0)),
            promises);
    }

    count(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getDbService().count(this.getDbStore())
                .then((recNumber) => resolve(recNumber), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        });
    }

    /**
     * Invoke multiple promises for combining into one promise
     * @param initialValue initial value if promises array is empty or error
     * @param calculateResult the function to combine multiple result to one.
     * The first parameter is result that will be returned (combined),
     * the second parameter is result of every promise to combine
     * @param promises promises array to invoke
     * @return the combined promise or promise of default value
     */
    protected invokePromises<K>(initialValue: K,
                                calculateResult: (result: K, value: K) => K,
                                promises: Promise<K>[]): Promise<K> {
        if (!promises || !promises.length || !calculateResult) {
            return Promise.resolve(initialValue);
        }
        let result: K;
        result = initialValue;
        return promises.reduce((previousValue, currentValue, currentIndex) => {
            return previousValue.then((prevValue) => {
                result = calculateResult(result, prevValue);
                this.getLogger().debug('Invoke promises(' + currentIndex + ')', prevValue, 'Results: ', result);
                return currentValue.then((curValue) => {
                    return Promise.resolve(calculateResult(result, curValue));

                }).catch((errors) => {
                    this.getLogger().error('Could not invoke multiple promises', errors);
                    return Promise.resolve(result);
                });

            }).catch((errors) => {
                this.getLogger().error('Could not invoke multiple promises', errors);
                return Promise.resolve(initialValue);
            });
        }, Promise.resolve(initialValue));
    }

    synchronize() {
        // TODO Override by children class to synchronize offline data to service via HTTP service
        this.getLogger().debug('Synchronize data...');
    }
}
