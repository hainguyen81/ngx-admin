import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import Province, {IProvince} from '../../../../@core/data/system/province';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {throwError} from 'rxjs';
import {ICountry} from '../../../../@core/data/system/country';
import {THIRD_PARTY_API} from '../../../../config/third.party.api';
import {
    IThirdPartyApiDataBridgeParam,
    ThirdPartyApiBridgeDbService,
} from '../../../third.party/third.party.api.bridge.service';
import {isArray, isNullOrUndefined} from 'util';

@Injectable()
export class ProvinceDbService extends BaseDbService<IProvince> {

    private static EXCEPTION_PERFORMANCE_REASON: string = 'Not support for getting all provinces because of performance!';
    private static INDEX_NAME_COUNTRY_ID: string = 'country_id';
    private static THIRD_PARTY_STATE_URL: string = THIRD_PARTY_API.universal.api.province.url.call(undefined);
    private static THIRD_PARTY_STATE_METHOD: string = THIRD_PARTY_API.universal.api.province.method;
    private static THIRD_PARTY_ENTRY_METHOD: string = 'findData';

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService,
                @Inject(ThirdPartyApiBridgeDbService)
                private thirdPartyApiBridge: ThirdPartyApiBridgeDbService<IProvince>) {
        super(dbService, logger, connectionService, DB_STORE.province);
        thirdPartyApiBridge || throwError('Could not inject ThirdPartyApiBridgeDbService instance');
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
        const fetchParam: IThirdPartyApiDataBridgeParam<IProvince> = {
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
                // apply country for province API data
                let provinces: IProvince[];
                const duplicatedCode: any = {};
                provinces = (isArray(apiData) ? apiData as IProvince[] : apiData ? [apiData as IProvince] : []);
                provinces = provinces.removeIf(province => isNullOrUndefined(province));
                provinces.forEach(province => {
                    province.country_id = country.id;

                    // check for duplicated code because API data has no returned code
                    let provinceCode: string = country.code.concat('|', province.code);
                    if (duplicatedCode.hasOwnProperty(provinceCode)) {
                        duplicatedCode[provinceCode] = (duplicatedCode[provinceCode] as number) + 1;
                        provinceCode = provinceCode.concat('|',
                            (duplicatedCode[provinceCode] as number).toString());
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
        return _this.thirdPartyApiBridge.fetch(fetchParam);
    }
}

@Injectable()
export class ProvinceHttpService extends BaseHttpService<IProvince> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ProvinceDbService) dbService: ProvinceDbService) {
        super(http, logger, dbService);
    }
}
