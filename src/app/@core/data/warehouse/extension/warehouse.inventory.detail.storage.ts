import {IModel} from '../../base';
import {IWarehouseInventoryDetail} from '../warehouse.inventory.detail';
import {IWarehouse} from '../warehouse';

export interface IWarehouseInventoryDetailStorage extends IModel {
    storage_id?: string | null;
    storage_code?: string | null;
    storage_name?: string | null;
    storage?: IWarehouse | null;
    viewStorage?: string | null;
    quantity?: number | 0;
    inventory_detail_id?: string | null;
    inventory_detail?: IWarehouseInventoryDetail | null;
}
