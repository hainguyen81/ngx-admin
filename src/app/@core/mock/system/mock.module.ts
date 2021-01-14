import {IModule} from '../../data/system/module';
import {
    MockApiSystem,
    MockApiSystemCustomer,
    MockApiSystemGeneralSettings,
    MockApiSystemOrganization,
    MockApiSystemUser,
    MockApiWarehouse,
    MockApiWarehouseFeatures,
    MockApiWarehouseFeaturesInventory,
    MockApiWarehouseFeaturesItem,
    MockApiWarehouseSettings,
    MockApiWarehouseSettingsBatchNo,
    MockApiWarehouseSettingsCategory,
    MockApiWarehouseSettingsGeneral,
    MockApiWarehouseSettingsStorage,
} from './mock.api';
import {IdGenerators} from '../../../config/generator.config';

// -------------------------------------------------
// SYSTEM
// -------------------------------------------------

export const MockModuleSystemGeneralSettings: IModule = {
    code: MockApiSystemGeneralSettings.code,
    name: MockApiSystemGeneralSettings.name,
    apiId: MockApiSystemGeneralSettings.id,
    api: MockApiSystemGeneralSettings,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleSystemUser: IModule = {
    code: MockApiSystemUser.code,
    name: MockApiSystemUser.name,
    apiId: MockApiSystemUser.id,
    api: MockApiSystemUser,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleSystemCustomer: IModule = {
    code: MockApiSystemCustomer.code,
    name: MockApiSystemCustomer.name,
    apiId: MockApiSystemCustomer.id,
    api: MockApiSystemCustomer,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleSystemOrganization: IModule = {
    code: MockApiSystemOrganization.code,
    name: MockApiSystemOrganization.name,
    apiId: MockApiSystemOrganization.id,
    api: MockApiSystemOrganization,
    id: IdGenerators.oid.generate(),
    children: [],
};

    export const MockModuleSystem: IModule = {
        code: MockApiSystem.code,
        name: MockApiSystem.name,
        apiId: MockApiSystem.id,
        api: MockApiSystem,
        id: IdGenerators.oid.generate(),
        children: [
            MockModuleSystemGeneralSettings,
            MockModuleSystemUser,
            MockModuleSystemCustomer,
            MockModuleSystemOrganization,
        ],
    };

// -------------------------------------------------
// WAREHOUSE
// -------------------------------------------------

export const MockModuleWarehouseSettingsGeneral: IModule = {
    code: MockApiWarehouseSettingsGeneral.code,
    name: MockApiWarehouseSettingsGeneral.name,
    apiId: MockApiWarehouseSettingsGeneral.id,
    api: MockApiWarehouseSettingsGeneral,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleWarehouseSettingsStorage: IModule = {
    code: MockApiWarehouseSettingsStorage.code,
    name: MockApiWarehouseSettingsStorage.name,
    apiId: MockApiWarehouseSettingsStorage.id,
    api: MockApiWarehouseSettingsStorage,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleWarehouseSettingsCategory: IModule = {
    code: MockApiWarehouseSettingsCategory.code,
    name: MockApiWarehouseSettingsCategory.name,
    apiId: MockApiWarehouseSettingsCategory.id,
    api: MockApiWarehouseSettingsCategory,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleWarehouseSettingsBatchNo: IModule = {
    code: MockApiWarehouseSettingsBatchNo.code,
    name: MockApiWarehouseSettingsBatchNo.name,
    apiId: MockApiWarehouseSettingsBatchNo.id,
    api: MockApiWarehouseSettingsBatchNo,
    id: IdGenerators.oid.generate(),
    children: [],
};

    export const MockModuleWarehouseSettings: IModule = {
        code: MockApiWarehouseSettings.code,
        name: MockApiWarehouseSettings.name,
        apiId: MockApiWarehouseSettings.id,
        api: MockApiWarehouseSettings,
        id: IdGenerators.oid.generate(),
        children: [
            MockModuleWarehouseSettingsGeneral,
            MockModuleWarehouseSettingsStorage,
            MockModuleWarehouseSettingsCategory,
            MockModuleWarehouseSettingsBatchNo,
        ],
    };

export const MockModuleWarehouseFeaturesItem: IModule = {
    code: MockApiWarehouseFeaturesItem.code,
    name: MockApiWarehouseFeaturesItem.name,
    apiId: MockApiWarehouseFeaturesItem.id,
    api: MockApiWarehouseFeaturesItem,
    id: IdGenerators.oid.generate(),
    children: [],
};

export const MockModuleWarehouseFeaturesInventory: IModule = {
    code: MockApiWarehouseFeaturesInventory.code,
    name: MockApiWarehouseFeaturesInventory.name,
    apiId: MockApiWarehouseFeaturesInventory.id,
    api: MockApiWarehouseFeaturesInventory,
    id: IdGenerators.oid.generate(),
    children: [],
};

    export const MockModuleWarehouseFeatures: IModule = {
        code: MockApiWarehouseFeatures.code,
        name: MockApiWarehouseFeatures.name,
        apiId: MockApiWarehouseFeatures.id,
        api: MockApiWarehouseFeatures,
        id: IdGenerators.oid.generate(),
        children: [
            MockModuleWarehouseFeaturesItem,
            MockModuleWarehouseFeaturesInventory,
        ],
    };

export const MockModuleWarehouse: IModule = {
    code: MockApiWarehouse.code,
    name: MockApiWarehouse.name,
    apiId: MockApiWarehouse.id,
    api: MockApiWarehouse,
    id: IdGenerators.oid.generate(),
    children: [
        MockModuleWarehouseSettings,
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
