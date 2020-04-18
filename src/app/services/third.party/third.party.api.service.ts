import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {AbstractHttpService} from '../http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServiceResponse} from '../response.service';
import JsonUtils from '../../utils/json.utils';
import {AbstractBaseDbService} from '../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {Observable, throwError} from 'rxjs';
import {IApiThirdParty} from '../../@core/data/system/api.third.party';

/**
 * Expired exception of third-party API
 */
export class ThirdPartyApiExpiredException extends Error {

    constructor(private _code: string, private _cause: Error) {
        super();
    }

    get code() {
        return this._code;
    }

    get cause() {
        return this._cause;
    }
}

@Injectable()
export abstract class ThirdPartyApiDbService<T extends IApiThirdParty> extends AbstractBaseDbService<T> {

    protected constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.third_party);
    }

    getAll(): Promise<T[]> {
        return super.getAll()
            .then(value => {
                this._ensureNonExpiredData(...value);
                return value;
            }, (reason) => {
                this.getLogger().error(reason);
                return [];
            });
    }

    findEntities(indexName: string, criteria?: any): Promise<T[]> {
        return super.findEntities(indexName, criteria)
            .then((value: T[]) => {
                this._ensureNonExpiredData(...value);
                return value;
            }, reason => {
                this.getLogger().error(reason);
                return [];
            });
    }

    findById(id?: any): Promise<T> {
        return super.findById(id)
            .then((value: T) => {
                this._ensureNonExpiredData(value);
                return value;
            }, reason => {
                this.getLogger().error(reason);
                return null;
            });
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: T[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            args[0].deletedAt = (new Date()).getUTCDate();
            args[0].expiredAt = (new Date()).getUTCDate();
            this.updateExecutor.apply(this, [resolve, reject, ...args]);
        } else resolve(0);
    }

    /**
     * Check valid non-expired data.
     * If at least one data has expired, then {ThirdPartyApiExpiredException} will be thrown
     * @param entities to check
     * @private
     */
    private _ensureNonExpiredData(...entities: T[]): void {
        const currentDate: Date = new Date();
        (entities || []).forEach((entity: T) => {
            if (entity && (entity.expiredAt !== 0 && new Date(entity.expiredAt) >= currentDate)) {
                throwError(new ThirdPartyApiExpiredException(
                    entity.code, new Error('Third party data has been expired!')));
            }
        });
    }
}

@Injectable()
export abstract class ThirdPartyApiHttpService<T extends IApiThirdParty>
    extends AbstractHttpService<T, T> {

    protected constructor(@Inject(HttpClient) http: HttpClient,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(ThirdPartyApiDbService) dbService: ThirdPartyApiDbService<T>) {
        super(http, logger, dbService);
        dbService || throwError('Could not inject user database service for offline mode');
    }

    parseResponse(serviceResponse?: ServiceResponse): T {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        return JsonUtils.parseResponseJson(serviceResponse.getResponse().body) as T;
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
        return undefined;
    }
}
