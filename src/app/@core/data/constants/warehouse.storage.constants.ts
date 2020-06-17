export namespace Constants {
    export namespace WarehouseStorageConstants {
        export enum WAREHOUSE_STORAGE_TYPE {
            STORAGE = 'common.enum.warehouseStorage.storage',
            FLOOR = 'common.enum.warehouseStorage.floor',
            SHELVES = 'common.enum.warehouseStorage.shelves',
            COMPARTMENT = 'common.enum.warehouseStorage.compartment',
            OTHERS = 'common.enum.warehouseStorage.others',
        }

        export function convertWarehouseTypeToDisplay(value: WAREHOUSE_STORAGE_TYPE): string {
            switch (value) {
                case WAREHOUSE_STORAGE_TYPE.STORAGE:
                    return 'common.enum.warehouseStorage.storage';
                case WAREHOUSE_STORAGE_TYPE.FLOOR:
                    return 'common.enum.warehouseStorage.floor';
                case WAREHOUSE_STORAGE_TYPE.SHELVES:
                    return 'common.enum.warehouseStorage.shelves';
                case WAREHOUSE_STORAGE_TYPE.COMPARTMENT:
                    return 'common.enum.warehouseStorage.compartment';
                default:
                    return 'common.enum.warehouseStorage.others';
            }
        }
    }
}
