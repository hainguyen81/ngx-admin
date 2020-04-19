import BaseModel, {IModel} from '../base';
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

export default class WarehouseOrderDetail extends BaseModel implements IWarehouseOrderDetail {
    constructor(public id: string, public quantity: number, public unit_price: number, public amount: number) {
        super(id);
    }
}
