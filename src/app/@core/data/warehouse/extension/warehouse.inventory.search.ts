import BaseModel, {IModel} from '../../base';
import {IWarehouse} from '../warehouse';
import {ICustomer} from '../../system/customer';

export interface IWarehouseInventorySearch extends IModel {
    warehouse_id?: string | null;
    warehouse?: IWarehouse | null;
    from?: string | null;
    to?: string | null;
    custom_id?: string | null;
    customer?: ICustomer | null;
    type?: string | null;
    keyword?: string | null;
}

export default class WarehouseInventorySearch extends BaseModel implements IWarehouseInventorySearch {
    constructor(public id: string) {
        super(id);
    }
}
