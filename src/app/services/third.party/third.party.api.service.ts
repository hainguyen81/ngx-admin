import {Inject, Injectable, InjectionToken} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {AbstractHttpService} from '../http.service';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ServiceResponse} from '../response.service';
import JsonUtils from '../../utils/json.utils';
import {AbstractBaseDbService} from '../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {Observable, throwError} from 'rxjs';
import {IApiThirdParty} from '../../@core/data/system/api.third.party';
import ObjectUtils from '../../utils/object.utils';
import {catchError, flatMap, map} from 'rxjs/operators';
import {RC_THIRD_PARTY_CUSTOM_TYPE} from '../../config/request.config';
import {Cacheable} from 'ngx-cacheable';

/**
 * The third-party API authorization configuration interface
 */
export interface IThirdPartyApiConfig {
    /**
     * Third-party code to manage (required)
     */
    code: string;
    /**
     * Third-party base URL for proxy if necessary
     */
    baseUrl?: string | null;
    /**
     * Request access token in expired/un-authorized case
     */
    token: {
        tokenUrl: string,
        method?: 'POST' | 'GET' | 'PUT' | 'PATCH',
        /**
         * The time (in milliseconds) that token/data has been expired.
         * 0 for un-expired
         */
        expiredIn?: number | 0,
    };
    /**
     * Parameter for sending to require access/authorization token
     */
    tokenParam: {
        type: 'header' | 'body' | 'param' | 'custom',
        values: HttpHeaders | { [header: string]: string | string[]; }
            | HttpParams | { [param: string]: string | string[]; } | any,
        observe?: 'body' | 'events' | 'response' | any,
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | any,
    };
}

/**
 * Default third-party API authentication configuration
 */
export default class ThirdPartyApiConfig implements IThirdPartyApiConfig {
    constructor(public code: string,
                public token: {
                    tokenUrl: string,
                    method?: 'POST' | 'GET' | 'PUT' | 'PATCH',
                    expiredIn?: number | 0,
                },
                public tokenParam: {
                    type: 'header' | 'body' | 'param' | 'custom',
                    values: HttpHeaders | { [header: string]: string | string[]; }
                        | HttpParams | { [param: string]: string | string[]; } | any,
                    observe?: 'body' | 'events' | 'response' | any,
                    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | any,
                },
                public method?: 'POST' | 'GET' | 'PUT' | 'PATCH') {
    }
}

