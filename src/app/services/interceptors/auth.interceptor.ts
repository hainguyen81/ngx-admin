import {NB_AUTH_INTERCEPTOR_HEADER, NbAuthToken} from '@nebular/auth';
import {Inject, Injectable, InjectionToken, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {
    RC_AUTH_ACCESS_TOKEN_PARAM,
    RC_AUTH_AUTHORIZATION_HEADER,
    RC_COMPANY_HEADER, RC_THIRD_PARTY_CUSTOM_TYPE,
} from '../../config/request.config';
import {NGXLogger} from 'ngx-logger';
import {AbstractHttpInterceptor} from './abstract.http.interceptor';

export const NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM =
    new InjectionToken<string>('Custom Interceptor Access Token Parameter');
export const NBX_AUTH_INTERCEPTOR_COMPANY_HEADER =
    new InjectionToken<string>('Custom Interceptor Company Header Parameter');

@Injectable({ providedIn: 'any' })
export class NbxAuthInterceptor extends AbstractHttpInterceptor {

    constructor(_injector: Injector,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(NB_AUTH_INTERCEPTOR_HEADER)
                protected headerName: string = RC_AUTH_AUTHORIZATION_HEADER,
                @Inject(NBX_AUTH_INTERCEPTOR_COMPANY_HEADER)
                private companyHeaderName: string = RC_COMPANY_HEADER,
                @Inject(NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM)
                private accessTokenParamName: string = RC_AUTH_ACCESS_TOKEN_PARAM) {
        super(_injector, _logger, headerName);
    }

    protected isSupported(req: HttpRequest<any>): boolean {
        return super.isSupported(req) && !this.isThirdPartyRequest(req);
    }

    /**
     * Get a boolean value indicating the specified {HttpRequest} whether is third-party API request
     * @param req to check
     */
    private isThirdPartyRequest(req: HttpRequest<any>): boolean {
        return (req.headers && req.headers.has(RC_THIRD_PARTY_CUSTOM_TYPE));
    }

    protected doIntercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.getToken().pipe(
            switchMap((token: NbAuthToken) => {
                // exclude request that already has authorization token such as third-party API
                if (token && token.getValue()
                    && req && !req.headers.has(this.headerName)
                    && !(<Object>req.headers).hasOwnProperty(this.headerName)) {
                    req.headers.set(this.headerName, token.getValue());
                    req.headers.set(this.companyHeaderName, token.getPayload()['company']);
                    req.params.append(this.accessTokenParamName, token.getValue());
                }
                return next.handle(req);
            }));
    }
}
