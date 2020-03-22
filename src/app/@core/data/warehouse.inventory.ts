import {IModel} from './base';
import {IWarehouse} from './warehouse';
import {ICustomer} from './customer';

export const enum WAREHOUSE_INVENTORY_TYPE {
    // Nhập
    IN,
    // Xuất
    OUT,
}

export const enum WAREHOUSE_INVENTORY_STATUS {
    // Chưa hoàn thành
    UNFINISHED,
    // Hoàn thành
    FINISHED,
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

export interface IWarehouseInventory extends IModel {
    // Mã phiếu
    code: string;
    // 0: IN ; 1 : OUT
    type: WAREHOUSE_INVENTORY_TYPE | WAREHOUSE_INVENTORY_TYPE.IN;
    // Ngày nhập xuất
    date: number;
    // Lý do xuất kho
    reason_for_issuing: string;
    // Tổng tiền
    total_amount: number;
    // Người giao hàng
    deliverer?: string | null;
    // Ghi chú
    remark?: string | null;
    // Tình trạng phiếu
    status: WAREHOUSE_INVENTORY_STATUS | WAREHOUSE_INVENTORY_STATUS.UNFINISHED;
    // Tập tin đính kèm
    file_attach?: string | null;

    // foreign keys
    // Mã kho
    warehouse_id?: string | null;
    warehouse?: IWarehouse | null;
    // Mã nhà cung cấp
    vendor_id?: string | null;
    vendor?: ICustomer | null;
    // Mã khách hàng
    customer_id?: string | null;
    customer?: ICustomer | null;
}

export default class WarehouseInventory implements IWarehouseInventory {
    constructor(public id: string,
                public code: string,
                public type: WAREHOUSE_INVENTORY_TYPE | WAREHOUSE_INVENTORY_TYPE.IN,
                public date: number,
                public reason_for_issuing: string,
                public total_amount: number,
                public status: WAREHOUSE_INVENTORY_STATUS | WAREHOUSE_INVENTORY_STATUS.UNFINISHED,
                public deliverer?: string | null,
                public remark?: string | null,
                public file_attach?: string | null,
                public warehouse_id?: string | null,
                public warehouse?: IWarehouse | null,
                public vendor_id?: string | null,
                public vendor?: ICustomer | null,
                public customer_id?: string | null,
                public customer?: ICustomer | null) {
    }
}
