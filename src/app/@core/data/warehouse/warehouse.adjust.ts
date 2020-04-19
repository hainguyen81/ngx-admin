import BaseModel, {IModel} from '../base';
import {IWarehouse} from './warehouse';

export interface IWarehouseAdjust extends IModel {
    // Mã phiếu
    code: string;
    // Ngày nhập xuất
    date: number;
    // Lý do điều chỉnh kho
    reason: string;
    // Ghi chú
    remark?: string | null;
    // Tập tin đính kèm
    file_attach?: string | null;

    // foreign keys
    warehouse_id?: string | null;
    warehouse?: IWarehouse | null;
}

export default class WarehouseAdjust extends BaseModel implements IWarehouseAdjust {
    constructor(public id: string, public code: string, public date: number, public reason: string) {
        super(id);
    }
}
