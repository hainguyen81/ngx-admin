import BaseModel, {IModel} from '../base';
import {IWarehouseItem} from './warehouse.item';
import {IWarehouse} from './warehouse';

export interface IWarehouseManagement extends IModel {
    item_id?: string | null;
    item_code?: string | null;
    item?: IWarehouseItem | null;
    warehouse_id?: string | null;
    warehouse_code?: string | null;
    warehouse?: IWarehouse | null;
    object_id?: string | null;
    object_code?: string | null;
    object?: IModel | null;
    quantity?: number | null;
}

export class WarehouseManagement extends BaseModel {
    constructor(public id: string) {
        super(id);
    }
}
