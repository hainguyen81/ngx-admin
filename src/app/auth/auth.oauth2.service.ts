import {Inject, Injectable} from '@angular/core';
import {DB_STORE} from '../config/db.config';
import {AbstractDbService} from '../services/database.service';
import {NbAuthToken} from '@nebular/auth';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {AbstractHttpService} from '../services/http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServiceResponse} from '../services/response.service';
import {ConnectionService} from 'ng-connection-service';
import {
    NBX_AUTH_ACCESS_TOKEN_PARAM,
    NBX_AUTH_AUTHORIZATION_HEADER,
    NBX_AUTH_REFRESH_TOKEN_PARAM,
} from './auth.interceptor';
import {throwError} from 'rxjs';
import EncryptionUtils from '../utils/encryption.utils';

@Injectable()
export class NbxOAuth2AuthDbService<T extends NbAuthToken> extends AbstractDbService<T> {

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

    updateExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: T[]) => {
        if (args && args.length) {
            let updatorMap: Map<string, any>;
            updatorMap = new Map<string, any>();
            updatorMap.set(NBX_AUTH_ACCESS_TOKEN_PARAM, (args[0].getPayload() || {})[NBX_AUTH_ACCESS_TOKEN_PARAM]);
            updatorMap.set(NBX_AUTH_REFRESH_TOKEN_PARAM, (args[0].getPayload() || {})[NBX_AUTH_REFRESH_TOKEN_PARAM]);
            this.getDbService().update(this.getDbStore(),
                updatorMap, {'id': (args[0].getPayload() || {}).id})
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        }
    }
}

@Injectable()
export class NbxOAuth2AuthHttpService<T extends NbAuthToken> extends AbstractHttpService<T> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(NbxOAuth2AuthDbService) dbService: NbxOAuth2AuthDbService<T>) {
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
    }): T[] | T {
        let token: T;
        token = undefined;
        let headers: HttpHeaders;
        headers = (options && options.headers ? options.headers as HttpHeaders : undefined);
        if (headers && headers.has(NBX_AUTH_AUTHORIZATION_HEADER)) {
            let dbService: NbxOAuth2AuthDbService<T>;
            dbService = this.getDbService() as NbxOAuth2AuthDbService<T>;
            let authorization: string;
            authorization = headers.get(NBX_AUTH_AUTHORIZATION_HEADER);
            dbService.getAll().then((tokens) => {
                if (tokens.length) {
                    for (const tk of tokens) {
                        let encryptedToken: string;
                        encryptedToken = EncryptionUtils.base64Encode(':',
                            tk.getPayload()['username'] || '',
                            tk.getPayload()['password'] || '');
                        if (authorization.toLowerCase() === encryptedToken.toLowerCase()) {
                            token = tk;
                            break;
                        }
                    }
                }

            }, (errors) => {
                this.getLogger().error('Not found any valid token', errors);
            });
        }
        return token;
    }
}
