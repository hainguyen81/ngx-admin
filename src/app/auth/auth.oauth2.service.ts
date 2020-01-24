import {Inject, Injectable} from '@angular/core';
import {DB_STORE} from '../config/db.config';
import {AbstractDbService} from '../services/database.service';
import {Observable, of} from 'rxjs';
import {NbAuthResult, NbAuthToken} from '@nebular/auth';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {AbstractHttpService} from '../services/http.service';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ServiceResponse} from '../services/response.service';
import {environment} from '../../environments/environment';
import {MockUserService} from '../@core/mock/users.service';
import {IUser} from '../@core/data/user';
import {ConnectionService} from 'ng-connection-service';

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
    }): Observable<NbAuthResult | NbAuthResult[]> {
        if (environment.production) {
            return super.request(url, method, options);
        }

        let user: IUser;
        user = this.mockUserService.findUser('username', 'admin@hsg.com');
        if (!user) {
            return of(this.parseResponse(new ServiceResponse(false, null,
                options.redirectFailure, options.errors, options.messages)));
        }
        return of(this.parseResponse(new ServiceResponse(true,
            new HttpResponse<any>({body: JSON.stringify(user), status: 200, statusText: 'MOCK'}),
            options.redirectSuccess, options.errors, options.messages)));
    }

    parseResponse(serviceResponse?: ServiceResponse): NbAuthResult {
        if (!serviceResponse) {
            return new NbAuthResult(false);
        }
        return new NbAuthResult(serviceResponse.isSuccess(), serviceResponse.getData(),
            serviceResponse.getRedirect(), serviceResponse.getErrors(), serviceResponse.getMessages(),
            this.createTokenDelegate.apply(this, [serviceResponse.getData()]));
    }
}

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
            this.getDbService().delete({'username': (args[0].getPayload() || {}).username})
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error(errors);
                    reject(errors);
                });
        }
    }

    updateExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: T[]) => {
        if (args && args.length) {
            this.getDbService().update({
                'access_token': (args[0].getPayload() || {})['access_token'],
                'refresh_token': (args[0].getPayload() || {})['refresh_token'],
            }).then(() => resolve(1), (errors) => {
                this.getLogger().error(errors);
                reject(errors);
            });
        }
    }
}
