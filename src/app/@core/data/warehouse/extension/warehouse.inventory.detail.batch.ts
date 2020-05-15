import {IModel} from '../../base';
import {IWarehouseInventoryDetail} from '../warehouse.inventory.detail';
import {IWarehouseBatchNo} from '../warehouse.batch.no';

export interface IWarehouseInventoryDetailBatch extends IModel {
    batch_id?: string | null;
    batch_code?: string | null;
    batch_name?: string | null;
    batch?: IWarehouseBatchNo | null;
    viewBatch?: string | null;
    quantity?: number | 0;
    inventory_detail_id?: string | null;
    inventory_detail?: IWarehouseInventoryDetail | null;
}
