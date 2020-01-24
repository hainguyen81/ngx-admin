import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {IUser, USER_STATUS} from '../../../@core/data/user';
import {AbstractHttpService} from '../../http.service';
import {HttpClient} from '@angular/common/http';
import {ServiceResponse} from '../../response.service';
import JsonUtils from '../../../utils/json.utils';
import {isArray} from 'util';
import {AbstractDbService} from '../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../config/db.config';
import {environment} from '../../../../environments/environment';
import {MockUserService} from '../../../@core/mock/users.service';
import {ConnectionService} from 'ng-connection-service';

@Injectable()
export class UserHttpService extends AbstractHttpService<IUser> {

    constructor(@Inject(HttpClient) http: HttpClient, @Inject(NGXLogger) logger: NGXLogger) {
        super(http, logger);
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
}

@Injectable()
export class UserDbService extends AbstractDbService<IUser> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService,
                @Inject(MockUserService) private mockUserService: MockUserService) {
        super(dbService, logger, connectionService, DB_STORE.user);
    }

    getAll(): Promise<IUser[]> {
        if (environment.production) {
            return super.getAll();
        }
        return this.mockUserService.getUsers().toPromise();
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IUser[]) => {
        if (args && args.length) {
            if (environment.production) {
                args[0].status = USER_STATUS.LOCKED;
                this.getDbService().delete({'status': USER_STATUS.LOCKED})
                    .then(() => resolve(1), (errors) => {
                        this.getLogger().error(errors);
                        reject(errors);
                    });
            } else {
                const user: IUser = this.mockUserService.findUser('id', args[0].id);
                user.status = USER_STATUS.LOCKED;
                resolve(1);
            }
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

            if (environment.production) {
                this.getDbService().update(updatorMap.entries(), {'id': args[0].id})
                    .then(() => resolve(1), (errors) => {
                        this.getLogger().error(errors);
                        reject(errors);
                    });
            } else {
                const user: IUser = this.mockUserService.findUser('id', args[0].id);
                updatorMap.forEach((value: any, key: string) => {
                    user[key] = value;
                });
                resolve(1);
            }
        }
    }
}
