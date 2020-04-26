export namespace Constants {
    export namespace WarehouseSettingsConstants {
        export enum WAREHOUSE_SETTINGS_TYPE {
            ITEM_SETTINGS = 'common.enum.warehouseSettings.item.name',
            OTHERS = 'common.enum.warehouseSettings.others.name',
        }

        export function convertWarehouseSettingsTypeToDisplay(value: WAREHOUSE_SETTINGS_TYPE): string {
            switch (value) {
                case WAREHOUSE_SETTINGS_TYPE.ITEM_SETTINGS:
                    return 'common.enum.warehouseSettings.item.name';
                default:
                    return 'common.enum.warehouseSettings.others.name';
            }
        }
    }
}
