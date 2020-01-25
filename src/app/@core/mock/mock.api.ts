import {IApi} from '../data/api';

export const MockApiUser: IApi = {
    code: 'USER_API',
    name: 'User Management',
    regexUrl: 'user/**',
    baseUrl: 'http://localhost:8082/api-rest-user/service',
    icon: 'home-outline',
    version: '1.0.0',
    id: '5d7660cd738fbc23b43a857e',
};

export const MockApi = {
    user: MockApiUser,
};
