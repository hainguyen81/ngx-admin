import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {AbstractHttpService} from '../../../http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServiceResponse} from '../../../response.service';
import JsonUtils from '../../../../utils/json.utils';
import {AbstractBaseDbService} from '../../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {Observable, throwError} from 'rxjs';
import {IOrganization} from '../../../../@core/data/system/organization';

@Injectable()
export class OrganizationDbService extends AbstractBaseDbService<IOrganization> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.organization);
    }

    getAll(): Promise<IOrganization[]> {
        return super.getAll();
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IOrganization[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            this.getDbService().deleteRecord(this.getDbStore(), args[0]['uid'])
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error('Could not delete data', errors);
                    reject(errors);
                });
        } else resolve(0);
    }
}

@Injectable()
export class OrganizationHttpService extends AbstractHttpService<IOrganization, IOrganization> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(OrganizationDbService) dbService: OrganizationDbService) {
        super(http, logger, dbService);
        dbService || throwError('Could not inject user database service for offline mode');
    }

    parseResponse(serviceResponse?: ServiceResponse): IOrganization {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        return JsonUtils.parseResponseJson(serviceResponse.getResponse().body) as IOrganization;
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
    }): Observable<IOrganization[] | IOrganization> {
        return undefined;
    }
}
