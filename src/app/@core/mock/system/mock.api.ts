import {IApi} from '../../data/system/api';
import {IdGenerators} from '../../../config/generator.config';
import {API} from '../../../config/api.config';

// -------------------------------------------------
// API SYSTEM
// -------------------------------------------------

export const MockApiSystem: IApi = {
    code: API.system.code.call(undefined),
    name: API.system.name.call(undefined),
    regexUrl: API.system.api.regexUrl,
    baseUrl: API.system.api.url.call(undefined),
    icon: API.system.client.icon,
    version: API.system.api.version,
    id: IdGenerators.oid.generate(),
};

    export const MockApiSystemGeneralSettings: IApi = {
        code: API.system.children.generalSettings.code.call(undefined),
        name: API.system.children.generalSettings.name.call(undefined),
        regexUrl: API.system.children.generalSettings.api.regexUrl,
        baseUrl: API.system.children.generalSettings.api.url.call(undefined),
        icon: API.system.children.generalSettings.client.icon,
        version: API.system.children.generalSettings.api.version,
        id: IdGenerators.oid.generate(),
    };

    export const MockApiSystemUser: IApi = {
        code: API.system.children.user.code.call(undefined),
        name: API.system.children.user.name.call(undefined),
        regexUrl: API.system.children.user.api.regexUrl,
        baseUrl: API.system.children.user.api.url.call(undefined),
        icon: API.system.children.user.client.icon,
        version: API.system.children.user.api.version,
        id: IdGenerators.oid.generate(),
    };

    export const MockApiSystemCustomer: IApi = {
        code: API.system.children.customer.code.call(undefined),
        name: API.system.children.customer.name.call(undefined),
        regexUrl: API.system.children.customer.api.regexUrl,
        baseUrl: API.system.children.customer.api.url.call(undefined),
        icon: API.system.children.customer.client.icon,
        version: API.system.children.customer.api.version,
        id: IdGenerators.oid.generate(),
    };

    export const MockApiSystemOrganization: IApi = {
        code: API.system.children.organization.code.call(undefined),
        name: API.system.children.organization.name.call(undefined),
        regexUrl: API.system.children.organization.api.regexUrl,
        baseUrl: API.system.children.organization.api.url.call(undefined),
        icon: API.system.children.organization.client.icon,
        version: API.system.children.organization.api.version,
        id: IdGenerators.oid.generate(),
    };

// -------------------------------------------------
// API WAREHOUSE
// -------------------------------------------------

export const MockApiWarehouse: IApi = {
    code: API.warehouse.code.call(undefined),
    name: API.warehouse.name.call(undefined),
    regexUrl: API.warehouse.api.regexUrl,
    baseUrl: API.warehouse.api.url.call(undefined),
    icon: API.warehouse.client.icon,
    version: API.warehouse.api.version,
    id: IdGenerators.oid.generate(),
};

    export const MockApiWarehouseSettings: IApi = {
        code: API.warehouse.children.settings.code.call(undefined),
        name: API.warehouse.children.settings.name.call(undefined),
        regexUrl: API.warehouse.children.settings.api.regexUrl,
        baseUrl: API.warehouse.children.settings.api.url.call(undefined),
        icon: API.warehouse.children.settings.client.icon,
        version: API.warehouse.children.settings.api.version,
        id: IdGenerators.oid.generate(),
    };

        export const MockApiWarehouseSettingsGeneral: IApi = {
            code: API.warehouse.children.settings.children.warehouseSettings.code.call(undefined),
            name: API.warehouse.children.settings.children.warehouseSettings.name.call(undefined),
            regexUrl: API.warehouse.children.settings.children.warehouseSettings.api.regexUrl,
            baseUrl: API.warehouse.children.settings.children.warehouseSettings.api.url.call(undefined),
            icon: API.warehouse.children.settings.children.warehouseSettings.client.icon,
            version: API.warehouse.children.settings.children.warehouseSettings.api.version,
            id: IdGenerators.oid.generate(),
        };

        export const MockApiWarehouseSettingsStorage: IApi = {
            code: API.warehouse.children.settings.children.warehouseStorage.code.call(undefined),
            name: API.warehouse.children.settings.children.warehouseStorage.name.call(undefined),
            regexUrl: API.warehouse.children.settings.children.warehouseStorage.api.regexUrl,
            baseUrl: API.warehouse.children.settings.children.warehouseStorage.api.url.call(undefined),
            icon: API.warehouse.children.settings.children.warehouseStorage.client.icon,
            version: API.warehouse.children.settings.children.warehouseStorage.api.version,
            id: IdGenerators.oid.generate(),
        };

        export const MockApiWarehouseSettingsCategory: IApi = {
            code: API.warehouse.children.settings.children.warehouseCategory.code.call(undefined),
            name: API.warehouse.children.settings.children.warehouseCategory.name.call(undefined),
            regexUrl: API.warehouse.children.settings.children.warehouseCategory.api.regexUrl,
            baseUrl: API.warehouse.children.settings.children.warehouseCategory.api.url.call(undefined),
            icon: API.warehouse.children.settings.children.warehouseCategory.client.icon,
            version: API.warehouse.children.settings.children.warehouseCategory.api.version,
            id: IdGenerators.oid.generate(),
        };

        export const MockApiWarehouseSettingsBatchNo: IApi = {
            code: API.warehouse.children.settings.children.warehouseBatchNo.code.call(undefined),
            name: API.warehouse.children.settings.children.warehouseBatchNo.name.call(undefined),
            regexUrl: API.warehouse.children.settings.children.warehouseBatchNo.api.regexUrl,
            baseUrl: API.warehouse.children.settings.children.warehouseBatchNo.api.url.call(undefined),
            icon: API.warehouse.children.settings.children.warehouseBatchNo.client.icon,
            version: API.warehouse.children.settings.children.warehouseBatchNo.api.version,
            id: IdGenerators.oid.generate(),
        };

    export const MockApiWarehouseFeatures: IApi = {
        code: API.warehouse.children.features.code.call(undefined),
        name: API.warehouse.children.features.name.call(undefined),
        regexUrl: API.warehouse.children.features.api.regexUrl,
        baseUrl: API.warehouse.children.features.api.url.call(undefined),
        icon: API.warehouse.children.features.client.icon,
        version: API.warehouse.children.features.api.version,
        id: IdGenerators.oid.generate(),
    };

        export const MockApiWarehouseFeaturesItem: IApi = {
            code: API.warehouse.children.features.children.warehouseItem.code.call(undefined),
            name: API.warehouse.children.features.children.warehouseItem.name.call(undefined),
            regexUrl: API.warehouse.children.features.children.warehouseItem.api.regexUrl,
            baseUrl: API.warehouse.children.features.children.warehouseItem.api.url.call(undefined),
            icon: API.warehouse.children.features.children.warehouseItem.client.icon,
            version: API.warehouse.children.features.children.warehouseItem.api.version,
            id: IdGenerators.oid.generate(),
        };

// -------------------------------------------------
// SUMMARY
// -------------------------------------------------

export const MockApi = {
    system: {
        settings: MockApiSystemGeneralSettings,
        user: MockApiSystemUser,
        customer: MockApiSystemCustomer,
        organization: MockApiSystemOrganization,
    },
    warehouse: {
        settings: {
            warehouseSettings: MockApiWarehouseSettingsGeneral,
            warehouseStorage: MockApiWarehouseSettingsStorage,
            warehouseCategory: MockApiWarehouseSettingsCategory,
        },
        features: {
            warehouseItem: MockApiWarehouseFeaturesItem,
        },
    },
};
