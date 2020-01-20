import {Inject, Injectable} from '@angular/core';
import {
  NbAuthResult,
  NbAuthToken,
  NbPasswordAuthStrategy,
} from '@nebular/auth';
import {NbxPasswordAuthStrategyOptions} from './auth.oauth2.strategy.options';
import {NbAuthStrategyClass} from '@nebular/auth/auth.options';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Md5} from 'ts-md5';
import {ActivatedRoute} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {NbxOAuth2AuthDbService, NbxOAuth2AuthHttpService} from './auth.oauth2.service';
import {NbxAuthOAuth2Token} from './auth.oauth2.token';
import {LogConfig} from '../config/log.config';

@Injectable()
export class NbxOAuth2AuthStrategy extends NbPasswordAuthStrategy {
  static setup(options: NbxPasswordAuthStrategyOptions): [NbAuthStrategyClass, NbxPasswordAuthStrategyOptions] {
    return [NbxOAuth2AuthStrategy, options];
  }

  protected getLogger(): NGXLogger {
    return this.logger;
  }

  protected getHttpService(): NbxOAuth2AuthHttpService<NbxAuthOAuth2Token> {
    return this.authHttpService;
  }

  protected getDbService(): NbxOAuth2AuthDbService<NbAuthToken> {
    return this.authDbService;
  }

  constructor(@Inject(HttpClient) http: HttpClient,
              @Inject(ActivatedRoute) route: ActivatedRoute,
              @Inject(NbxOAuth2AuthHttpService) private authHttpService: NbxOAuth2AuthHttpService<NbxAuthOAuth2Token>,
              @Inject(NbxOAuth2AuthDbService) private authDbService: NbxOAuth2AuthDbService<NbAuthToken>,
              @Inject(NGXLogger) private logger: NGXLogger) {
    super(http, route);
    route || throwError('Could not inject route!');
    authHttpService || throwError('Could not inject HttpService!');
    const _this = this;
    this.authHttpService.setCreateTokenDelegate((value: any) => _this.createToken(value));
    authDbService || throwError('Could not inject IndexedDb!');
    logger || throwError('Could not inject logger!');
    logger.updateConfig(LogConfig);
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
    let options: any;
    options = {body: {}, headers: headers, observe: 'response',
      redirectSuccess: oauth2.getOption(`${module}.redirect.success`)};
    return this.getHttpService().request(url, method, options);
  }

  createToken<T extends NbAuthToken>(value: any, failWhenInvalidToken?: boolean): T {
    return this.storeDb(super.createToken(value, this.getOption(`login.failWhenInvalidToken`)));
  }

  private storeDb<T extends NbAuthToken>(token?: T): T {
    this.getDbService().clear();
    if (!token || !token.getPayload() || !token.isValid()) {
      return null;
    }
    this.getDbService().insert(token.getPayload());
    return token;
  }
}
