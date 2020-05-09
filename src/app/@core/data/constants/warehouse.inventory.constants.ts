export namespace Constants {
    export namespace WarehouseConstants {
        export namespace WarehouseInventoryConstants {
            export enum WAREHOUSE_INVENTORY_TYPE {
                // Nhập
                IN = 'common.enum.warehouseInventoryType.in',
                // Xuất
                OUT = 'common.enum.warehouseInventoryType.out',
            }

            export enum WAREHOUSE_INVENTORY_STATUS {
                // Chưa hoàn thành
                UNFINISHED = 'common.enum.warehouseInventoryStatus.finished',
                // Hoàn thành
                FINISHED = 'common.enum.warehouseInventoryStatus.unfinished',
            }

            export function convertWareHouseInventoryTypeToDisplay(value: WAREHOUSE_INVENTORY_TYPE): string {
                switch (value) {
                    case WAREHOUSE_INVENTORY_TYPE.IN:
                        return 'common.enum.warehouseInventoryType.in';
                    default:
                        return 'common.enum.warehouseInventoryType.out';
                }
            }

            export function convertWareHouseInventoryStatusToDisplay(value: WAREHOUSE_INVENTORY_STATUS): string {
                switch (value) {
                    case WAREHOUSE_INVENTORY_STATUS.FINISHED:
                        return 'common.enum.warehouseInventoryStatus.finished';
                    default:
                        return 'common.enum.warehouseInventoryStatus.unfinished';
                }
            }
        }
    }
}
