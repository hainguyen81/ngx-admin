import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {from, Observable, throwError} from 'rxjs';
import {IDbService} from './interface.service';
import {Inject} from '@angular/core';
import {LogConfig} from '../config/log.config';

export abstract class AbstractDbService<T> implements IDbService<T> {

  protected getDbService(): NgxIndexedDBService {
    return this.dbService;
  }

  protected getLogger(): NGXLogger {
    return this.logger;
  }

  protected constructor(@Inject(NgxIndexedDBService) private dbService: NgxIndexedDBService,
                        @Inject(NGXLogger) private logger: NGXLogger,
                        dbStore: string) {
    dbService || throwError('Could not inject IndexDb!');
    logger || throwError('Could not inject logger!');
    dbService.currentStore = dbStore || this.constructor.name;
    logger.updateConfig(LogConfig);
  }

  abstract delete(entity: T): Observable<number>;
  abstract findById(id?: any): Observable<T>;
  abstract findEntities(criteria?: any): Observable<T[]>;
  abstract insert(entity: T): Observable<number>;
  abstract update(entity: T): Observable<number>;
  clear(): Observable<any> {
    return from(this.getDbService().clear());
  };
}
