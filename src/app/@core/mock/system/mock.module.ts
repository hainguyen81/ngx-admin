import {IModule} from '../../data/system/module';
import {MockApiCustomer, MockApiOrganization, MockApiUser, MockApiWarehouseItem} from './mock.api';

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

export const MockModuleWarehouseItem: IModule = {
    code: 'WAREHOUSE_ITEM_MODULE',
    name: 'warehouse.item.menu',
    apiId: '',
    api: MockApiWarehouseItem,
    id: '',
    children: [],
};

export const MockModuleWarehouse: IModule = {
    code: 'WAREHOUSE',
    name: 'warehouse.menu',
    apiId: '',
    api: null,
    id: '',
    icon: {icon: 'cog', pack: 'fa'},
    children: [
        MockModuleWarehouseItem,
    ],
};

export const MockModule = {
    system: MockModuleSystem,
};
