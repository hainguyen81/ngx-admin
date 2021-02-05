import {Inject, Injectable} from '@angular/core';
import {ConnectionService} from 'ng-connection-service';
import {NGXLogger} from 'ngx-logger';
import {IModel} from '../../@core/data/base';
import {ThirdPartyApiDatasource} from './third.party.api.datasource';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {AbstractBaseDbService} from '../common/database.service';
import {IApiThirdParty} from '../../@core/data/system/api.third.party';
import {Observable} from 'rxjs';
import ObjectUtils from '../../utils/common/object.utils';
import ArrayUtils from '../../utils/common/array.utils';
import AssertUtils from '@app/utils/common/assert.utils';

/**
 * The third-party API data bridge parameter interface
 */
export interface IThirdPartyApiDataBridgeParam<T extends IModel> {
    /**
     * The cached database for filtering first
     */
    dbCacheFilter?: { dbStore: string, indexName: string, criteria?: any } | undefined | null;
    /**
     * The third-party API function configuration
     */
    callApi: {
        // third-part API such as Promise/Observable/Function
        method: string,
        // third-part API arguments if it's a function
        args?: any | undefined | null,
    };
    /**
     * Fulfilled data that has received from {IThirdPartyApiBridgeConfig#callApi}
     */
    apiFulfilled?: ((apiData: T | T[]) => (T | T[]) | PromiseLike<T | T[]>) | undefined | null;
}

@Injectable()
export class ThirdPartyApiBridgeDbService<T extends IModel> extends AbstractBaseDbService<T> {

    private static EXCEPTION_PERFORMANCE_REASON: string = 'Not support for getting all data because of performance!';
    private static EXCEPTION_INVALID_API_GATEWAY: string = 'Not found the valid API function';

    protected get thirdPartyApi(): ThirdPartyApiDatasource<IApiThirdParty> {
        return this._thirdPartyApi;
    }

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService,
                @Inject(ThirdPartyApiDatasource) private _thirdPartyApi: ThirdPartyApiDatasource<IApiThirdParty>) {
        // TODO Not using database store here, because this is just a bridge data-source
        super(dbService, logger, connectionService, 'NOT_USING_STORE_BECAUSE_THIS_JUST_BRIDGE_API');
        AssertUtils.isValueNotNou(_thirdPartyApi, 'Could not inject ThirdPartyApiDatasource instance');
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: T[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            args[0].deletedAt = (new Date()).getTime();
            args[0].expiredAt = (new Date()).getTime();
            this.updateExecutor.apply(this, [resolve, reject, ...args]);
        } else resolve(0);
    };

    /**
     * TODO Not support for getting all data because of performance
     */
    getAll(): Promise<T[]> {
        throw new Error(ThirdPartyApiBridgeDbService.EXCEPTION_PERFORMANCE_REASON);
    }

    /**
     * Find API data by the specified parameter
     * @param param to filter
     */
    fetch(param: IThirdPartyApiDataBridgeParam<T>): Promise<any> {
        // check valid parameter
        const thirdPartyApiAny: any = ObjectUtils.as<any>(this.thirdPartyApi);
        AssertUtils.isValueNotNou((param || {}).dbCacheFilter, ThirdPartyApiBridgeDbService.EXCEPTION_PERFORMANCE_REASON);
        AssertUtils.isTrueValue(
            (param.callApi && (param.callApi.method || '').length > 0
                && (typeof thirdPartyApiAny[param.callApi.method] === 'function'
                    || thirdPartyApiAny[param.callApi.method] instanceof Promise
                    || thirdPartyApiAny[param.callApi.method] instanceof Observable)),
            ThirdPartyApiBridgeDbService.EXCEPTION_INVALID_API_GATEWAY);
        return this.getDbService().getAllByIndex(
            param.dbCacheFilter.dbStore, param.dbCacheFilter.indexName, param.dbCacheFilter.criteria)
            .then((value: any) => {
                // if not found data from database storage;
                // then calling third-party API to fetch data
                if (!value || (ArrayUtils.isArray(value) && !(value || []).length)) {
                    // require third-part entry point
                    const apiGatewayEntry: any = thirdPartyApiAny[param.callApi.method];
                    let apiGatewayEntryPromise: Promise<any>;
                    if (!(apiGatewayEntry instanceof Promise) && !(apiGatewayEntry instanceof Observable)) {
                        apiGatewayEntryPromise = new Promise(
                            resolve => resolve(
                                apiGatewayEntry['apply'](this._thirdPartyApi, param.callApi.args)));

                    } else if (apiGatewayEntry instanceof Promise) {
                        apiGatewayEntryPromise = (<Promise<any>>apiGatewayEntry);

                    } else {
                        apiGatewayEntryPromise = (<Observable<any>>apiGatewayEntry).toPromise();
                    }

                    // invoke third-part API entry point
                    return apiGatewayEntryPromise.then(
                        param.apiFulfilled, reason => {
                            this.getLogger().error(reason);
                            return [];
                        }).catch(reason => {
                            this.getLogger().error(reason);
                            return [];
                        });
                }

                return (value && !ArrayUtils.isArray(value) ? Array.of(value) : value ? Array.from(value) : value);
            }, reason => {
                this.getLogger().error(reason);
                return [];
            }).catch(reason => {
                this.getLogger().error(reason);
                return [];
            });
    }
}
