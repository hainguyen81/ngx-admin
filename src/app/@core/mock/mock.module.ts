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

export const MockModuleSystem: IModule = {
    code: 'SYSTEM',
    name: 'Hệ thống',
    apiId: '',
    api: null,
    id: '',
    children: [MockModuleUser],
};

export const MockModule = {
    system: MockModuleSystem,
};
