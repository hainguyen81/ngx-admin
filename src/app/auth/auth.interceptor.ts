import {NB_AUTH_INTERCEPTOR_HEADER, NbAuthSimpleInterceptor, NbAuthToken} from '@nebular/auth';
import {Inject, Injectable, InjectionToken, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

export const NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM = new InjectionToken<string>('Custom Interceptor Access Token Parameter');
export const NBX_AUTH_INTERCEPTOR_COMPANY_HEADER = new InjectionToken<string>('Custom Interceptor Company Header Parameter');
export const NBX_AUTH_AUTHORIZATION_HEADER = 'Authorization';
export const NBX_AUTH_COMPANY_HEADER = 'Company';
export const NBX_AUTH_ACCESS_TOKEN_PARAM = 'access_token';
export const NBX_AUTH_REFRESH_TOKEN_PARAM = 'refresh_token';
export const NBX_AUTH_AUTHORIZATION_BASIC_TYPE = 'Basic';
export const NBX_AUTH_AUTHORIZATION_BEARER_TYPE = 'Bearer';

@Injectable()
export class NbxAuthInterceptor extends NbAuthSimpleInterceptor {
    constructor(injector: Injector,
                @Inject(NB_AUTH_INTERCEPTOR_HEADER)
                protected headerName: string = NBX_AUTH_AUTHORIZATION_HEADER,
                @Inject(NBX_AUTH_INTERCEPTOR_COMPANY_HEADER)
                private companyHeaderName: string = NBX_AUTH_COMPANY_HEADER,
                @Inject(NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM)
                private accessTokenParamName: string = NBX_AUTH_ACCESS_TOKEN_PARAM) {
        super(injector, headerName);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.getToken()
            .pipe(switchMap((token: NbAuthToken) => {
                    if (token && token.getValue()) {
                        req = req.clone({
                            setHeaders: {
                                [this.headerName]: token.getValue(),
                                [this.companyHeaderName]: token.getPayload()['company'],
                            },
                        });
                        req.params.append(this.accessTokenParamName, token.getValue());
                    }
                    return next.handle(req);
                }),
            );
    }
}
