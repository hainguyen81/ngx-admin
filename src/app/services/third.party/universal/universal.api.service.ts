import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServiceResponse} from '../../response.service';
import JsonUtils from '../../../utils/json.utils';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ConnectionService} from 'ng-connection-service';
import {Observable, throwError} from 'rxjs';
import {UniversalApiThirdParty} from '../../../@core/data/system/api.third.party';
import {ThirdPartyApiDbService, ThirdPartyApiHttpService} from '../third.party.api.service';

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

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(UniversalApiDbService) dbService: UniversalApiDbService) {
        super(http, logger, dbService);
        dbService || throwError('Could not inject user database service for offline mode');
        super.setHandleResponseErrorDelegate(this.__handleResponseErrorDelegate);
    }

    parseResponse(serviceResponse?: ServiceResponse): UniversalApiThirdParty {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        return JsonUtils.parseResponseJson(serviceResponse.getResponse().body) as UniversalApiThirdParty;
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
    }): Observable<UniversalApiThirdParty[] | UniversalApiThirdParty> {
        return undefined;
    }

    private __handleResponseErrorDelegate(url: string, method?: string, res?: any, options?: {
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
    }): Observable<UniversalApiThirdParty | UniversalApiThirdParty[]> {
        return undefined;
    }
}
