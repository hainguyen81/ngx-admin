import {IModel} from './base';
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

export default class WarehouseInventoryDetail implements IWarehouseInventoryDetail {
    constructor(public id: string,
                public quantity_orders: number,
                public quantity_actually: number,
                public unit_price: number,
                public amount: number,
                public remark?: string | null,
                public inventory_id?: string | null,
                public inventory?: IWarehouseInventory | null,
                public item_id?: string | null,
                public item?: IWarehouseItem | null) {
    }
}