export const THIRDPARTY_AUTHORIZATION_API_CONFIG: InjectionToken<IThirdPartyApiConfig>
    = new InjectionToken<IThirdPartyApiConfig>(
    'Third-party API authorization token configuration');

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
                (value || []).length && this._ensureNonExpiredData(...value);
                return value;
            }, (reason) => {
                this.getLogger().error(reason);
                return [];
            });
    }

    findEntities(indexName: string, criteria?: any): Promise<T[]> {
        return super.findEntities(indexName, criteria)
            .then((value: T[]) => {
                (value || []).length && this._ensureNonExpiredData(...value);
                return value;
            }, reason => {
                this.getLogger().error(reason);
                return [];
            });
    }

    findById(id?: any): Promise<T> {
        return super.findById(id)
            .then((value: T) => {
                value && this._ensureNonExpiredData(value);
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
            args[0].deletedAt = (new Date()).getTime();
            args[0].expiredAt = (new Date()).getTime();
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

    protected static THIRD_PARTY_LATEST_ACCESS_TOKEN: string = 'XThirdPartyToken';

    get config(): IThirdPartyApiConfig {
        return this.apiConfig;
    }

    get latestToken(): any {
        return this.config[ThirdPartyApiHttpService.THIRD_PARTY_LATEST_ACCESS_TOKEN];
    }

    protected constructor(@Inject(HttpClient) http: HttpClient,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(ThirdPartyApiDbService) dbService: ThirdPartyApiDbService<T>,
                          @Inject(THIRDPARTY_AUTHORIZATION_API_CONFIG)
                          private apiConfig: IThirdPartyApiConfig) {
        super(http, logger, dbService);
        apiConfig || throwError('Could not inject third-party API configuration');
        ((apiConfig.code || '').length && apiConfig.token)
        || throwError('Third-party API configuration code must be not undefined');
    }

    parseResponse(serviceResponse?: ServiceResponse): T {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        const data: T = JsonUtils.parseResponseJson(serviceResponse.getResponse().body) as T;
        data.code = this.config.code
            .concat('|', this.apiConfig.token.method || 'UNKNOWN', '|', serviceResponse.getResponse().url);
        if (Math.max(this.config.token.expiredIn, 0) > 0) {
            data.expiredAt = (new Date()).getTime() + this.config.token.expiredIn;
        }
        return data;
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
    }): Observable<T[] | T> {
        return undefined;
    }

    protected configHeaders(
        defaultValue?: HttpHeaders | { [header: string]: string | string[]; } | null):
        HttpHeaders | { [header: string]: string | string[]; } {
        return (this.config.tokenParam && this.config.tokenParam.type === 'header'
            ? <HttpHeaders | { [header: string]: string | string[]; }>
                this.config.tokenParam.values : defaultValue);
    }

    protected configParams(
        defaultValue?: HttpParams | { [param: string]: string | string[]; } | null):
        HttpParams | { [param: string]: string | string[]; } {
        return (this.config.tokenParam && this.config.tokenParam.type === 'param'
            ? <HttpParams | { [param: string]: string | string[]; }>
                this.config.tokenParam.values : defaultValue);
    }

    protected configBody(defaultValue?: any | null): any {
        return (this.config.tokenParam && this.config.tokenParam.type === 'body'
            ? this.config.tokenParam.values : defaultValue);
    }

    protected configResponseType(
        defaultValue?: 'arraybuffer' | 'blob' | 'json' | 'text' | any): 'arraybuffer' | 'blob' | 'json' | 'text' | any {
        return (this.config.tokenParam ? this.config.tokenParam.responseType : defaultValue);
    }

    protected configObserve(defaultValue?: 'body' | 'events' | 'response' | any): 'body' | 'events' | 'response' | any {
        return (this.config.tokenParam ? this.config.tokenParam.observe : defaultValue);
    }

    protected handleResponseError(url: string, method?: string, res?: any, options?: {
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
    }): Observable<T | T[]> {
        /** check whether is un-authorized/expired */
        if (url !== this.config.token.tokenUrl && this.isUnauthorizedOrExpired(res)) {
            !(this.config.token.tokenUrl || '').length
            || throwError('Please provide third-party authorization configuration to require access token!');
            return this.handleUnauthorizedExpired(url, method, options);
        }
        return super.handleResponseError(url, method, options);
    }

    protected isUnauthorizedOrExpired(res?: any): boolean {
        return false;
    }

    /**
     * Handle the un-authorized/expired token case via {IThirdPartyApiConfig},
     * by sending another request to require authorization token
     * @param url original URL
     * @param method original request method
     * @param res original request response error
     * @param options original request options
     */
    protected handleUnauthorizedExpired(url: string, method?: string, res?: any, options?: {
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
    }): Observable<T | T[]> {
        // prepare options for authorization request
        let clonedOptions: {
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
        } = ObjectUtils.deepCopy(options || {});
        clonedOptions.headers = this.configHeaders();
        clonedOptions.params = this.configParams();
        clonedOptions.body = this.configBody();
        clonedOptions.observe = this.configObserve();
        clonedOptions.responseType = this.configResponseType();
        if (this.config.tokenParam && this.config.tokenParam.type === 'custom') {
            clonedOptions = this.customAuthorizeRequestOptions(clonedOptions);
            clonedOptions = (clonedOptions || {});
        }

        // create authorization request to require token or authorize
        const _this: ThirdPartyApiHttpService<T> = this;
        return _this.getHttp().request(
            _this.config.token.method || 'GET',
            _this.config.token.tokenUrl, clonedOptions).pipe(
            map(accessTokenResp => {
                _this.getLogger().debug('Access Token Response', accessTokenResp);
                return accessTokenResp;
            }),
            map(accessTokenResp => {
                const httpResp: HttpResponse<any> = <HttpResponse<any>>(<any>accessTokenResp);
                _this.ensureVaidResponse(httpResp,
                    _this.config.token.tokenUrl,
                    _this.config.token.method || 'GET', clonedOptions);
                const accessToken: any = _this.parseAccessToken(httpResp);
                _this.config[ThirdPartyApiHttpService.THIRD_PARTY_LATEST_ACCESS_TOKEN] = accessToken;
                if (!accessToken) {
                    throwError(new HttpErrorResponse({
                        url: url,
                        headers: <HttpHeaders>options.headers,
                        status: 401,
                        statusText: 'Unauthorized',
                        error: 'Token has been expired! But could not require/parse new token again!',
                    }));
                }
                return accessToken;
            }),
            map(accessToken => {
                // include new token to original request to request again
                return  _this.updateRequestOptionsBeforeRequest(options);
            }),
            // TODO this is way to call an observer in another observer
            flatMap(tokenOptions => {
                return _this.getHttp().request(method, url, tokenOptions).pipe(
                    map(apiDataResp => {
                        if (apiDataResp instanceof HttpResponse) {
                            const httpResp: HttpResponse<any> = <HttpResponse<any>>apiDataResp;
                            _this.ensureVaidResponse(httpResp, url, method, tokenOptions);
                        } else {
                            apiDataResp = new HttpResponse({
                                body: JSON.stringify(apiDataResp),
                                headers: (tokenOptions && tokenOptions.headers instanceof HttpHeaders
                                    ? <HttpHeaders>tokenOptions.headers
                                    : new HttpHeaders(<{ [name: string]: string | string[]; }>
                                        (tokenOptions || {}).headers)),
                                status: 200, url: url,
                            });
                        }
                        return _this.parseResponse(new ServiceResponse(
                            true, apiDataResp, tokenOptions.redirectSuccess,
                            [], tokenOptions.messages));
                    }),
                    catchError(_this.processRequestError(url, method, options)));
            }),
            catchError(_this.processRequestError(url, method, options)));
    }

    /**
     * Custom the authorization/access token request options if {IThirdPartyApiConfig#tokenParam#type} is 'custom'.
     * TODO Children class should override this method if necessary customization
     * @param options original options to customize
     */
    protected customAuthorizeRequestOptions(options?: {
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
    }): {
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
    } {
        return options;
    }

    /**
     * Parse authorization/access token from the specified {HttpResponse} for applying into original request.
     * TODO Children class should override this method and cache token again for later
     * @param httpResponse to parse
     */
    protected parseAccessToken(httpResponse: HttpResponse<any>): any {
        const source: any = (httpResponse instanceof HttpResponse ? httpResponse.body : httpResponse);
        return JsonUtils.safeParseJson(source);
    }

    /**
     * Process the response token into the specified original request options
     * to re-request again with including new access token.
     * TODO Children class should override this method to apply new access token to request options
     * @param tokenValue token that has returned from authorization request
     * @param options original request options to include token
     */
    protected processAccessToken(
        tokenValue: any,
        options?: {
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
        }): {
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
    } {
        return options;
    }

    /**
     * Update X-Values header for request options to specified this request from third-party
     * @param options to update
     * @private
     */
    protected updateRequestOptionsBeforeRequest(options?: {
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
    }): {
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
    } {
        // include the check flag to original request to avoid loop stack
        options = Object.assign({}, options || {});
        options.headers = (options.headers || {});
        if (options.headers instanceof HttpHeaders) {
            (<HttpHeaders>options.headers).set(RC_THIRD_PARTY_CUSTOM_TYPE, this.config.code);
        } else {
            options.headers[RC_THIRD_PARTY_CUSTOM_TYPE] = this.config.code;
        }
        return this.processAccessToken(
            this.config[ThirdPartyApiHttpService.THIRD_PARTY_LATEST_ACCESS_TOKEN], options);
    }

    @Cacheable()
    public request(url: string, method?: string, options?: {
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
    }): Observable<T | T[]> {
        // apply latest token if necessary
        options = (options || {});
        options = this.updateRequestOptionsBeforeRequest(options);
        return super.request(url, method, options);
    }
}
