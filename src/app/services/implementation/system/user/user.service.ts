import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {IUser, USER_STATUS} from '../../../../@core/data/system/user';
import {AbstractHttpService} from '../../../http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServiceResponse} from '../../../response.service';
import JsonUtils from '../../../../utils/json.utils';
import {AbstractBaseDbService} from '../../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {Observable, throwError} from 'rxjs';

@Injectable()
export class UserDbService extends AbstractBaseDbService<IUser> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.user);
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IUser[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            // if existed user
            if ((args[0].id || '').length) {
                args[0].status = USER_STATUS.LOCKED;
                this.updateExecutor.apply(this, [resolve, reject, ...args]);

                // if new user (invalid user identity)
            } else {
                this.getDbService().deleteRecord(this.getDbStore(), args[0]['uid'])
                    .then(() => resolve(1), (errors) => {
                        this.getLogger().error('Could not delete data', errors);
                        reject(errors);
                    });
            }
        } else resolve(0);
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

    parseResponse(serviceResponse?: ServiceResponse): IUser {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        return JsonUtils.parseResponseJson(serviceResponse.getResponse().body) as IUser;
    }

    handleOfflineMode(url: string, method?: string, res?: any, options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[]; };
        observe?: 'body' | 'events' | 'response' | any;
        params?: HttpParams | { [param: string]: string | string[]; };
        reportProgress?: boolean;
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | any;
        withCredentials?: boolean;
        redirectSuccess?: any;
        redirectFailure?: any;
        errors?: any;
        messages?: any;
    }): Observable<IUser[] | IUser> {
        return undefined;
    }
}
