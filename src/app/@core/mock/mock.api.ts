import {IApi} from '../data/api';

export const MockApiUser: IApi = {
    code: 'USER_API',
    name: 'User Management',
    regexUrl: 'user/**',
    baseUrl: 'http://localhost:8082/api-rest-user/service',
    icon: { icon: 'users', pack: 'fa' },
    version: '1.0.0',
    id: '5d7660cd738fbc23b43a857e',
};

export const MockApiCustomer: IApi = {
    code: 'CUSTOMER_API',
    name: 'Customer Management',
    regexUrl: 'customer/**',
    baseUrl: 'http://localhost:8082/api-rest-customer/service',
    icon: { icon: 'address-card', pack: 'fa' },
    version: '1.0.0',
    id: '5d7660cd738fbc23b43a857f',
};

export const MockApi = {
    user: MockApiUser,
    customer: MockApiCustomer,
};
