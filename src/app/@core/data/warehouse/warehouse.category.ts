import BaseModel, {IModel} from '../base';

export interface IWarehouseCategory extends IModel {
    code: string;
    name: string;
    type?: string | null;
    status?: string | null;
    image?: string[] | [];
    remark?: string | null;

    // foreign keys
    parentId?: string | null;
    parent?: IWarehouseCategory | null;
    children?: IWarehouseCategory[] | null;
}

export default class WarehouseCategory extends BaseModel implements IWarehouseCategory {
    constructor(public id: string, public code: string, public name: string) {
        super(id);
    }
}
