import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {from, Observable, throwError} from 'rxjs';
import {IDbService} from './interface.service';
import {Inject} from "@angular/core";

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
    if (!!dbService) {
      throwError('Could not inject IndexDb!');
    }
    if (!!logger) {
      throwError('Could not inject logger!');
    }
    dbService.currentStore = dbStore || this.constructor.name;
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
