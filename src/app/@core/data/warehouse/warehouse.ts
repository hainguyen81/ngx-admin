import {IModel} from '../base';

export interface IWarehouse extends IModel {
    // Mã kho
    code: string;
    // Tên kho
    name: string;
    // Hình ảnh
    image?: string[] | null;
    // Địa chỉ
    street_address: string;
    // Thành phố
    city?: string | null;
    // Tỉnh
    state_province?: string | null;
    // Zip code
    zip_code?: string | null;
    // Quốc gia
    country?: string | null;
    // Điện thoại
    tel?: string | null;
    // Fax
    fax?: string | null;
    // Email
    email?: string | null;
}

export default class Warehouse implements IWarehouse {
    constructor(public id: string,
                public code: string,
                public name: string,
                public street_address: string,
                public image?: string[] | null,
                public city?: string | null,
                public state_province?: string | null,
                public zip_code?: string | null,
                public country?: string | null,
                public tel?: string | null,
                public fax?: string | null,
                public email?: string | null) {
    }
}
