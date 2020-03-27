import {IModule} from '../../data/system/module';
import {MockApiCustomer, MockApiOrganization, MockApiUser, MockApiWarehouseItem} from './mock.api';
import {IdGenerators} from '../../../config/generator.config';

export const MockModuleUser: IModule = {
    code: 'USER_MODULE',
    name: 'system.user.menu',
    apiId: MockApiUser.id,
    api: MockApiUser,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleCustomer: IModule = {
    code: 'CUSTOMER_MODULE',
    name: 'system.customer.menu',
    apiId: MockApiCustomer.id,
    api: MockApiCustomer,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleOrganization: IModule = {
    code: 'ORGANIZATION_MODULE',
    name: 'system.organization.menu',
    apiId: MockApiOrganization.id,
    api: MockApiOrganization,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleSystem: IModule = {
    code: 'SYSTEM',
    name: 'system.menu',
    apiId: null,
    api: null,
    id: IdGenerators.oid.generate(),
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
    apiId: MockApiWarehouseItem.id,
    api: MockApiWarehouseItem,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleWarehouse: IModule = {
    code: 'WAREHOUSE',
    name: 'warehouse.menu',
    apiId: null,
    api: null,
    id: IdGenerators.oid.generate(),
    icon: {icon: 'cog', pack: 'fa'},
    children: [
        MockModuleWarehouseItem,
    ],
};

export const MockModule = {
    system: MockModuleSystem,
    warehouse: MockModuleWarehouse,
};
