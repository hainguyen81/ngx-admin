import {Observable, of} from 'rxjs';
import {AbstractDbService} from './database.service';

export class EmptyService extends AbstractDbService<any> {

  constructor(dbStore?: string) {
    super(dbStore);
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
