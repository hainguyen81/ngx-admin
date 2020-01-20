import {NB_AUTH_INTERCEPTOR_HEADER, NbAuthSimpleInterceptor, NbAuthToken} from '@nebular/auth';
import {Inject, Injectable, InjectionToken, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

export const NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM = new InjectionToken<string>('Custom Interceptor Access Token Parameter');
export const NBX_AUTH_INTERCEPTOR_COMPANY_HEADER = new InjectionToken<string>('Custom Interceptor Company Header Parameter');

@Injectable()
export class NbxAuthInterceptor extends NbAuthSimpleInterceptor {
    constructor(injector: Injector,
                @Inject(NB_AUTH_INTERCEPTOR_HEADER)
                protected headerName: string = 'Authorization',
                @Inject(NBX_AUTH_INTERCEPTOR_COMPANY_HEADER)
                private companyHeaderName: string = 'Company',
                @Inject(NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM)
                private accessTokenParamName: string = 'access_token') {
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
