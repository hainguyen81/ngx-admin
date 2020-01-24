import {Inject, Injectable} from '@angular/core';
import {AbstractDbService} from '../database.service';
import {IModule} from '../../@core/data/module';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {DB_STORE} from '../../config/db.config';
import {ConnectionService} from 'ng-connection-service';

@Injectable()
export class ModuleService extends AbstractDbService<IModule> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.module);
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IModule[]) => {
        if (args && args.length) {
            this.getDbService().delete({'id': args[0].id})
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        }
    }

    updateExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IModule[]) => {
        if (args && args.length) {
            let updatorMap: Map<string, any>;
            updatorMap = new Map<string, any>(Object.entries(args[0]));
            this.getDbService().update(updatorMap.entries(), {'id': args[0].id})
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        }
    }
}
