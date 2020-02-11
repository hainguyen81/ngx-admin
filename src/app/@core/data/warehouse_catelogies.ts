import {IModel} from './base';
import {IOrganization, ORGANIZTAION_TYPE} from './organization';

export const enum CATEGORIES_TYPE {
    UPPER_CATEGORIES,
    TYPE,
    BRAND,
}

export interface ICategories extends IModel {
    code: string;
    name: string;
    parentId?: string | null;
    parent?: ICategories | null;
    type: CATEGORIES_TYPE;
    img?: string | { icon: string, pack: string } | null;
    remark?: string | null;
    children?: ICategories[] | null;
}

export default class Categories implements ICategories {
    constructor(public id: string, public code: string, public name: string,
                public type: CATEGORIES_TYPE,
                public parentId?: string | null, public parent?: ICategories | null,
                public remark?: string | null,
                public img?: string | { icon: string, pack: string } | null,
                public children?: ICategories[] | null) {
    }
}
