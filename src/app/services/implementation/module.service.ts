import {Inject, Injectable} from '@angular/core';
import {AbstractDbService} from '../database.service';
import {IModule} from '../../@core/data/module';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {DB_STORE} from '../../config/db.config';

@Injectable()
export class ModuleService extends AbstractDbService<IModule> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService, @Inject(NGXLogger) logger: NGXLogger) {
        super(dbService, logger, DB_STORE.module);
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IModule[]) => {
        if (args && args.length) {
            this.getDbService().delete({'code': args[0].code})
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        }
    }

    updateExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IModule[]) => {
        if (args && args.length) {
            this.getDbService().update({'name': args[0].name})
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        }
    }
}
