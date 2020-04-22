export namespace Constants {
    export namespace WarehouseConstants {
        export namespace WarehouseOrderConstants {
            export const enum WAREHOUSE_ORDER_STATUS {
                DRAFT,
                CONFIRMED,
                SHIPPED,
                DELIVERED,
                CLOSED,
            }

            export const enum WAREHOUSE_ORDER_TYPE {
                PURCHASE,
                SALE,
            }

            export function convertWareHouseOrderStatusToDisplay(value: WAREHOUSE_ORDER_STATUS): string {
                switch (value) {
                    case WAREHOUSE_ORDER_STATUS.CONFIRMED:
                        return 'common.enum.warehouseOrderStatus.confirmed';
                    case WAREHOUSE_ORDER_STATUS.SHIPPED:
                        return 'common.enum.warehouseOrderStatus.shipped';
                    case WAREHOUSE_ORDER_STATUS.DELIVERED:
                        return 'common.enum.warehouseOrderStatus.delivered';
                    case WAREHOUSE_ORDER_STATUS.CLOSED:
                        return 'common.enum.warehouseOrderStatus.closed';
                    default:
                        return 'common.enum.warehouseOrderStatus.draft';
                }
            }

            export function convertWareHouseOrderTypeToDisplay(value: WAREHOUSE_ORDER_TYPE): string {
                switch (value) {
                    case WAREHOUSE_ORDER_TYPE.PURCHASE:
                        return 'common.enum.warehouseOrderType.purchase';
                    default:
                        return 'common.enum.warehouseOrderType.sale';
                }
            }
        }
    }
}
