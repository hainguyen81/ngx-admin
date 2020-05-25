import BaseModel, {IModel} from '../base';
import {IWarehouse} from './warehouse';
import {ICustomer} from '../system/customer';
import {Constants} from '../constants/warehouse.inventory.constants';
import WAREHOUSE_INVENTORY_TYPE = Constants.WarehouseConstants.WarehouseInventoryConstants.WAREHOUSE_INVENTORY_TYPE;
import WAREHOUSE_INVENTORY_STATUS = Constants.WarehouseConstants.WarehouseInventoryConstants.WAREHOUSE_INVENTORY_STATUS;

export interface IWarehouseInventory extends IModel {
    // Mã phiếu
    code: string;
    // 0: IN ; 1 : OUT
    type: string;
    // Ngày nhập xuất
    date: string | null;
    // Lý do xuất kho
    reason_for_issuing: string;
    // Tổng tiền
    total_amount: number;
    // Người giao hàng
    deliverer?: string | null;
    // Ghi chú
    remark?: string | null;
    // Tình trạng phiếu
    status?: string | null;
    // Tập tin đính kèm
    file_attach?: string | string[] | null;
    // Mã phiếu mua hàng
    sales_order?: string | null;

    // foreign keys
    // Mã kho
    warehouse_id?: string | null;
    warehouse_code?: string | null;
    warehouse?: IWarehouse | null;
    // Mã nhà cung cấp/khách hàng
    vendor_customer_id?: string | null;
    vendor_customer_code?: string | null;
    vendor_customer?: ICustomer | null;
}

export default class WarehouseInventory extends BaseModel implements IWarehouseInventory {
    constructor(public id: string, public code: string, public type: string,
                public date: string | null, public reason_for_issuing: string, public total_amount: number) {
        super(id);
    }
}
