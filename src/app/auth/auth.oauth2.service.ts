import {Inject, Injectable} from '@angular/core';
import {DB_STORE} from '../config/db.config';
import {AbstractBaseDbService} from '../services/database.service';
import {NbAuthToken} from '@nebular/auth';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {AbstractHttpService} from '../services/http.service';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ServiceResponse} from '../services/response.service';
import {ConnectionService} from 'ng-connection-service';
import {NBX_AUTH_AUTHORIZATION_HEADER, NBX_AUTH_AUTHORIZATION_BASIC_TYPE} from './auth.interceptor';
import {Observable, of, throwError} from 'rxjs';
import EncryptionUtils from '../utils/encryption.utils';
import PromiseUtils from '../utils/promise.utils';
import {IUser} from '../@core/data/system/user';
import {UserDbService} from '../services/implementation/system/user/user.service';
import JsonUtils from '../utils/json.utils';

@Injectable()
export class NbxOAuth2AuthDbService<T extends NbAuthToken> extends AbstractBaseDbService<T> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.auth);
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: T[]) => {
        if (args && args.length) {
            this.getDbService().delete(this.getDbStore(), {'id': (args[0].getPayload() || {}).id})
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        }
    }
}

@Injectable()
export class NbxOAuth2AuthHttpService<T extends NbAuthToken> extends AbstractHttpService<T, IUser> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(UserDbService) dbService: UserDbService) {
        super(http, logger, dbService);
        dbService || throwError('Could not inject authentication database service for offline mode');
    }

    private createTokenDelegate: (value: any) => T;

    setCreateTokenDelegate(createTokenDelegate: (value: any) => T) {
        this.createTokenDelegate = createTokenDelegate;
    }

    parseResponse(serviceResponse?: ServiceResponse): T {
        if (!serviceResponse || !serviceResponse.isSuccess() || !serviceResponse.getData()) {
            return undefined;
        }
        return this.createTokenDelegate.apply(this, [serviceResponse.getData()]);
    }

    handleOfflineMode(url: string, method?: string, res?: any, options?: {
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
    }): Observable<T[] | T> {
        let headers: HttpHeaders;
        headers = (options && options.headers ? options.headers as HttpHeaders : undefined);
        if (headers && headers.has(NBX_AUTH_AUTHORIZATION_HEADER)) {
            let dbService: UserDbService;
            dbService = this.getDbService() as UserDbService;
            let authorization: string;
            authorization = headers.get(NBX_AUTH_AUTHORIZATION_HEADER);
            this.getLogger().debug('Check authentication', authorization);
            return PromiseUtils.promiseToObservable(
                dbService.getAll().then((users) => {
                    let token: T;
                    if (users && users.length) {
                        let foundUsers: IUser[];
                        foundUsers = users.filter((u: IUser) => {
                            let encryptedToken: string;
                            encryptedToken = EncryptionUtils.base64Encode(':',
                                u.username || '', u.password || '');
                            encryptedToken = [NBX_AUTH_AUTHORIZATION_BASIC_TYPE, encryptedToken].join(' ');
                            return (authorization.toLowerCase() === encryptedToken.toLowerCase());
                        });
                        if (foundUsers && foundUsers.length) {
                            let u: IUser;
                            u = foundUsers[0];
                            let tokenValue: any;
                            tokenValue = JsonUtils.parseFisrtResponseJson(JSON.stringify(u));
                            delete tokenValue['password'];
                            token = this.parseResponse(new ServiceResponse(true,
                                new HttpResponse({
                                    body: JSON.stringify(tokenValue),
                                    headers: headers,
                                    status: 200, url: url,
                                }),
                                options.redirectSuccess, options.errors, options.messages));
                        }
                    }
                    if (!token) {
                        token = this.parseResponse(new ServiceResponse(false,
                            new HttpResponse({
                                body: '', headers: headers,
                                status: 401, url: url,
                            }),
                            options.redirectFailure, options.errors, options.messages));
                    }
                    return token;

                }, (errors) => {
                    this.getLogger().error('Not found any valid token', errors);
                    return this.parseResponse(new ServiceResponse(false,
                        new HttpResponse({
                            body: '', headers: headers,
                            status: 401, url: url,
                        }),
                        options.redirectFailure, options.errors, options.messages));

                }).catch((errors) => {
                    this.getLogger().error('Not found any valid token', errors);
                    return this.parseResponse(new ServiceResponse(false,
                        new HttpResponse({
                            body: '', headers: headers,
                            status: 401, url: url,
                        }),
                        options.redirectFailure, options.errors, options.messages));
                }));
        }
        return of(undefined);
    }
}
