import BaseModel, {IModel} from '../base';
import {IWarehouseInventory} from './warehouse.inventory';
import {IWarehouseItem} from './warehouse.item';

export interface IWarehouseInventoryDetail extends IModel {
    // Số lượng theo chứng từ
    quantity_orders: number;
    // Số lượng thực tế nhập
    quantity_actually: number;
    // Đơn giá
    unit_price: number;
    // Thành tiền
    amount: number;
    // Ghi chú
    remark?: string | null;
    // Lô hàng
    batches?: { batch_id: string; batch_code: string; quantity?: number | 0 }[] | null;
    // series
    series?: string[] | null;
    // storage
    storage?: { warehouse_id: string; warehouse_code: string; quantity?: number | 0 }[] | null;

    // foreign keys
    inventory_id?: string | null;
    inventory_code?: string | null;
    inventory?: IWarehouseInventory | null;
    item_id?: string | null;
    item_code?: string | null;
    item?: IWarehouseItem | null;
}

export default class WarehouseInventoryDetail extends BaseModel implements IWarehouseInventoryDetail {
    constructor(public id: string, public quantity_orders: number, public quantity_actually: number,
                public unit_price: number, public amount: number) {
        super(id);
    }
}
