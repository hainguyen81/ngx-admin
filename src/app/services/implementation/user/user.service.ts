import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {IUser, USER_STATUS} from '../../../@core/data/user';
import {AbstractHttpService} from '../../http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServiceResponse} from '../../response.service';
import JsonUtils from '../../../utils/json.utils';
import {isArray} from 'util';
import {AbstractDbService} from '../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {Observable, throwError} from 'rxjs';

@Injectable()
export class UserDbService extends AbstractDbService<IUser> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.user);
    }

    getAll(): Promise<IUser[]> {
        return super.getAll();
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IUser[]) => {
        if (args && args.length) {
            args[0].status = USER_STATUS.LOCKED;
            this.getDbService().delete(this.getDbStore(), {'status': USER_STATUS.LOCKED})
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        }
    }

    updateExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IUser[]) => {
        if (args && args.length) {
            let updatorMap: Map<string, any>;
            const exclKeys: string[] = [
                'access_token', 'token_type', 'refresh_token',
                'expires_in', 'scope', 'company', 'rolesGroupId',
                'rolesGroup', 'enterprise', 'id'];
            updatorMap = new Map<string, any>(Object.entries(args[0]));
            exclKeys.forEach(key => updatorMap.delete(key));
            this.getDbService().update(this.getDbStore(),
                updatorMap.entries(), {'id': args[0].id})
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        }
    }
}

@Injectable()
export class UserHttpService extends AbstractHttpService<IUser, IUser> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(UserDbService) dbService: UserDbService) {
        super(http, logger, dbService);
        dbService || throwError('Could not inject user database service for offline mode');
    }

    parseResponse(serviceResponse?: ServiceResponse): IUser | IUser[] {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        const jsonResponse = JsonUtils.parseResponseJson(serviceResponse.getResponse().body);
        let users: IUser[];
        if (!isArray(jsonResponse)) {
            users.push(jsonResponse);
        } else {
            users = jsonResponse as IUser[];
        }
        return users;
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
    }): Observable<IUser[] | IUser> {
        return undefined;
    }
}
