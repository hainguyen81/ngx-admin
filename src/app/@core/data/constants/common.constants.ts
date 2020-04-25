import {API} from '../../../config/api.config';

export namespace Constants {
    export namespace COMMON {

        export const MODULE_CODES: any = {
            SYSTEM: API.system.code.call(undefined),
            SYSTEM_SETTINGS: API.system.children.generalSettings.code.call(undefined),
            SYSTEM_USER: API.system.children.user.code.call(undefined),
            SYSTEM_CUSTOMER: API.system.children.customer.code.call(undefined),
            SYSTEM_ORGANIZATION: API.system.children.organization.code.call(undefined),
            WAREHOUSE: API.warehouse.code.call(undefined),
            WAREHOUSE_SETTINGS: API.warehouse.children.settings.code.call(undefined),
            WAREHOUSE_SETTINGS_GENERAL:
                API.warehouse.children.settings.children.warehouseSettings.code.call(undefined),
            WAREHOUSE_SETTINGS_STORAGE:
                API.warehouse.children.settings.children.warehouseStorage.code.call(undefined),
            WAREHOUSE_SETTINGS_CATEGORY:
                API.warehouse.children.settings.children.warehouseCategory.code.call(undefined),
            WAREHOUSE_FEATURES: API.warehouse.children.features.code.call(undefined),
            WAREHOUSE_FEATURES_ITEM:
                API.warehouse.children.features.children.warehouseItem.code.call(undefined),
        };

        export const BUILTIN_CODES: any = {
            // customer
            CUSTOMER_STATUS: { code: 'CUSTOMER_STATUS', name: 'common.enum.customerStatus.name' },
            CUSTOMER_LEVEL: { code: 'CUSTOMER_LEVEL', name: 'common.enum.customerLevel.name' },
            CUSTOMER_TYPE: { code: 'CUSTOMER_TYPE', name: 'common.enum.customerType.name' },
            // organization
            ORGANIZATION_TYPE: { code: 'ORGANIZATION_TYPE', name: 'common.enum.organizationType.name' },
        };
    }
}
