import BaseModel, {IModel} from '../base';

export interface IWarehouseBatchNo extends IModel {
    code: string;
    name: string;
    mfg_date?: string | null;
    exp_date?: string | null;
    status?: string | null;
    remark?: string | null;
}

export default class WarehouseBatchNo extends BaseModel implements IWarehouseBatchNo {
    constructor(public id: string, public code: string, public name: string) {
        super(id);
    }
}
