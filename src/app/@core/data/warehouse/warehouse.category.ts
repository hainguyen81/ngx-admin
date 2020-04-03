import {IModel} from '../base';

export const enum CATEGORY_TYPE {
    // Chủng loại
    CATEGORY,
    // Loại
    TYPE,
    // Hãng sản xuất
    BRAND,
}

export const enum CATEGORY_STATUS {
    NOT_ACTIVATED,
    ACTIVATED,
    LOCKED,
}

export function convertWarehouseCategoryTypeToDisplay(value: CATEGORY_TYPE): string {
    switch (value) {
        case CATEGORY_TYPE.TYPE:
            return 'common.enum.warehouseCategoryType.type';
        case CATEGORY_TYPE.BRAND:
            return 'common.enum.warehouseCategoryType.brand';
        default:
            return 'common.enum.warehouseCategoryType.category';
    }
}

export function convertWarehouseCategoryStatusToDisplay(value: CATEGORY_STATUS): string {
    switch (value) {
        case CATEGORY_STATUS.ACTIVATED:
            return 'common.enum.warehouseCategoryStatus.activated';
        case CATEGORY_STATUS.LOCKED:
            return 'common.enum.warehouseCategoryStatus.locked';
        default:
            return 'common.enum.warehouseCategoryStatus.notActivated';
    }
}

export interface IWarehouseCategory extends IModel {
    code: string;
    name: string;
    type: CATEGORY_TYPE | CATEGORY_TYPE.CATEGORY;
    status?: CATEGORY_STATUS | CATEGORY_STATUS.NOT_ACTIVATED;
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
                public type: CATEGORY_TYPE | CATEGORY_TYPE.CATEGORY,
                public status?: CATEGORY_STATUS | CATEGORY_STATUS.NOT_ACTIVATED,
                public image?: string | null,
                public remark?: string | null,
                public parentId?: string | null,
                public parent?: IWarehouseCategory | null,
                public children?: IWarehouseCategory[] | null) {
    }
}
