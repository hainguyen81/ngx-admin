import { NbAuthResult, NbPasswordAuthStrategy } from '@nebular/auth';
import { Observable } from 'rxjs';
import { NbAuthStrategyClass } from '@nebular/auth/auth.options';
import { NbxPasswordAuthStrategyOptions } from './auth.oauth2.strategy.options';
import { HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';

export declare class NbxOAuth2AuthStrategy extends NbPasswordAuthStrategy {
  static setup(options: NbxPasswordAuthStrategyOptions): [NbAuthStrategyClass, NbxPasswordAuthStrategyOptions];

  authenticate(data?: any): Observable<NbAuthResult> {
    let headers: HttpHeaders;
    let url: string;
    let method: string;
    let md5: Md5;

    method = this.getOption('login.method');
    headers = new HttpHeaders(this.getOption('login.headers'));
    url = this.getActionEndpoint('login.endpoint');
    md5 = new Md5();
    headers.set('Authorization', 'Basic ' + btoa(data['email'] + ':' + md5.appendStr(data['password']).end()));
    return this.http.request(method, url, { body: {}, headers: headers, observe: 'response'});
  }
}
