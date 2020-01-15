import {Injectable} from '@angular/core';
import {NbAuthResult, NbAuthToken, NbPasswordAuthStrategy} from '@nebular/auth';
import {NbxPasswordAuthStrategyOptions} from './auth.oauth2.strategy.options';
import {NbAuthStrategyClass} from '@nebular/auth/auth.options';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Md5} from 'ts-md5';
import {catchError, map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class NbxOAuth2AuthStrategy extends NbPasswordAuthStrategy {
  static setup(options: NbxPasswordAuthStrategyOptions): [NbAuthStrategyClass, NbxPasswordAuthStrategyOptions] {
    return [NbxOAuth2AuthStrategy, options];
  }

  private readonly logger: NGXLogger;
  protected getLogger(): NGXLogger {
    return this.logger;
  }

  constructor(http: HttpClient, route: ActivatedRoute, logger: NGXLogger) {
    super(http, route);
    this.logger = logger;
  }

  authenticate = (data?: any): Observable<NbAuthResult> => {
    let oauth2: NbxOAuth2AuthStrategy;
    oauth2 = this;
    let md5: Md5;
    md5 = new Md5();
    const module = 'login';
    let headers: HttpHeaders;
    headers = new HttpHeaders(oauth2.getOption(`${module}.headers`) || {});
    oauth2.getLogger().info(oauth2.getOption(`${module}.headers`));
    let authorization: string;
    authorization = btoa(data['email'] + ':' + md5.appendStr(data['password']).end());
    headers = headers.set('Authorization', 'Basic '.concat(authorization));
    let method: string;
    method = oauth2.getOption(`${module}.method`);
    let url: string;
    url = oauth2.getActionEndpoint(module);
    let requireValidToken: boolean;
    requireValidToken = oauth2.getOption(`${module}.requireValidToken`);
    return oauth2.http.request(method, url, {body: {}, headers: headers, observe: 'response'})
      .pipe(
        map((res) => {
          if (oauth2.getOption(`${module}.alwaysFail`)) throw oauth2.createFailResponse(data);
          return res;
        }),
        map((res) => new NbAuthResult(true, res,
          oauth2.getOption(`${module}.redirect.success`), [], [],
          oauth2.createToken(res.body, requireValidToken))),
        catchError((res) => oauth2.handleResponseError(res, module)),
      );
  }
}
