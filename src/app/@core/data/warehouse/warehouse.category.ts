import BaseModel, {IModel} from '../base';
import {Constants} from '../constants/warehouse.category.constants';
import CATEGORY_TYPE = Constants.WarehouseConstants.WarehouseCategoryConstants.CATEGORY_TYPE;
import CATEGORY_STATUS = Constants.WarehouseConstants.WarehouseCategoryConstants.CATEGORY_STATUS;

export interface IWarehouseCategory extends IModel {
    code: string;
    name: string;
    type: CATEGORY_TYPE | CATEGORY_TYPE.CATEGORY;
    status?: CATEGORY_STATUS | CATEGORY_STATUS.NOT_ACTIVATED;
    image?: string[] | [];
    remark?: string | null;

    // foreign keys
    parentId?: string | null;
    parent?: IWarehouseCategory | null;
    children?: IWarehouseCategory[] | null;
}

export default class WarehouseCategory extends BaseModel implements IWarehouseCategory {
    constructor(public id: string, public code: string, public name: string,
                public type: CATEGORY_TYPE | CATEGORY_TYPE.CATEGORY) {
        super(id);
    }
}
