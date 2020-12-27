import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {ServiceResponse} from '../../common/response.service';
import JsonUtils from '../../../utils/common/json.utils';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ConnectionService} from 'ng-connection-service';
import {IApiThirdParty, UniversalApiThirdParty} from '../../../@core/data/system/api.third.party';
import {
    IThirdPartyApiConfig,
    ThirdPartyApiDbService,
    ThirdPartyApiHttpService,
} from '../third.party.api.service';
import {IModel} from '../../../@core/data/base';
import {THIRD_PARTY_API} from '../../../config/third.party.api';
import {
    RC_AUTH_AUTHORIZATION_BEARER_TYPE,
    RC_AUTH_AUTHORIZATION_HEADER, RC_THIRD_PARTY_CUSTOM_TYPE,
} from '../../../config/request.config';
import {IdGenerators} from '../../../config/generator.config';
import {NgxLocalStorageEncryptionService} from '../../storage.services/local.storage.services';

/**
 * { 'error': {
 *      'name': 'TokenExpiredError',
 *      'message': 'jwt expired',
 *      'expiredAt': '2020-02-18T17:55:22.000Z'
 * } }
 * { 'error': {
 *      'name': 'JsonWebTokenError',
 *      'message': 'jwt must be provided'
 * } }
 */
export const TOKEN_EXPIRED_ERROR_NAME: string = 'TokenExpiredError';
export const TOKEN_UNPROVIDED_ERROR_NAME: string = 'JsonWebTokenError';

export interface IUniversalApiExpiredResponse extends IModel {
    error?: { name?: string | null, message?: string | null, expiredAt?: string | null } | null;
}

export const UNIVERSAL_API_CONFIG: IThirdPartyApiConfig = {
    code: THIRD_PARTY_API.universal.code,
    baseUrl: THIRD_PARTY_API.universal.baseUrl,
    token: {
        tokenUrl: THIRD_PARTY_API.universal.api.token.tokenUrl.call(this),
        method: 'GET',
        expiredIn: THIRD_PARTY_API.universal.api.token.expiredIn,
    },
    tokenParam: {
        type: 'header',
        values: {
            'api-token': THIRD_PARTY_API.universal.api.token.vapid_public_key,
            'user-email': THIRD_PARTY_API.universal.api.token.email,
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
    // CONSTRUCTION
    // -------------------------------------------------

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(UniversalApiDbService) dbService: UniversalApiDbService,
                @Inject(NgxLocalStorageEncryptionService) secureStorage: NgxLocalStorageEncryptionService) {
        super(http, logger, dbService, secureStorage, UNIVERSAL_API_CONFIG);
    }

    parseResponse(serviceResponse?: ServiceResponse): UniversalApiThirdParty {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        const data: UniversalApiThirdParty = new UniversalApiThirdParty();
        data.id = (data.id || IdGenerators.oid.generate());
        data.code = [this.config.code, this.config.token.method || 'UNKNOWN', serviceResponse.getResponse().url].join('|');
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
                    && [TOKEN_EXPIRED_ERROR_NAME, TOKEN_UNPROVIDED_ERROR_NAME]
                        .indexOf(errorResp.error.name) >= 0);
            }
        }
        return super.isUnauthorizedOrExpired(res);
    }

    protected parseAccessToken(httpResponse: HttpResponse<any>): any {
        const token: any = super.parseAccessToken(httpResponse);
        return (token || {})[UniversalApiHttpService.UNIVERSAL_ACCESS_TOKEN_API_PARAMETER_NAME];
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
        // accept invalid token for expired/unauthorized case
        const authTokenValue = [RC_AUTH_AUTHORIZATION_BEARER_TYPE, (tokenValue || '')].join(' ');
        options = (options || {});
        options.headers = (options.headers || {});
        if (options.headers instanceof HttpHeaders) {
            (<HttpHeaders>options.headers).set(RC_AUTH_AUTHORIZATION_HEADER, authTokenValue);
        } else {
            options.headers[RC_AUTH_AUTHORIZATION_HEADER] = authTokenValue;
        }
        return options;
    }
}
