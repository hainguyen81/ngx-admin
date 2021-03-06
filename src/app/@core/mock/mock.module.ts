import {IModule} from '../data/module';
import {MockApiCustomer, MockApiOrganization, MockApiUser} from './mock.api';

export const MockModuleUser: IModule = {
    code: 'USER_MODULE',
    name: 'system.user.menu',
    apiId: '',
    api: MockApiUser,
    id: '',
    children: [],
};

export const MockModuleCustomer: IModule = {
    code: 'CUSTOMER_MODULE',
    name: 'system.customer.menu',
    apiId: '',
    api: MockApiCustomer,
    id: '',
    children: [],
};

export const MockModuleOrganization: IModule = {
    code: 'ORGANIZATION_MODULE',
    name: 'system.organization.menu',
    apiId: '',
    api: MockApiOrganization,
    id: '',
    children: [],
};

export const MockModuleSystem: IModule = {
    code: 'SYSTEM',
    name: 'system.menu',
    apiId: '',
    api: null,
    id: '',
    icon: {icon: 'cog', pack: 'fa'},
    children: [
        MockModuleOrganization,
        MockModuleUser,
        MockModuleCustomer,
    ],
};

export const MockModule = {
    system: MockModuleSystem,
};
