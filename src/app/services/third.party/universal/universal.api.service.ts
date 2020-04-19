import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ServiceResponse} from '../../response.service';
import JsonUtils from '../../../utils/json.utils';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ConnectionService} from 'ng-connection-service';
import {Observable, throwError} from 'rxjs';
import {IApiThirdParty, UniversalApiThirdParty} from '../../../@core/data/system/api.third.party';
import ThirdPartyApiConfig, {
    IThirdPartyApiConfig,
    THIRDPARTY_AUTHORIZATION_API_CONFIG,
    ThirdPartyApiDbService,
    ThirdPartyApiHttpService,
} from '../third.party.api.service';
import {IModel} from '../../../@core/data/base';
import {
    NBX_AUTH_AUTHORIZATION_BEARER_TYPE,
    NBX_AUTH_AUTHORIZATION_HEADER,
} from '../../../auth/auth.interceptor';
import {THIRD_PARTY_API} from '../../../config/third.party.api';
import {Cacheable} from 'ngx-cacheable';

/**
 * { 'error': {
 *      'name': 'TokenExpiredError',
 *      'message': 'jwt expired',
 *      'expiredAt': '2020-02-18T17:55:22.000Z'
 * } }
 */
export const TOKEN_EXPIRED_ERROR_NAME: string = 'TokenExpiredError';

export interface IUniversalApiExpiredResponse extends IModel {
    error?: { name?: string | null, message?: string | null, expiredAt?: string | null } | null;
}

export const UNIVERSAL_API_CONFIG: IThirdPartyApiConfig = {
    code: THIRD_PARTY_API.universal.code,
    tokenUrl: THIRD_PARTY_API.universal.tokenUrl,
    method: 'GET',
    tokenParam: {
        type: 'header',
        values: {
            'api-token': THIRD_PARTY_API.universal.vapid_public_key,
            'user-email': THIRD_PARTY_API.universal.email,
        },
    },
};

@Injectable()
export class UniversalApiDbService extends ThirdPartyApiDbService<UniversalApiThirdParty> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService);
    }
}

@Injectable()
export class UniversalApiHttpService extends ThirdPartyApiHttpService<UniversalApiThirdParty> {

    private static UNIVERSAL_ACCESS_TOKEN_API_PARAMETER_NAME: string = 'auth_token';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _latestToken: string;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    get latestToken(): string {
        return this._latestToken;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(UniversalApiDbService) dbService: UniversalApiDbService) {
        super(http, logger, dbService, UNIVERSAL_API_CONFIG);
    }

    parseResponse(serviceResponse?: ServiceResponse): UniversalApiThirdParty {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        const data: UniversalApiThirdParty = new UniversalApiThirdParty();
        data.code = [this.config.code, this.config.method || 'UNKNOWN', serviceResponse.getResponse().url].join('|');
        (<IApiThirdParty>data).response = serviceResponse.getResponse().body;
        return data;
    }

    protected isUnauthorizedOrExpired(res?: any): boolean {
        if (res && res instanceof HttpErrorResponse
            && (res.status === 500 || res.status === 401)) {
            const respErr: HttpErrorResponse = <HttpErrorResponse>res;
            if (respErr.error) {
                const errorResp: IUniversalApiExpiredResponse =
                    JsonUtils.safeParseJson(respErr.error) as IUniversalApiExpiredResponse;
                return (errorResp && errorResp.error
                    && errorResp.error.name === TOKEN_EXPIRED_ERROR_NAME);
            }
        }
        return super.isUnauthorizedOrExpired(res);
    }

    protected parseAccessToken(httpResponse: HttpResponse<any>): any {
        const token: any = super.parseAccessToken(httpResponse);
        const tokenValue: string = (token || {})[
            UniversalApiHttpService.UNIVERSAL_ACCESS_TOKEN_API_PARAMETER_NAME];
        this.config[UniversalApiHttpService.UNIVERSAL_ACCESS_TOKEN_API_PARAMETER_NAME] = tokenValue;
        this._latestToken = tokenValue;
        return tokenValue;
    }

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
        const authTokenValue = [NBX_AUTH_AUTHORIZATION_BEARER_TYPE, tokenValue].join(' ');
        options = (options || {});
        options.headers = (options.headers || new HttpHeaders());
        if (options.headers instanceof HttpHeaders) {
            (<HttpHeaders>options.headers).set(NBX_AUTH_AUTHORIZATION_HEADER, authTokenValue);
        } else {
            options.headers[NBX_AUTH_AUTHORIZATION_HEADER] = authTokenValue;
        }
        return options;
    }

    @Cacheable()
    public request(url: string, method?: string, options?: {
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
    }): Observable<UniversalApiThirdParty | UniversalApiThirdParty[]> {
        // apply latest token if necessary
        if (this.config) {
            const tokenValue: string = (this.config[
                UniversalApiHttpService.UNIVERSAL_ACCESS_TOKEN_API_PARAMETER_NAME] || this.latestToken);
            if (tokenValue) {
                // @ts-ignore
                options = this.processAccessToken(tokenValue, options);
            }
        }
        return super.request(url, method, options);
    }
}
