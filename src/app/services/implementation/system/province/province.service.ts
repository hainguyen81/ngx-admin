import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import Province, {IProvince} from '../../../../@core/data/system/province';
import {AbstractHttpService} from '../../../http.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServiceResponse} from '../../../response.service';
import JsonUtils from '../../../../utils/json.utils';
import {AbstractBaseDbService} from '../../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {Observable, throwError} from 'rxjs';
import {ICountry} from '../../../../@core/data/system/country';
import {THIRD_PARTY_API} from '../../../../config/third.party.api';
import {
    IThirdPartyApiDataBridgeParam,
    ThirdPartyApiBridgeDbService,
} from '../../../third.party/third.party.api.bridge.service';
import {isArray, isNullOrUndefined} from 'util';

@Injectable()
export class ProvinceDbService extends AbstractBaseDbService<IProvince> {

    private static EXCEPTION_PERFORMANCE_REASON = 'Not support for getting all provinces because of performance!';
    private static INDEX_NAME_COUNTRY_ID = 'country_id';
    private static THIRD_PARTY_STATE_URL = THIRD_PARTY_API.universal.api.province.url;
    private static THIRD_PARTY_STATE_METHOD = THIRD_PARTY_API.universal.api.province.method;
    private static THIRD_PARTY_ENTRY_METHOD = 'findData';

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService,
                @Inject(ThirdPartyApiBridgeDbService)
                private thirdPartyApiBridge: ThirdPartyApiBridgeDbService<IProvince>) {
        super(dbService, logger, connectionService, DB_STORE.province);
        thirdPartyApiBridge || throwError('Could not inject ThirdPartyApiBridgeDbService instance');
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IProvince[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            args[0].deletedAt = (new Date()).getTime();
            this.updateExecutor.apply(this, [resolve, reject, ...args]);
        } else resolve(0);
    }

    /**
     * TODO Not support for getting all provinces because of performance
     */
    getAll(): Promise<IProvince[]> {
        throwError(ProvinceDbService.EXCEPTION_PERFORMANCE_REASON);
        return Promise.reject(ProvinceDbService.EXCEPTION_PERFORMANCE_REASON);
    }

    /**
     * Find all states/provinces by the specified {ICountry}
     * @param country to filter
     */
    findByCountry(country?: ICountry | null): Promise<IProvince | IProvince[]> {
        country || throwError(ProvinceDbService.EXCEPTION_PERFORMANCE_REASON);
        const _this: ProvinceDbService = this;
        const fecthParam: IThirdPartyApiDataBridgeParam<IProvince> = {
            dbCacheFilter: {
                dbStore: this.getDbStore(),
                indexName: ProvinceDbService.INDEX_NAME_COUNTRY_ID,
                criteria: country.id,
            },
            callApi: {
                method: ProvinceDbService.THIRD_PARTY_ENTRY_METHOD,
                args: [
                    ProvinceDbService.THIRD_PARTY_STATE_URL.concat('/', country.name),
                    ProvinceDbService.THIRD_PARTY_STATE_METHOD,
                    Province,
                ],
            },
            apiFulfilled: apiData => {
                // apply country for city API data
                let provinces: IProvince[];
                const duplicatedCode: any = {};
                provinces = (isArray(apiData) ? apiData as IProvince[] : apiData ? [apiData as IProvince] : []);
                provinces = provinces.removeIf(province => isNullOrUndefined(province));
                provinces.forEach(province => {
                    province.country_id = country.id;

                    // check for duplicated code because API data has no returned code
                    let provinceCode: string = country.code.concat('|', province.code);
                    if (duplicatedCode.hasOwnProperty(provinceCode)) {
                        provinceCode = provinceCode.concat('|',
                            (duplicatedCode[provinceCode] as number).toString());
                        duplicatedCode[provinceCode] = (duplicatedCode[provinceCode] as number) + 1;
                    } else {
                        duplicatedCode[provinceCode] = 1;
                    }
                    province.code = provinceCode;
                });

                // insert application database for future
                return _this.insertEntities(provinces)
                    .then(affected => provinces, reason => {
                        _this.getLogger().error(reason);
                        return [];
                    }).catch(reason => {
                        _this.getLogger().error(reason);
                        return [];
                    });
            },
        };
        return _this.thirdPartyApiBridge.fetch(fecthParam);
    }
}

@Injectable()
export class ProvinceHttpService extends AbstractHttpService<IProvince, IProvince> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ProvinceDbService) dbService: ProvinceDbService) {
        super(http, logger, dbService);
    }

    parseResponse(serviceResponse?: ServiceResponse): IProvince {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        return JsonUtils.parseResponseJson(serviceResponse.getResponse().body) as IProvince;
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
    }): Observable<IProvince[] | IProvince> {
        return undefined;
    }
}
