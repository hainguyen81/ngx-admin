export namespace Constants {
    export namespace WarehouseStorageConstants {
        export enum STORAGE_TYPE {
            STORAGE = 'common.enum.warehouseStorage.storage',
            FLOOR = 'common.enum.warehouseStorage.floor',
            SHELVES = 'common.enum.warehouseStorage.shelves',
            COMPARTMENT = 'common.enum.warehouseStorage.compartment',
            OTHERS = 'common.enum.warehouseStorage.others',
        }

        export function convertWarehouseTypeToDisplay(value: STORAGE_TYPE): string {
            switch (value) {
                case STORAGE_TYPE.STORAGE:
                    return 'common.enum.warehouseStorage.storage';
                case STORAGE_TYPE.FLOOR:
                    return 'common.enum.warehouseStorage.floor';
                case STORAGE_TYPE.SHELVES:
                    return 'common.enum.warehouseStorage.shelves';
                case STORAGE_TYPE.COMPARTMENT:
                    return 'common.enum.warehouseStorage.compartment';
                default:
                    return 'common.enum.warehouseStorage.others';
            }
        }
    }
}
