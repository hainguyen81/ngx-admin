import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import City, {ICity} from '../../../../@core/data/system/city';
import {AbstractHttpService} from '../../../http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServiceResponse} from '../../../response.service';
import JsonUtils from '../../../../utils/json.utils';
import {AbstractBaseDbService} from '../../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {Observable, throwError} from 'rxjs';
import {THIRD_PARTY_API} from '../../../../config/third.party.api';
import {IProvince} from '../../../../@core/data/system/province';
import {
    IThirdPartyApiDataBridgeParam,
    ThirdPartyApiBridgeDbService,
} from '../../../third.party/third.party.api.bridge.service';
import {isArray, isNullOrUndefined} from 'util';

@Injectable()
export class CityDbService extends AbstractBaseDbService<ICity> {

    private static EXCEPTION_PERFORMANCE_REASON: string = 'Not support for getting all cities because of performance!';
    private static INDEX_NAME_PROVINCE_ID: string = 'province_id';
    private static THIRD_PARTY_CITY_URL: string = THIRD_PARTY_API.universal.api.city.url.call(undefined);
    private static THIRD_PARTY_CITY_METHOD: string = THIRD_PARTY_API.universal.api.city.method;
    private static THIRD_PARTY_ENTRY_METHOD: string = 'findData';

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService,
                @Inject(ThirdPartyApiBridgeDbService)
                private thirdPartyApiBridge: ThirdPartyApiBridgeDbService<ICity>) {
        super(dbService, logger, connectionService, DB_STORE.city);
        thirdPartyApiBridge || throwError('Could not inject ThirdPartyApiBridgeDbService instance');
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: ICity[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            args[0].deletedAt = (new Date()).getTime();
            this.updateExecutor.apply(this, [resolve, reject, ...args]);
        } else resolve(0);
    }

    /**
     * TODO Not support for getting all coutries because of performance
     */
    getAll(): Promise<ICity[]> {
        throwError(CityDbService.EXCEPTION_PERFORMANCE_REASON);
        return Promise.reject(CityDbService.EXCEPTION_PERFORMANCE_REASON);
    }

    /**
     * Find all cities by the specified {IProvince}
     * @param province to filter
     */
    findByProvince(province?: IProvince | null): Promise<ICity | ICity[]> {
        province || throwError(CityDbService.EXCEPTION_PERFORMANCE_REASON);
        const _this: CityDbService = this;
        const fetchParam: IThirdPartyApiDataBridgeParam<ICity> = {
            dbCacheFilter: {
                dbStore: this.getDbStore(),
                indexName: CityDbService.INDEX_NAME_PROVINCE_ID,
                criteria: province.id,
            },
            callApi: {
                method: CityDbService.THIRD_PARTY_ENTRY_METHOD,
                args: [
                    CityDbService.THIRD_PARTY_CITY_URL.concat('/', province.name),
                    CityDbService.THIRD_PARTY_CITY_METHOD,
                    City,
                ],
            },
            apiFulfilled: apiData => {
                // apply province for city API data
                let cities: ICity[];
                const duplicatedCode: any = {};
                cities = (isArray(apiData) ? apiData as ICity[] : apiData ? [apiData as ICity] : []);
                cities = cities.removeIf(city => isNullOrUndefined(city));
                cities.forEach(city => {
                    city.province_id = province.id;

                    // check for duplicated code because API data has no returned code
                    let cityCode: string = province.code.concat('|', city.code);
                    if (duplicatedCode.hasOwnProperty(cityCode)) {
                        duplicatedCode[cityCode] = (duplicatedCode[cityCode] as number) + 1;
                        cityCode = cityCode.concat('|',
                            (duplicatedCode[cityCode] as number).toString());
                    } else {
                        duplicatedCode[cityCode] = 1;
                    }
                    city.code = cityCode;
                });

                // insert application database for future
                return _this.insertEntities(cities)
                    .then(affected => cities, reason => {
                        _this.getLogger().error(reason);
                        return [];
                    }).catch(reason => {
                        _this.getLogger().error(reason);
                        return [];
                    });
            },
        };
        return _this.thirdPartyApiBridge.fetch(fetchParam);
    }
}

@Injectable()
export class CityHttpService extends AbstractHttpService<ICity, ICity> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(CityDbService) dbService: CityDbService) {
        super(http, logger, dbService);
        dbService || throwError('Could not inject user database service for offline mode');
    }

    parseResponse(serviceResponse?: ServiceResponse): ICity {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        return JsonUtils.parseResponseJson(serviceResponse.getResponse().body) as ICity;
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
    }): Observable<ICity[] | ICity> {
        return undefined;
    }
}
