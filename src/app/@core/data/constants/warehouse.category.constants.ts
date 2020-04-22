export namespace Constants {
    export namespace WarehouseConstants {
        export namespace WarehouseCategoryConstants {
            export const enum CATEGORY_TYPE {
                // Chủng loại
                CATEGORY,
                // Loại
                TYPE,
                // Hãng sản xuất
                BRAND,
            }

            export const enum CATEGORY_STATUS {
                NOT_ACTIVATED,
                ACTIVATED,
                LOCKED,
            }

            export function convertWarehouseCategoryTypeToDisplay(value: CATEGORY_TYPE): string {
                switch (value) {
                    case CATEGORY_TYPE.TYPE:
                        return 'common.enum.warehouseCategoryType.type';
                    case CATEGORY_TYPE.BRAND:
                        return 'common.enum.warehouseCategoryType.brand';
                    default:
                        return 'common.enum.warehouseCategoryType.category';
                }
            }

            export function convertWarehouseCategoryStatusToDisplay(value: CATEGORY_STATUS): string {
                switch (value) {
                    case CATEGORY_STATUS.ACTIVATED:
                        return 'common.enum.warehouseCategoryStatus.activated';
                    case CATEGORY_STATUS.LOCKED:
                        return 'common.enum.warehouseCategoryStatus.locked';
                    default:
                        return 'common.enum.warehouseCategoryStatus.notActivated';
                }
            }
        }
    }
}
