import BaseModel, {IModel} from '../base';
import {IDistrict} from './district';
import {ICity} from './city';
import {IProvince} from './province';
import {ICountry} from './country';

export interface ICustomer extends IModel {
    // Mã nhà cung cấp/khách hàng
    code: string;
    // Tên nhà cung cấp/khách hàng
    name: string;
    // Loại khách hàng/nhà cung cấp
    type?: string | null;
    // trạng thái
    status?: string | null;
    // cấp bậc khách hàng
    level?: string | null;
    image?: string | { icon: string, pack: string } | null;
    email: string;
    tel?: string | null;
    fax?: string | null;
    website?: string | null;
    address?: string | null;
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
    contact_name?: string | null;
    contact_tel?: string | null;
    contact_fax?: string | null;
    remark?: string | null;
}

export default class Customer extends BaseModel implements ICustomer {
    constructor(public id: string, public code: string, public name: string, public email: string) {
        super(id);
    }
}
