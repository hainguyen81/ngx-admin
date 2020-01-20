import {Inject, Injectable} from '@angular/core';
import {NbxOAuth2AuthDbService} from '../../auth/auth.oauth2.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {NbMenuItem} from '@nebular/theme';
import {catchError, map} from 'rxjs/operators';
import {NbAuthToken} from '@nebular/auth';
import {Observable} from 'rxjs';
import {isArray, isObject} from 'util';
import ObjectUtils from '../../utils/object.utils';
import {NbxAuthOAuth2Token} from '../../auth/auth.oauth2.token';

@Injectable()
export class MenuService extends NbxOAuth2AuthDbService<NbxAuthOAuth2Token> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService, @Inject(NGXLogger) logger: NGXLogger) {
        super(dbService, logger);
    }

    public buildMenu(): Observable<NbMenuItem[]> {
        return super.getAll().pipe(map((tokens: any) => {
            return tokens.length > 0 ? tokens.shift() : null;
        }), map((token: {[key: string]: string | number} | string) => MenuService.doBuildMenuItem(token)),
          catchError((errors) => {
            this.getLogger().error(errors);
            return [];
        }));
    }

    private static doBuildMenuItem(token: {[key: string]: string | number} | string): NbMenuItem[] {
        let isValidToken: boolean;
        let nbAUthToken: NbxAuthOAuth2Token;
        nbAUthToken = new NbxAuthOAuth2Token(token, NbAuthToken.name);
        isValidToken = (nbAUthToken && typeof nbAUthToken.getPayload === 'function');
        isValidToken = isValidToken && (isObject(nbAUthToken.getPayload()) && nbAUthToken.isValid());
        if (isValidToken) {
            let payload: Object;
            payload = ObjectUtils.cast(nbAUthToken.getPayload(), Object);
            isValidToken = isValidToken && (payload && payload.hasOwnProperty('rolesGroup'));
            isValidToken = isValidToken && (payload['rolesGroup'] && payload['rolesGroup'].hasOwnProperty('roles'));
            isValidToken = isValidToken && (payload['rolesGroup']['roles'] && isArray(payload['rolesGroup']['roles']));
            if (isValidToken) {
                // TODO build menu item recursively
            }
        }
        return [];
    }
}
