import {Inject, Injectable} from '@angular/core';
import {AbstractDbService} from '../database.service';
import {Module} from '../../@core/data/module';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {DB_STORE} from '../../config/db.config';

@Injectable()
export class ModuleService extends AbstractDbService<Module> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService, @Inject(NGXLogger) logger: NGXLogger) {
        super(dbService, logger, DB_STORE.module);
    }

    delete(entity: Module): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getDbService().currentStore = this.getDbStore();
            this.getDbService().delete({'code': entity.code})
                .then(() => resolve(1), (errors) => { this.getLogger().error(errors); reject(errors); });
        });
    }

    update(entity: Module): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getDbService().currentStore = this.getDbStore();
            this.getDbService().update({ 'name': entity.name })
                .then(() => resolve(1), (errors) => { this.getLogger().error(errors); reject(errors); });
        });
    }
}
