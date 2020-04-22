export namespace Constants {
    export namespace WarehouseConstants {
        export namespace WarehouseItemConstants {
            export const enum ITEM_STATUS {
                NOT_ACTIVATED,
                ACTIVATED,
                LOCKED,
            }

            export function convertItemStatusToDisplay(value: ITEM_STATUS): string {
                switch (value) {
                    case ITEM_STATUS.ACTIVATED:
                        return 'common.enum.warehouseItemStatus.activated';
                    case ITEM_STATUS.LOCKED:
                        return 'common.enum.warehouseItemStatus.locked';
                    default:
                        return 'common.enum.warehouseItemStatus.notActivated';
                }
            }
        }
    }
}
