import {IModel} from './base';
import {IWarehouseItem} from './warehouse.item';
import {IWarehouseOrder} from './warehouse.order';

export interface IWarehouseOrderDetail extends IModel {
    // Số lượng
    quantity: number;
    // Đơn giá
    unit_price: number;
    // Thành tiền
    amount: number;
    // Ghi chú
    remark?: string | null;

    // foreign keys
    order_id?: string | null;
    order?: IWarehouseOrder | null;
    item_id?: string | null;
    item?: IWarehouseItem | null;
}

export default class WarehouseOrderDetail implements IWarehouseOrderDetail {
    constructor(public id: string,
                public quantity: number,
                public unit_price: number,
                public amount: number,
                public remark?: string | null,
                public order_id?: string | null,
                public order?: IWarehouseOrder | null,
                public item_id?: string | null,
                public item?: IWarehouseItem | null) {
    }
}
