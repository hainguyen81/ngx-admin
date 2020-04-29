export namespace Constants {
    export namespace WarehouseConstants {
        export namespace WarehouseCategoryConstants {
            export enum CATEGORY_TYPE {
                // Chủng loại
                CATEGORY = 'common.enum.warehouseCategoryType.category',
                // Loại
                TYPE = 'common.enum.warehouseCategoryType.type',
            }

            export function convertWarehouseCategoryTypeToDisplay(value: CATEGORY_TYPE): string {
                switch (value) {
                    case CATEGORY_TYPE.TYPE:
                        return 'common.enum.warehouseCategoryType.type';
                    default:
                        return 'common.enum.warehouseCategoryType.category';
                }
            }
        }
    }
}
