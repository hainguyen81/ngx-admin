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

    // foreign keys
    inventory_id?: string | null;
    inventory?: IWarehouseInventory | null;
    item_id?: string | null;
    item?: IWarehouseItem | null;
}

export default class WarehouseInventoryDetail extends BaseModel implements IWarehouseInventoryDetail {
    constructor(public id: string, public quantity_orders: number, public quantity_actually: number,
                public unit_price: number, public amount: number) {
        super(id);
    }
}
