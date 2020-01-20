import {Inject, Injectable} from '@angular/core';
import {NbxOAuth2AuthDbService} from '../../auth/auth.oauth2.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {NbMenuItem} from '@nebular/theme';
import {map} from 'rxjs/operators';
import {NbAuthToken} from '@nebular/auth';
import {Observable} from 'rxjs';
import {isArray, isObject} from 'util';
import ObjectUtils from '../../utils/object.utils';

@Injectable()
export class MenuService extends NbxOAuth2AuthDbService<NbAuthToken> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService, @Inject(NGXLogger) logger: NGXLogger) {
        super(dbService, logger);
    }

    public buildMenu(): Observable<NbMenuItem[]> {
        return super.getAll().pipe(map((tokens: NbAuthToken[]) => {
            return tokens.length > 0 ? tokens.shift() : null;
        }), map((token: NbAuthToken) => MenuService.doBuildMenuItem(token)));
    }

    private static doBuildMenuItem(token: NbAuthToken): NbMenuItem[] {
        let isValidToken: boolean;
        isValidToken = (token && token.getPayload() && isObject(token.getPayload()) && token.isValid());
        if (isValidToken) {
            let payload: Object;
            payload = ObjectUtils.cast(token.getPayload(), Object);
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
