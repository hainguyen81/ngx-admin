import {IApi} from '../../data/system/api';

export const MockApiUser: IApi = {
    code: 'USER_API',
    name: 'system.user.menu',
    regexUrl: 'user/**',
    baseUrl: 'http://localhost:8082/api-rest-user/service',
    icon: { icon: 'users', pack: 'fa' },
    version: '1.0.0',
    id: '5d7660cd738fbc23b43a857e',
};

export const MockApiCustomer: IApi = {
    code: 'CUSTOMER_API',
    name: 'system.customer.menu',
    regexUrl: 'customer/**',
    baseUrl: 'http://localhost:8082/api-rest-customer/service',
    icon: {icon: 'address-card', pack: 'fa'},
    version: '1.0.0',
    id: '5d7660cd738fbc23b43a857f',
};

export const MockApiOrganization: IApi = {
    code: 'ORGANIZATION_API',
    name: 'system.organization.menu',
    regexUrl: 'organization/**',
    baseUrl: 'http://localhost:8082/api-rest-organization/service',
    icon: {icon: 'sitemap', pack: 'fa'},
    version: '1.0.0',
    id: '5d7660cd738fbc23b43a857g',
};

export const MockApiWarehouseCategory: IApi = {
    code: 'WAREHOUSE_CATEGORY_API',
    name: 'warehouse.category.menu',
    regexUrl: 'warehouse/**',
    baseUrl: 'http://localhost:8082/api-rest-warehouse/service',
    icon: {icon: 'bars', pack: 'fa'},
    version: '1.0.0',
    id: '5d7660cd738fbc23b43a857i',
};

export const MockApiWarehouseItem: IApi = {
    code: 'WAREHOUSE_ITEM_API',
    name: 'warehouse.item.menu',
    regexUrl: 'warehouse/**',
    baseUrl: 'http://localhost:8082/api-rest-warehouse/service',
    icon: {icon: 'boxes', pack: 'fa'},
    version: '1.0.0',
    id: '5d7660cd738fbc23b43a857h',
};

export const MockApi = {
    user: MockApiUser,
    customer: MockApiCustomer,
    organization: MockApiOrganization,
    warehouseCategory: MockApiWarehouseCategory,
    warehouseItem: MockApiWarehouseItem,
};