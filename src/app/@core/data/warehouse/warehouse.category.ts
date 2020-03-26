import {IModel} from '../base';

export const enum WAREHOUSE_TYPE {
    // Chủng loại
    CATEGORY,
    // Loại
    TYPE,
    // Hãng sản xuất
    BRAND,
}

export function convertWareHouseTypeToDisplay(value: WAREHOUSE_TYPE): string {
    switch (value) {
        case WAREHOUSE_TYPE.TYPE:
            return 'common.enum.warehouseType.type';
        case WAREHOUSE_TYPE.BRAND:
            return 'common.enum.warehouseType.brand';
        default:
            return 'common.enum.warehouseType.category';
    }
}

export interface IWarehouseCategory extends IModel {
    code: string;
    name: string;
    type: WAREHOUSE_TYPE | WAREHOUSE_TYPE.CATEGORY;
    image?: string | null;
    remark?: string | null;

    // foreign keys
    parentId?: string | null;
    parent?: IWarehouseCategory | null;
    children?: IWarehouseCategory[] | null;
}

export default class WarehouseCategory implements IWarehouseCategory {
    constructor(public id: string,
                public code: string,
                public name: string,
                public type: WAREHOUSE_TYPE | WAREHOUSE_TYPE.CATEGORY,
                public image?: string | null,
                public remark?: string | null,
                public parentId?: string | null,
                public parent?: IWarehouseCategory | null,
                public children?: IWarehouseCategory[] | null) {
    }
}
