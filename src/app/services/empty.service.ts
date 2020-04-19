import {throwError} from 'rxjs';
import {AbstractBaseDbService} from './database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {Inject, Injectable} from '@angular/core';
import {ConnectionService} from 'ng-connection-service';

/**
 * Example empty IndexDb service
 */
@Injectable()
export class EmptyService extends AbstractBaseDbService<any> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, 'EMPTY');
        dbService || throwError('Could not inject IndexDb!');
        logger || throwError('Could not inject logger!');
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: any[]) => {
        super.getLogger().debug('Call delete entity....');
        resolve(0);
    }

    updateExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: any[]) => {
        super.getLogger().debug('Call insert entity....');
        resolve(0);
    }

    update(entity: any): Promise<number> {
        return new Promise((resolve) => {
            super.getLogger().debug('Call update entity....');
            resolve(0);
        });
    }

    getAll(): Promise<any[]> {
        return new Promise((resolve) => {
            super.getLogger().debug('Call get all entities....');
            resolve(null);
        });
    }

    findById(id?: any): Promise<any> {
        return new Promise((resolve) => {
            super.getLogger().debug('Call find entity by identity....');
            resolve(null);
        });
    }

    findEntities(criteria?: any): Promise<any[]> {
        return new Promise((resolve) => {
            super.getLogger().debug('Call find entities by criteria....');
            resolve([]);
        });
    }
}
