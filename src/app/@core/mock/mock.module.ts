import {IModule} from '../data/module';
import {MockApiCustomer, MockApiUser} from './mock.api';

export const MockModuleUser: IModule = {
    code: 'USER_MODULE',
    name: 'Người dùng',
    apiId: '',
    api: MockApiUser,
    id: '',
    children: [],
};

export const MockModuleCustomer: IModule = {
    code: 'CUSTOMER_MODULE',
    name: 'Khách hàng',
    apiId: '',
    api: MockApiCustomer,
    id: '',
    children: [],
};

export const MockModuleSystem: IModule = {
    code: 'SYSTEM',
    name: 'Hệ thống',
    apiId: '',
    api: null,
    id: '',
    children: [MockModuleUser, MockModuleCustomer],
};

export const MockModule = {
    system: MockModuleSystem,
};
