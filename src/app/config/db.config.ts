import {DBConfig} from 'ngx-indexed-db';

export const DB_STORE: any = {
    auth: 'auth',
    module: 'module',
    user: 'user',
};

export const dbConfig: DBConfig = {
    name: 'qDb',
    version: 1,
    objectStoresMeta: [{
        store: DB_STORE.auth,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'access_token', keypath: 'access_token', options: {unique: true}},
            {name: 'token_type', keypath: 'token_type', options: {unique: false}},
            {name: 'refresh_token', keypath: 'refresh_token', options: {unique: true}},
            {name: 'expires_in', keypath: 'expires_in', options: {unique: false}},
            {name: 'scope', keypath: 'scope', options: {unique: false}},
            {name: 'company', keypath: 'company', options: {unique: false}},
            {name: 'enterprise', keypath: 'enterprise', options: {unique: false}},
            {name: 'username', keypath: 'username', options: {unique: false}},
            {name: 'firstName', keypath: 'firstName', options: {unique: false}},
            {name: 'lastName', keypath: 'lastName', options: {unique: false}},
            {name: 'email', keypath: 'email', options: {unique: false}},
            {name: 'status', keypath: 'status', options: {unique: false}},
            {name: 'rolesGroupId', keypath: 'rolesGroupId', options: {unique: false}},
            {name: 'rolesGroup', keypath: 'rolesGroup', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.module,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'apiId', keypath: 'apiId', options: {unique: true}},
            {name: 'api', keypath: 'api', options: {unique: false}},
            {name: 'children', keypath: 'children', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.user,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'scope', keypath: 'scope', options: {unique: false}},
            {name: 'company', keypath: 'company', options: {unique: false}},
            {name: 'enterprise', keypath: 'enterprise', options: {unique: false}},
            {name: 'username', keypath: 'username', options: {unique: true}},
            {name: 'password', keypath: 'password', options: {unique: false}},
            {name: 'firstName', keypath: 'firstName', options: {unique: false}},
            {name: 'lastName', keypath: 'lastName', options: {unique: false}},
            {name: 'email', keypath: 'email', options: {unique: true}},
            {name: 'status', keypath: 'status', options: {unique: false}},
        ],
    }],
};
