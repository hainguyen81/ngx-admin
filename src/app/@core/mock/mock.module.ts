import {IModule} from '../data/module';
import {MockApiUser} from './mock.api';

export const MockModuleUser: IModule = {
    code: 'USER_MODULE',
    name: 'Danh sách người dùng',
    apiId: '',
    api: MockApiUser,
    id: '',
    children: [],
};

export const MockModuleCustomer: IModule = {
    code: 'CUSTOMER_MODULE',
    name: 'Danh sách KH',
    apiId: '',
    api: MockApiUser,
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
