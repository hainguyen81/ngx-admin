import {Inject, Injectable} from '@angular/core';
import {deepExtend, NbAuthResult, NbAuthToken, NbPasswordAuthStrategy} from '@nebular/auth';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {NbxOAuth2AuthDbService, NbxOAuth2AuthHttpService} from './auth.oauth2.service';
import {NbxAuthOAuth2Token} from './auth.oauth2.token';
import {LogConfig} from '../config/log.config';
import {ModuleService} from '../services/implementation/module.service';
import {IModule} from '../@core/data/system/module';
import {isArray} from 'util';
import {IRole} from '../@core/data/system/role';
import {isObject} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import EncryptionUtils from '../utils/common/encryption.utils';
import {RC_AUTH_AUTHORIZATION_BASIC_TYPE} from '../config/request.config';
import JsonUtils from '../utils/common/json.utils';
import {AUTH_STRATEGY_OPTIONS} from '../config/auth.config';

@Injectable()
export class NbxOAuth2AuthStrategy extends NbPasswordAuthStrategy {
    protected getLogger(): NGXLogger {
        return this.logger;
    }

    protected getHttpService(): NbxOAuth2AuthHttpService<NbxAuthOAuth2Token> {
        return this.authHttpService;
    }

    protected getDbService(): NbxOAuth2AuthDbService<NbAuthToken> {
        return this.authDbService;
    }

    protected getModuleDbService(): ModuleService {
        return this.moduleDbService;
    }

    setOptions(options: any): void {
        super.setOptions(deepExtend({}, AUTH_STRATEGY_OPTIONS, options));
    }

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(ActivatedRoute) route: ActivatedRoute,
                @Inject(NbxOAuth2AuthHttpService) private authHttpService: NbxOAuth2AuthHttpService<NbxAuthOAuth2Token>,
                @Inject(NbxOAuth2AuthDbService) private authDbService: NbxOAuth2AuthDbService<NbAuthToken>,
                @Inject(ModuleService) private moduleDbService: ModuleService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        super(http, route);
        route || throwError('Could not inject route!');
        authHttpService || throwError('Could not inject HttpService!');
        const _this = this;
        this.authHttpService.setCreateTokenDelegate((value: any) => _this.createToken(value));
        authDbService || throwError('Could not inject IndexedDb!');
        logger || throwError('Could not inject logger!');
        logger.updateConfig(LogConfig);
        this.defaultOptions = deepExtend({}, AUTH_STRATEGY_OPTIONS);
    }

    authenticate = (data?: any): Observable<NbAuthResult> => {
        let oauth2: NbxOAuth2AuthStrategy;
        oauth2 = this;
        const module = 'login';
        let headers: HttpHeaders;
        headers = new HttpHeaders(oauth2.getOption(`${module}.headers`) || {});
        let authorization: string;
        authorization = EncryptionUtils.base64Encode(':',
            data['email'] || '', EncryptionUtils.md5Encode(':', data['password']));
        headers = headers.set('Authorization', [RC_AUTH_AUTHORIZATION_BASIC_TYPE, authorization].join(' '));
        let method: string;
        method = oauth2.getOption(`${module}.method`);
        let url: string;
        url = oauth2.getActionEndpoint(module);
        let options: any;
        options = {
            body: {}, headers: headers, observe: 'response',
            redirectSuccess: oauth2.getOption(`${module}.redirect.success`),
            redirectFailure: oauth2.getOption(`${module}.redirect.failure`),
            errors: oauth2.getOption(`${module}.errors`) || [],
            messages: oauth2.getOption(`${module}.messages`) || [],
        };
        return this.getHttpService().request(url, method || 'POST', options).pipe(
            map(token => {
                return (!isArray(token) && token
                    ? token : isArray(token) ? token[0] : undefined);
            }),
            map(token => {
                return new NbAuthResult(
                    (token && Object.keys(token).length ? true : false),
                    new HttpResponse({
                        body: (token && Object.keys(token).length ? token : undefined),
                        status: 200,
                        url: url,
                    }),
                    (token && Object.keys(token).length ? options.redirectSuccess : options.redirectFailure),
                    (token && Object.keys(token).length ? [] : options.errors),
                    options.messages,
                    (token && Object.keys(token).length ? token : undefined));
            })) as Observable<NbAuthResult>;
    }

    createToken<T extends NbAuthToken>(value: any, failWhenInvalidToken?: boolean): T {
        // TODO remove all profile images, just keep the first one
        // TODO because of maximum quota exceed
        const tokenJson: any = JsonUtils.safeParseJson(value);
        if (tokenJson && tokenJson.hasOwnProperty('image')) {
            delete tokenJson['image'];
        }

        // create token
        let token: T;
        token = super.createToken(tokenJson, this.getOption(`login.failWhenInvalidToken`));
        this.storeDb(token).then((t: T) => token = t, (errors) => this.getLogger().error(errors));
        return token;
    }

    private storeDb<T extends NbAuthToken>(token?: T): Promise<T> {
        if (!token || !token.getPayload() || !token.isValid()) {
            return new Promise((resolve => resolve(null)));
        }
        return new Promise((resolve, reject) => {
            this.getDbService().clear().then(() => {
                this.getDbService().insert(token.getPayload())
                    .then(() => {
                        // insert modules to build menu
                        this.getModuleDbService().clear()
                            .then(() => {
                                this.getModuleDbService().insertEntities(this.parseModules(token.getPayload()))
                                    .then(() => resolve(token), (errors) => {
                                        this.getLogger().error(errors);
                                        reject(errors);
                                    });
                            }, (errors) => {
                                this.getLogger().error(errors);
                                reject(errors);
                            });
                    }, (errors) => {
                        this.getLogger().error(errors);
                        reject(errors);
                    });
            }, (errors) => {
                this.getLogger().error(errors);
                reject(errors);
            });
        });
    }

    private parseModules(payload?: any): IModule[] {
        let modules: IModule[];
        modules = [];
        let isValidPayload: boolean;
        isValidPayload = (payload && isObject(payload) && Object.keys(payload).length > 0);
        if (!isValidPayload) {
            return modules;
        }

        // parse role from payload token
        isValidPayload = isValidPayload && (payload && payload.hasOwnProperty('rolesGroup'));
        isValidPayload = isValidPayload && (payload['rolesGroup'] && payload['rolesGroup'].hasOwnProperty('roles'));
        isValidPayload = isValidPayload && (payload['rolesGroup']['roles'] && isArray(payload['rolesGroup']['roles']));
        if (!isValidPayload) {
            return modules;
        }

        // parse module from role
        let roles: IRole[];
        roles = payload['rolesGroup']['roles'];
        roles.forEach((role: IRole) => {
            if (role.module) {
                modules.push(role.module as IModule);
            }
        });
        this.getLogger().debug('Modules', modules);
        return modules;
    }
}
