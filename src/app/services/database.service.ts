import {Inject} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {COMMON} from '../app.config';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';
import {IDbService} from './interface.service';

export abstract class AbstractDbService<T> implements IDbService<T> {

  @Inject(NgxIndexedDBService) private readonly dbService: NgxIndexedDBService;
  protected getDbService(): NgxIndexedDBService {
    return this.dbService;
  }

  @Inject(NGXLogger) private logger: NGXLogger;
  protected getLogger(): NGXLogger {
    return this.logger;
  }

  protected constructor(dbStore?: string) {
    this.getLogger().updateConfig({ level: COMMON.log.level, serverLogLevel: COMMON.log.serverLogLevel });
    this.getDbService().currentStore = dbStore || this.constructor.name;
  }

  abstract delete(entity: T): Observable<number>;
  abstract findById(id?: any): Observable<T>;
  abstract findEntities(criteria?: any): Observable<T[]>;
  abstract insert(entity: T): Observable<number>;
  abstract update(entity: T): Observable<number>;
}
