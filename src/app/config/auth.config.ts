import {API} from './api.config';
import {NbxAuthOAuth2Token} from '../auth/auth.oauth2.token';

const ApiCfg = Object.assign({}, API);
const AuthStrategyOptions = {
    name: 'email',
    baseEndpoint: '',

    token: {
        class: NbxAuthOAuth2Token,
        key: 'access_token', // this parameter tells where to look for the token
    },

    login: {
        redirect: {
            success: '/dashboard',
            failure: <any>null, // stay on the same page
        },
    },

    register: {
        redirect: {
            success: '/dashboard',
            failure: <any>null, // stay on the same page
        },
    },
};
AuthStrategyOptions.login = Object.assign(AuthStrategyOptions.login, {
    endpoint: ApiCfg['login']['api']['login'].call(ApiCfg),
    method: ApiCfg['login']['api']['method'],
    headers: ApiCfg['headers'],
});
export const AUTH_STRATEGY_OPTIONS = AuthStrategyOptions;
