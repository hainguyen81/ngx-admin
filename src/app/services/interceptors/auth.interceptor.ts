import {NB_AUTH_INTERCEPTOR_HEADER, NbAuthToken} from '@nebular/auth';
import {Inject, Injectable, InjectionToken, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {
    RC_ACCESS_CONTROL_ALLOW_ORIGIN_HEADER_ALL,
    RC_AUTH_ACCESS_TOKEN_PARAM,
    RC_AUTH_AUTHORIZATION_HEADER,
    RC_COMPANY_HEADER,
} from '../../config/request.config';
import {NGXLogger} from 'ngx-logger';
import {AbstractHttpInterceptor} from './abstract.http.interceptor';

export const NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM = new InjectionToken<string>('Custom Interceptor Access Token Parameter');
export const NBX_AUTH_INTERCEPTOR_COMPANY_HEADER = new InjectionToken<string>('Custom Interceptor Company Header Parameter');

@Injectable()
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

    protected doIntercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.getToken()
            .pipe(switchMap((token: NbAuthToken) => {
                    if (token && token.getValue()) {
                        req = req.clone({
                            setHeaders: {
                                [this.headerName]: token.getValue(),
                                [this.companyHeaderName]: token.getPayload()['company'],
                                RC_ACCESS_CONTROL_ALLOW_ORIGIN_HEADER:
                                RC_ACCESS_CONTROL_ALLOW_ORIGIN_HEADER_ALL,
                            },
                        });
                        req.params.append(this.accessTokenParamName, token.getValue());
                    }
                    return next.handle(req);
                }),
            );
    }
}
