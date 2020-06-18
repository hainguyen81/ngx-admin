import BaseModel, {IModel} from '../base';
import {IDistrict} from '../system/district';
import {ICity} from '../system/city';
import {IProvince} from '../system/province';
import {ICountry} from '../system/country';

export interface IWarehouse extends IModel {
    // Mã kho
    code: string;
    // Tên kho
    name: string;
    // Loại kho hàng/kệ/ngăn
    type?: string | null;
    // Hình ảnh
    image?: string[] | null;
    // Địa chỉ
    street_address: string;
    // Quận/Huyện
    district_id?: string | null;
    district?: IDistrict | null;
    // Thành phố
    city_id?: string | null;
    city?: ICity | null;
    // Tỉnh
    province_id?: string | null;
    province?: IProvince | null;
    // Zip code
    zip_code?: string | null;
    // Quốc gia
    country_id?: string | null;
    country?: ICountry | null;
    // Điện thoại
    tel?: string | null;
    // Fax
    fax?: string | null;
    // Email
    email?: string | null;
    // Remark
    remark?: string | null;
    parentId?: string | null;
    parent?: IWarehouse | null;
    children?: IWarehouse[] | null;
}

export default class Warehouse extends BaseModel implements IWarehouse {
    constructor(public id: string, public code: string, public name: string, public street_address: string) {
        super(id);
    }
}
