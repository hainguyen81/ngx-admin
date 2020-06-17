import {API} from '../../../config/api.config';

export namespace Constants {
    export namespace COMMON {

        export enum STATUS {
            NOT_ACTIVATED = 'common.enum.status.notActivated',
            ACTIVATED = 'common.enum.status.activated',
            LOCKED = 'common.enum.status.locked',
        }

        export enum CURRENCY {
            USD = 'common.enum.currency.usd',
            VND = 'common.enum.currency.vnd',
            OTHERS = 'common.enum.currency.others',
        }

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
            WAREHOUSE_SETTINGS_BATCH:
                API.warehouse.children.settings.children.warehouseBatchNo.code.call(undefined),
            WAREHOUSE_FEATURES: API.warehouse.children.features.code.call(undefined),
            WAREHOUSE_FEATURES_ITEM:
                API.warehouse.children.features.children.warehouseItem.code.call(undefined),
            WAREHOUSE_FEATURES_INVENTORY:
                API.warehouse.children.features.children.warehouseInventory.code.call(undefined),
        };

        export const BUILTIN_CODES: any = {
            // common
            STATUS: { code: 'STATUS', name: 'common.enum.status.name' },
            CURRENCY: { code: 'CURRENCY', name: 'common.enum.currency.name' },
            // customer
            CUSTOMER_LEVEL: { code: 'CUSTOMER_LEVEL', name: 'common.enum.customerLevel.name' },
            CUSTOMER_TYPE: { code: 'CUSTOMER_TYPE', name: 'common.enum.customerType.name' },
            // organization
            ORGANIZATION_TYPE: { code: 'ORGANIZATION_TYPE', name: 'common.enum.organizationType.name' },
            // warehouse settings
            WAREHOUSE_SETTINGS_TYPE: {
                code: 'WAREHOUSE_SETTINGS_TYPE',
                name: 'common.enum.warehouseSettingsType.name',
            },
            // warehouse category
            WAREHOUSE_CATEGORY_TYPE: { code: 'CATEGORY_TYPE', name: 'common.enum.warehouseSettings.category.name' },
            // warehouse storage
            WAREHOUSE_STORAGE_TYPE: { code: 'STORAGE_TYPE', name: 'common.enum.warehouseSettings.storage.name' },
            // warehouse inventory type
            WAREHOUSE_INVENTORY_TYPE: {
                code: 'INVENTORY_TYPE',
                name: 'common.enum.warehouseSettings.inventory.type.name',
            },
            // warehouse inventory status
            WAREHOUSE_INVENTORY_STATUS: {
                code: 'INVENTORY_STATUS',
                name: 'common.enum.warehouseSettings.inventory.status.name',
            },
        };
    }
}
