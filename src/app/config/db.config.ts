import {DBConfig} from 'ngx-indexed-db';

export const DB_STORE: any = {
    auth: 'auth',
    module: 'module',
    user: 'user',
    customer: 'customer',
    organization: 'organization',
    warehouse_categories: 'warehouse_categories'
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
    }, {
        store: DB_STORE.customer,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'customerName', keypath: 'customerName', options: {unique: false}},
            {name: 'email', keypath: 'email', options: {unique: true}},
            {name: 'tel', keypath: 'tel', options: {unique: false}},
            {name: 'address', keypath: 'address', options: {unique: false}},
            {name: 'status', keypath: 'status', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.organization,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: false}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'parentId', keypath: 'parentId', options: {unique: false}},
            {name: 'parent', keypath: 'parent', options: {unique: false}},
            {name: 'type', keypath: 'type', options: {unique: false}},
            {name: 'tax', keypath: 'tax', options: {unique: false}},
            {name: 'address', keypath: 'address', options: {unique: false}},
            {name: 'tel', keypath: 'tel', options: {unique: false}},
            {name: 'fax', keypath: 'fax', options: {unique: false}},
            {name: 'email', keypath: 'email', options: {unique: false}},
            {name: 'remark', keypath: 'remark', options: {unique: false}},
            {name: 'managerId', keypath: 'managerId', options: {unique: false}},
            {name: 'manager', keypath: 'manager', options: {unique: false}},
            {name: 'contact', keypath: 'contact', options: {unique: false}},
            {name: 'image', keypath: 'image', options: {unique: false}},
            {name: 'children', keypath: 'children', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_categories,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: false}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'node_id', keypath: 'node_id', options: {unique: false}},
            {name: 'type', keypath: 'type', options: {unique: false}},
            {name: 'img', keypath: 'type', options: {unique: false}},
            {name: 'remark', keypath: 'tax', options: {unique: false}}
        ],
    }],
};
