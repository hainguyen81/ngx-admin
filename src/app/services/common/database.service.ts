import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {throwError} from 'rxjs';
import {Inject} from '@angular/core';
import {LogConfig} from '../../config/log.config';
import {IDbService} from './interface.service';
import {ConnectionService} from 'ng-connection-service';
import PromiseUtils from '../../utils/common/promise.utils';
import {IModel} from '../../@core/data/base';
import {IdGenerators} from '../../config/generator.config';
import ObjectUtils from '../../utils/common/object.utils';

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

    protected getEnityKey(): string {
        return this.entityKey;
    }

    protected getLogger(): NGXLogger {
        return this.logger;
    }

    protected constructor(@Inject(NgxIndexedDBService) private dbService: NgxIndexedDBService,
                          @Inject(NGXLogger) private logger: NGXLogger,
                          @Inject(ConnectionService) private connectionService: ConnectionService,
                          private dbStore: string,
                          private entityKey: string) {
        dbService || throwError('Could not inject IndexDb!');
        logger || throwError('Could not inject logger!');
        connectionService || throwError('Could not inject connection service!');
        (dbStore || '').length || throwError('Database store name must be not empty!');
        (entityKey || '').length || throwError('Database entity key property must be not empty!');
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
    };

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

    deletePernament(entity: T): Promise<number> {
        const entityAny: any = ObjectUtils.as<any>(entity);
        entityAny[this.getEnityKey()] || throwError(
            'Not found entity primary key from property {' + this.getEnityKey() + '}');
        return new Promise((resolve, reject) => {
            this.getDbService().delete(this.getDbStore(), entityAny[this.getEnityKey()])
                .then((affected) => resolve(affected), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        });
    }

    clear(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getDbService().clear(this.getDbStore())
                .then(() => resolve(true), (errors) => {
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
        let promises: Promise<number>[];
        promises = [];
        if (entities && entities.length) {
            entities.forEach((entity: T) => promises.push(this.insert(entity)));
        }
        return this.invokePromises(0,
            (result: number, value: number) => (result + (value > 0 ? 1 : 0)),
            promises);
    }

    updateEntities(entities: T[]): Promise<number> {
        let promises: Promise<number>[];
        promises = [];
        if (entities && entities.length) {
            entities.forEach((entity: T) => promises.push(this.update(entity)));
        }
        return this.invokePromises(0,
            (result: number, value: number) => (result + (value > 0 ? 1 : 0)),
            promises);
    }

    deleteEntities(entities: T[]): Promise<number> {
        let promises: Promise<number>[];
        promises = [];
        if (entities && entities.length) {
            entities.forEach((entity: T) => promises.push(this.delete(entity)));
        }
        return this.invokePromises(0,
            (result: number, value: number) => (result + (value > 0 ? 1 : 0)),
            promises);
    }

    deleteEntitiesPernament(entities: T[]): Promise<number> {
        let promises: Promise<number>[];
        promises = [];
        if (entities && entities.length) {
            entities.forEach((entity: T) => promises.push(this.deletePernament(entity)));
        }
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
     * @param defValue default value if promises array is empty or error
     * @param calculateResult the function to combine multiple result to one.
     * The first parameter is result that will be returned (combined),
     * the second parameter is result of every promise to combine
     * @param promises promises array to invoke
     * @return the combined promise or promise of default value
     */
    protected invokePromises<K>(defValue: K,
                                calculateResult: (result: K, value: K) => K,
                                promises: Promise<K>[]): Promise<K> {
        return PromiseUtils.sequencePromises(defValue, calculateResult, promises);
    }

    /**
     * TODO ngx-indexed-db v5.0.2
     * Open cursor by the specified key range
     * @param cursorCallback cursor callback for handling
     * @param keyRange key range for filtering
     */
    openCursorByKeyRange(cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange): Promise<void> {
        return this.getDbService().openCursor(this.getDbStore(), cursorCallback, keyRange);
    }

    /**
     * TODO ngx-indexed-db v5.0.2
     * Open cursor by the specified key range
     * @param cursorCallback cursor callback for handling
     */
    openCursor(cursorCallback: (event: Event) => void): Promise<void> {
        return this.getDbService().openCursor(this.getDbStore(), cursorCallback, undefined);
    }

    /**
     * TODO ngx-indexed-db v5.0.2
     * Open a cursor by index filter.
     * @param indexName The index name to filter.
     * @param keyRange The range value and criteria to apply on the index.
     * @param cursorCallback A callback called when done.
     */
    openCursorByIndex(indexName: string,
                      keyRange: IDBKeyRange,
                      cursorCallback: (event: Event) => void): Promise<void> {
        return this.getDbService().openCursorByIndex(
            this.getDbStore(), indexName, keyRange, cursorCallback);
    }

    /**
     * TODO ngx-indexed-db v5.0.2
     * Returns all items by an index.
     * @param indexName The index name to filter
     * @param keyRange  The range value and criteria to apply on the index.
     */
    getAllByIndex(indexName: string, keyRange: IDBKeyRange): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.getDbService().getAllByIndex(this.getDbStore(), indexName, keyRange)
                .then((value: T[]) => resolve(value), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        });
    }

    synchronize() {
        // TODO Override by children class to synchronize offline data to service via HTTP service
        this.getLogger().debug('Synchronize data...');
    }
}

/**
 * Abstract IndexedDb database service
 * @param <T> entity type
 */
export abstract class AbstractBaseDbService<T> extends AbstractDbService<T> {

    protected constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(ConnectionService) connectionService: ConnectionService,
                          dbStore: string) {
        super(dbService, logger, connectionService, dbStore, 'uid');
    }
}

/**
 * Base IndexedDb database service
 * @param <T> entity type
 */
export abstract class BaseDbService<T extends IModel> extends AbstractBaseDbService<T> {

    protected constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(ConnectionService) connectionService: ConnectionService,
                          dbStore: string) {
        super(dbService, logger, connectionService, dbStore);
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: T[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            args[0].deletedAt = (new Date()).getTime();
            this.updateExecutor.apply(this, [resolve, reject, ...args]);
        } else resolve(0);
    };

    saveEntities(entities: T[]): Promise<number> {
        const insertedEntities: T[] = [];
        const updatedEntities: T[] = [];
        (entities || []).forEach(entity => {
            entity.id = (entity.id || IdGenerators.oid.generate());
            if (ObjectUtils.isNou(ObjectUtils.as<any>(entity)['uid'])) {
                entity.createdAt = (new Date()).getTime();
                insertedEntities.push(entity);
            } else {
                entity.updatedAt = (new Date()).getTime();
                updatedEntities.push(entity);
            }
        });
        return PromiseUtils.sequencePromises(0,
            (result: number, value: number) => result = result + value, [
                this.updateEntities(updatedEntities),
                this.insertEntities(insertedEntities),
            ]).then(value => {
                this.getLogger().debug('Save entities', value);
                return value;
            }, reason => {
                this.getLogger().error(reason);
                return 0;
            }).catch(reason => {
                this.getLogger().error(reason);
                return 0;
            });
    }
}
