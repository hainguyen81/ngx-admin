export namespace Constants {
    export namespace WarehouseSettingsConstants {
        export const enum SETTINGS_TYPE {
            STATUS,
            BRAND,
            COLOR,
            SIZE,
            MATERIAL,
            OTHERS,
        }

        export function convertWarehouseSettingsTypeToDisplay(value: SETTINGS_TYPE): string {
            switch (value) {
                case SETTINGS_TYPE.STATUS:
                    return 'common.enum.warehouseSettings.status';
                case SETTINGS_TYPE.BRAND:
                    return 'common.enum.warehouseSettings.brand';
                case SETTINGS_TYPE.COLOR:
                    return 'common.enum.warehouseSettings.color';
                case SETTINGS_TYPE.SIZE:
                    return 'common.enum.warehouseSettings.size';
                case SETTINGS_TYPE.MATERIAL:
                    return 'common.enum.warehouseSettings.material';
                default:
                    return 'common.enum.warehouseSettings.others';
            }
        }
    }
}
