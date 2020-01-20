import {Inject, Injectable} from '@angular/core';
import {DB_STORE} from '../config/db.config';
import {AbstractDbService} from '../services/database.service';
import {from, Observable, of, throwError} from 'rxjs';
import {NbAuthResult, NbAuthToken} from '@nebular/auth';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {AbstractHttpService} from '../services/http.service';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ServiceResponse} from '../services/response.service';
import {environment} from '../../environments/environment';
import {MockUserService} from '../@core/mock/users.service';
import {User} from '../@core/data/user';

@Injectable()
export class NbxOAuth2AuthHttpService<T extends NbAuthToken> extends AbstractHttpService<NbAuthResult> {

  constructor(@Inject(HttpClient) http: HttpClient,
              @Inject(NGXLogger) logger: NGXLogger,
              @Inject(MockUserService) private mockUserService: MockUserService) {
    super(http, logger);
  }

  private createTokenDelegate: (value: any) => T;
  setCreateTokenDelegate(createTokenDelegate: (value: any) => T) {
    this.createTokenDelegate = createTokenDelegate;
  }

  public request(url: string, method?: string, options?: {
    body?: any;
    headers?: HttpHeaders | { [header: string]: string | string[]; };
    observe?: 'body';
    params?: HttpParams | { [param: string]: string | string[]; };
    reportProgress?: boolean;
    responseType: 'arraybuffer';
    withCredentials?: boolean;
    redirectSuccess?: any;
    redirectFailure?: any;
    errors?: any;
    messages?: any;
  }): Observable<NbAuthResult> {
    if (environment.production) {
      return super.request(url, method, options);
    }

    let user: User;
    user = this.mockUserService.findUser('username', 'admin@hsg.com');
    if (!user) {
      return of(this.parseResponse(new ServiceResponse(false, null,
        options.redirectFailure, options.errors, options.messages)));
    }
    return of(this.parseResponse(new ServiceResponse(true,
      new HttpResponse<any>({ body: JSON.stringify(user), status: 200, statusText: 'MOCK' }),
      options.redirectSuccess, options.errors, options.messages)));
  }

  parseResponse(serviceResponse?: ServiceResponse): NbAuthResult {
    if (!serviceResponse) {
      return new NbAuthResult(false);
    }
    return new NbAuthResult(serviceResponse.isSuccess(), serviceResponse.getData(),
      serviceResponse.getRedirect(), serviceResponse.getErrors(), serviceResponse.getMessages(),
      this.createTokenDelegate.apply(this, [ serviceResponse.getData() ]));
  }
}

@Injectable()
export class NbxOAuth2AuthDbService<T extends NbAuthToken> extends AbstractDbService<T> {

  constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService, @Inject(NGXLogger) logger: NGXLogger) {
    super(dbService, logger, DB_STORE.auth);
  }

  delete(entity: T): Observable<number> {
    return this.promiseToObservable(this.getDbService().delete({ 'username': (entity.getPayload() || {}).username }));
  }

  findEntities(criteria?: any): Observable<T[]> {
    if (!criteria) return super.getAll();
    return this.promiseToObservable(this.getDbService().getByIndex('username', criteria));
  }

  findById(id?: any): Observable<T> {
    return this.promiseToObservable(this.getDbService().getByIndex('id', id));
  }

  insert(entity: T): Observable<number> {
    return this.promiseToObservable(this.getDbService().clear().then(() => this.getDbService().add(entity)));
  }

  update(entity: T): Observable<number> {
    return this.promiseToObservable(this.getDbService().update({
      'access_token': (entity.getPayload() || {})['access_token'],
      'refresh_token': (entity.getPayload() || {})['refresh_token'],
    }));
  }
}
