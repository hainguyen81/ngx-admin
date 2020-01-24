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
        dbService.currentStore = dbStore || this.constructor.name;
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
    abstract updateExecutor: PromiseExecutor<number, T>;

    delete(entity: T): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getDbService().currentStore = this.getDbStore();
            this.deleteExecutor.apply(this, [resolve, reject, entity]);
        });
    }

    update(entity: T): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getDbService().currentStore = this.getDbStore();
            this.updateExecutor.apply(this, [resolve, reject, entity]);
        });
    }

    findEntities(indexName: string, criteria?: any): Promise<T[]> {
        if (!criteria) return this.getAll();
        return new Promise((resolve, reject) => {
            this.getDbService().currentStore = this.getDbStore();
            this.getDbService().getByIndex(indexName, criteria)
                .then((value: T[]) => resolve(value),
                    (errors) => {
                        this.getLogger().error(errors);
                        reject(errors);
                    });
        });
    }

    findById(id?: any): Promise<T> {
        return new Promise((resolve, reject) => {
            this.getDbService().currentStore = this.getDbStore();
            this.getDbService().getByIndex('id', id)
                .then((value: T) => resolve(value),
                    (errors) => {
                        this.getLogger().error(errors);
                        reject(errors);
                    });
        });
    }

    insert(entity: T): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getDbService().currentStore = this.getDbStore();
            this.getDbService().clear().then(() => this.getDbService().add(entity))
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        });
    }

    clear(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getDbService().currentStore = this.getDbStore();
            this.getDbService().clear()
                .then(() => resolve(), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        });
    }

    getAll(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.getDbService().currentStore = this.getDbStore();
            this.getDbService().getAll()
                .then((value: T[]) => resolve(value), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        });
    }

    insertEntities(entities: T[]): Promise<number> {
        if (!entities || !entities.length) {
            return new Promise(((resolve) => resolve(0)));
        }
        return new Promise<number>((resolve, reject) => {
            try {
                this.getDbService().currentStore = this.getDbStore();
                entities.forEach((entity: T) => this.insert(entity));
                resolve(entities.length);
            } catch (e) {
                reject(e);
            }
        });
    }

    deleteEntities(entities: T[]): Promise<number> {
        if (!entities || !entities.length) {
            return new Promise(((resolve) => resolve(0)));
        }
        return new Promise<number>((resolve, reject) => {
            try {
                this.getDbService().currentStore = this.getDbStore();
                entities.forEach((entity: T) => this.delete(entity));
                resolve(entities.length);
            } catch (e) {
                reject(e);
            }
        });
    }

    synchronize() {
        // TODO Override by children class to synchronize offline data to service via HTTP service
        this.getLogger().debug('Synchronize data...');
    }
}
