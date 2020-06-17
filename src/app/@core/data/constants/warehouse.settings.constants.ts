export namespace Constants {
    export namespace WarehouseSettingsConstants {
        export enum WAREHOUSE_SETTINGS_TYPE {
            BRAND_SETTINGS = 'common.enum.warehouseSettings.brand.name',
            ITEM_SETTINGS = 'common.enum.warehouseSettings.item.name',
            STORAGE_SETTINGS = 'common.enum.warehouseSettings.storage.name',
            OTHERS = 'common.enum.warehouseSettings.others.name',
        }

        export function convertWarehouseSettingsTypeToDisplay(value: WAREHOUSE_SETTINGS_TYPE): string {
            switch (value) {
                case WAREHOUSE_SETTINGS_TYPE.BRAND_SETTINGS:
                    return 'common.enum.warehouseSettings.brand.name';
                case WAREHOUSE_SETTINGS_TYPE.ITEM_SETTINGS:
                    return 'common.enum.warehouseSettings.item.name';
                case WAREHOUSE_SETTINGS_TYPE.STORAGE_SETTINGS:
                    return 'common.enum.warehouseSettings.storage.name';
                default:
                    return 'common.enum.warehouseSettings.others.name';
            }
        }
    }
}
