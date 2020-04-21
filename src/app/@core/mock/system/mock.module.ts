import {IModule} from '../../data/system/module';
import {
    MockApiCustomer,
    MockApiOrganization,
    MockApiUser,
    MockApiWarehouseCategory,
    MockApiWarehouseItem, MockApiWarehouseStorage,
} from './mock.api';
import {IdGenerators} from '../../../config/generator.config';

// -------------------------------------------------
// SYSTEM
// -------------------------------------------------

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
    code: 'SYSTEM_MODULE',
    name: 'system.menu.module',
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

// -------------------------------------------------
// WAREHOUSE
// -------------------------------------------------

export const MockModuleWarehouseStorage: IModule = {
    code: 'WAREHOUSE_STORAGE_MODULE',
    name: 'warehouse.storage.menu',
    apiId: MockApiWarehouseStorage.id,
    api: MockApiWarehouseStorage,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleWarehouseCategory: IModule = {
    code: 'WAREHOUSE_CATEGORY_MODULE',
    name: 'warehouse.category.menu',
    apiId: MockApiWarehouseCategory.id,
    api: MockApiWarehouseCategory,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleWarehouseItem: IModule = {
    code: 'WAREHOUSE_ITEM_MODULE',
    name: 'warehouse.item.menu',
    apiId: MockApiWarehouseItem.id,
    api: MockApiWarehouseItem,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleWarehouseMaster: IModule = {
    code: 'WAREHOUSE_MASTER_MODULE',
    name: 'warehouse.menu.master',
    apiId: null,
    api: null,
    id: IdGenerators.oid.generate(),
    icon: {icon: 'cog', pack: 'fas'},
    children: [
        MockModuleWarehouseStorage,
        MockModuleWarehouseCategory,
    ],
};

export const MockModuleWarehouseFeatures: IModule = {
    code: 'WAREHOUSE_MODULE',
    name: 'warehouse.menu.features',
    apiId: null,
    api: null,
    id: IdGenerators.oid.generate(),
    icon: {icon: 'briefcase', pack: 'fas'},
    children: [
        MockModuleWarehouseItem,
    ],
};

export const MockModuleWarehouse: IModule = {
    code: 'WAREHOUSE_MODULE',
    name: 'warehouse.menu.module',
    apiId: null,
    api: null,
    id: IdGenerators.oid.generate(),
    icon: {icon: 'warehouse', pack: 'fas'},
    children: [
        MockModuleWarehouseMaster,
        MockModuleWarehouseFeatures,
    ],
};

// -------------------------------------------------
// SUMMARY
// -------------------------------------------------

export const MockModule = {
    system: MockModuleSystem,
    warehouse: MockModuleWarehouse,
};
