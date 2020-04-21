import {Inject, Injectable, InjectionToken, Type} from '@angular/core';
import {BaseDataSource} from '../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IApiThirdParty} from '../../@core/data/system/api.third.party';
import {ThirdPartyApiDbService, ThirdPartyApiHttpService} from './third.party.api.service';
import {throwError} from 'rxjs';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {isArray} from 'util';
import {IModel} from '../../@core/data/base';
import {ThirdPartyApiDataParserDefinition} from './data.parsers/third.party.data.parser';

/**
 * Third-party API data parser interface
 */
export interface IThirdPartyApiDataParser<T extends IApiThirdParty, K extends IModel> {
    parse(data: T): K | K[];
}

/**
 * Third-party API data parsers definition interface
 */
export interface IThirdPartyApiDataParserDefinition<T extends IApiThirdParty> {
    parsers: { provide: Type<any>, parser: IThirdPartyApiDataParser<T, any> }[];
}

export const THIRDPARTY_API_DATA_PARSER_DEFINITION: InjectionToken<IThirdPartyApiDataParserDefinition<any>>
    = new InjectionToken<IThirdPartyApiDataParserDefinition<any>>('Third-party API data parsers definition');

@Injectable()
export abstract class ThirdPartyApiDatasource<T extends IApiThirdParty>
    extends BaseDataSource<T, ThirdPartyApiHttpService<T>, ThirdPartyApiDbService<T>> {

    private static EXCEPTION_NOT_SUPPORTED: string =
        'Not support for getting all data because third-party manage data by URL, method and code!';
    private static INDEX_NAME_THIRD_PARTY_CODE = 'code';

    /**
     * Get the third-party API data parser definition injection instance
     * @return the third-party API data parser definition injection instance
     */
    protected dataParser(): IThirdPartyApiDataParserDefinition<T> {
        return this._dataParser || new ThirdPartyApiDataParserDefinition([]);
    }

    constructor(@Inject(ThirdPartyApiHttpService) httpService: ThirdPartyApiHttpService<T>,
                @Inject(ThirdPartyApiDbService) dbService: ThirdPartyApiDbService<T>,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(THIRDPARTY_API_DATA_PARSER_DEFINITION)
                private _dataParser: IThirdPartyApiDataParserDefinition<T>) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<T | T[]> {
        throwError(ThirdPartyApiDatasource.EXCEPTION_NOT_SUPPORTED);
        return Promise.reject(ThirdPartyApiDatasource.EXCEPTION_NOT_SUPPORTED);
    }

    /**
     * Find data from third-party API
     * @param <K> application data to parse. it must exist in data parser injection
     * @param url to call API
     * @param method request method
     * @param dataParserType to detect parser injection to parse API data
     * @param options request options if not found from database offline
     */
    findData<K>(
        url: string, method?: string,
        dataParserType?: Type<K>,
        options?: {
            body?: any;
            headers?: HttpHeaders | { [header: string]: string | string[]; };
            observe?: 'body' | 'events' | 'response' | any;
            params?: HttpParams | { [param: string]: string | string[]; };
            reportProgress?: boolean;
            responseType: 'arraybuffer' | 'blob' | 'json' | 'text' | any;
            withCredentials?: boolean;
            redirectSuccess?: any;
            redirectFailure?: any;
            errors?: any;
            messages?: any;
        }): Promise<K | K[]> {
        (url || '').length || throwError(ThirdPartyApiDatasource.EXCEPTION_NOT_SUPPORTED);
        const criteria: string = [
            this.getHttpService().config.code,
            (method || 'UNKNOWN'),
            url,
        ].join('|');
        return this.getDbService().findEntities(ThirdPartyApiDatasource.INDEX_NAME_THIRD_PARTY_CODE, criteria)
            .then(value => {
                if (!(value || []).length) {
                    return this.getHttpService().request(url, method, options).toPromise()
                        .then((data: T[]) => {
                            // catch for future from offline database
                            if (!isArray(data)) {
                                data = [].concat(data);
                            }

                            return this.getDbService().insertEntities(data)
                                .then(affected => {
                                    let parsedData: K[];
                                    parsedData = [];
                                    if (dataParserType && this.dataParser() && this.dataParser().parsers) {
                                        let parser: IThirdPartyApiDataParser<T, any>;
                                        parser = this.getDataParser(dataParserType);
                                        if (parser) {
                                            (data || []).forEach(dat => {
                                                const parsed: K | K[] = parser.parse(dat);
                                                if (parsed && isArray(parsed)) {
                                                    parsedData = parsedData.concat(parsed as K[]);
                                                } else if (parsed) {
                                                    parsedData.push(parsed as K);
                                                }
                                            });
                                        }
                                    }

                                    data = this.filter(data);
                                    data = this.sort(data);
                                    this.setRecordsNumber((data || []).length);
                                    data = this.paginate(data);
                                    return parsedData as K[];

                                }, reason => {
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
                return value;

            }, reason => {
                this.getLogger().error(reason);
                return [];
            }).catch(reason => {
                this.getLogger().error(reason);
                return [];
            });
    }

    private getDataParser<K>(dataParserType?: Type<K>): IThirdPartyApiDataParser<T, any> {
        let parser: IThirdPartyApiDataParser<T, any>;
        parser = null;
        if (this.dataParser().parsers && dataParserType) {
            for (const dataParserDef of this.dataParser().parsers) {
                if (dataParserDef && dataParserDef.provide === dataParserType) {
                    parser = dataParserDef.parser;
                    break;
                }
            }
        }
        return parser;
    }
}
