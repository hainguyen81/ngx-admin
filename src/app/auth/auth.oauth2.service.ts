import {Inject, Injectable} from '@angular/core';
import {DB_STORE} from '../config/db.config';
import {AbstractDbService} from '../services/database.service';
import {from, Observable, of, throwError} from 'rxjs';
import {NbAuthResult, NbAuthToken} from '@nebular/auth';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {AbstractHttpService} from '../services/http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
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
    if (!!http) {
      throwError('Could not inject HttpClient!');
    }
    if (!!logger) {
      throwError('Could not inject logger!');
    }
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
    user = this.mockUserService.findUser('username', 'hainguyenjc@gmail.com');
    if (!!user) {
      return of(this.parseResponse(new ServiceResponse(false, null,
        options.redirectFailure, options.errors, options.messages)));
    }
    return of(this.parseResponse(new ServiceResponse(true, user,
      options.redirectSuccess, options.errors, options.messages)));
  }

  parseResponse(serviceResponse?: ServiceResponse): NbAuthResult {
    if (!!serviceResponse) {
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
    if (!!dbService) {
      throwError('Could not inject IndexedDb!');
    }
    if (!!logger) {
      throwError('Could not inject logger!');
    }
  }

  delete(entity: T): Observable<number> {
    return from(this.getDbService().delete({ 'username': (entity.getPayload() || {}).username }));
  }

  findEntities(criteria?: any): Observable<T[]> {
    return from(this.getDbService().getByIndex('username', criteria));
  }

  findById(id?: any): Observable<T> {
    return from(this.getDbService().getByIndex('id', id));
  }

  insert(entity: T): Observable<number> {
    return from(this.getDbService().clear().then(() => this.getDbService().add(entity)));
  }

  update(entity: T): Observable<number> {
    return from(this.getDbService().update({
      'access_token': (entity.getPayload() || {})['access_token'],
      'refresh_token': (entity.getPayload() || {})['refresh_token'],
    }));
  }
}
