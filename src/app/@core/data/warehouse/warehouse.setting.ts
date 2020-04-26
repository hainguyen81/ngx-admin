import BaseModel, {IModel} from '../base';

export interface IWarehouseSetting extends IModel {
    code: string;
    name: string;
    type?: string | null;
    image?: string[] | null;
    order?: number | 0;
    remark?: string | null;
}

export default class WarehouseSettings extends BaseModel implements IWarehouseSetting {
    constructor(public id: string, public code: string, public name: string) {
        super(id);
    }
}
