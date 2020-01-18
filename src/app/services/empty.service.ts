import {Observable, of, throwError} from 'rxjs';
import {AbstractDbService} from './database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {Inject, Injectable} from '@angular/core';

@Injectable()
export class EmptyService extends AbstractDbService<any> {

  constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
              @Inject(NGXLogger) logger: NGXLogger) {
    super(dbService, logger, 'EMPTY');
    dbService || throwError('Could not inject IndexDb!');
    logger || throwError('Could not inject logger!');
  }

  delete(entity: any): Observable<number> {
    super.getLogger().debug('Call delete entity....');
    return of(0);
  }

  insert(entity: any): Observable<number> {
    super.getLogger().debug('Call insert entity....');
    return of(0);
  }

  update(entity: any): Observable<number> {
    super.getLogger().debug('Call update entity....');
    return of(0);
  }

  findById(id?: any): Observable<any> {
    super.getLogger().debug('Call find entity by identity....');
    return of(null);
  }

  findEntities(criteria?: any): Observable<any[]> {
    super.getLogger().debug('Call find entities by criteria....');
    return of([]);
  }
}
