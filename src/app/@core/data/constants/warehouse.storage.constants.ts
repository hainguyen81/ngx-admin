export namespace Constants {
    export namespace WarehouseStorageConstants {
        export enum WAREHOUSE_STORAGE_TYPE {
            STORAGE = 0,
            FLOOR = 1,
            SHELVES = 2,
            COMPARTMENT = 3,
        }

        export function convertWarehouseTypeToDisplay(value: WAREHOUSE_STORAGE_TYPE): string {
            switch (value) {
                case WAREHOUSE_STORAGE_TYPE.STORAGE:
                    return 'common.enum.warehouseStorage.storage.name';
                case WAREHOUSE_STORAGE_TYPE.FLOOR:
                    return 'common.enum.warehouseStorage.floor.name';
                case WAREHOUSE_STORAGE_TYPE.SHELVES:
                    return 'common.enum.warehouseStorage.shelves.name';
                case WAREHOUSE_STORAGE_TYPE.COMPARTMENT:
                    return 'common.enum.warehouseStorage.compartment.name';
                default:
                    return undefined;
            }
        }
    }
}
