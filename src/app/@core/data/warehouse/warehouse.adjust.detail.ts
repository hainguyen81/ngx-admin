import {IModel} from '../base';
import {IWarehouseAdjust} from './warehouse.adjust';
import {IWarehouseItem} from './warehouse.item';

export interface IWarehouseAdjustDetail extends IModel {
    // Số lượng
    quality: number;

    // foreign keys
    item_id?: string | null;
    item?: IWarehouseItem | null;
    adjust_id?: string | null;
    adjust?: IWarehouseAdjust | null;
}

export default class WarehouseAdjustDetail implements IWarehouseAdjustDetail {
    constructor(public id: string,
                public quality: number,
                public item_id?: string | null,
                public item?: IWarehouseItem | null,
                public adjust_id?: string | null,
                public adjust?: IWarehouseAdjust | null) {
    }
}
