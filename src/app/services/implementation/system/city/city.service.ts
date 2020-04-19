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
import {ICountry} from '../../../../@core/data/system/country';
import {ThirdPartyApiDatasource} from '../../../third.party/third.party.api.datasource';
import {IApiThirdParty} from '../../../../@core/data/system/api.third.party';
import {THIRD_PARTY_API} from '../../../../config/third.party.api';

@Injectable()
export class CityDbService extends AbstractBaseDbService<ICity> {

    private static EXCEPTION_PERFORMANCE_REASON = 'Not support for getting all countries because of performance!';
    private static INDEX_NAME_COUNTRY_ID = 'country_id';
    private static THIRD_PARTY_CITY_URL = THIRD_PARTY_API.universal.api.city.url;
    private static THIRD_PARTY_CITY_METHOD = THIRD_PARTY_API.universal.api.city.method;

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService,
                @Inject(ThirdPartyApiDatasource) private thirdPartyApi: ThirdPartyApiDatasource<IApiThirdParty>) {
        super(dbService, logger, connectionService, DB_STORE.city);
        thirdPartyApi || throwError('Could not inject ThirdPartyApiDatasource instance');
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: ICity[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            args[0].deletedAt = (new Date()).getUTCDate();
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
     * Find all cities by the specified {ICountry}
     * @param country to filter
     */
    findByCountry(country?: ICountry | null): Promise<ICity | ICity[]> {
        country || throwError(CityDbService.EXCEPTION_PERFORMANCE_REASON);
        return this.findEntities(CityDbService.INDEX_NAME_COUNTRY_ID, country.id)
            .then(value => {
                if (!(value || []).length) {
                    const url: string = [
                        CityDbService.THIRD_PARTY_CITY_URL,
                        country.name,
                    ].join('/');
                    return this.thirdPartyApi.findData(url, CityDbService.THIRD_PARTY_CITY_METHOD, City)
                        .then((data: IApiThirdParty | IApiThirdParty[] | City | City[]) => {
                            // apply country for city API data
                            let cities: ICity[];
                            cities = data as ICity[];
                            cities = cities.removeIf(city => !city);
                            cities.forEach(city => {
                                city.country_id = country.id;
                            });

                            // insert application database for future
                            return this.insertEntities(cities)
                                .then(affected => cities, reason => {
                                    this.getLogger().error(reason);
                                    return [];
                                }).catch(reason => {
                                    this.getLogger().error(reason);
                                    return [];
                                });

                        }, reason => {
                            this.getLogger().error(reason);
                            return [];
                        }).catch(reason => {
                            this.getLogger().error(reason);
                            return [];
                        });
                }
            });
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
