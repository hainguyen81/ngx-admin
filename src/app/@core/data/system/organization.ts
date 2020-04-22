import BaseModel, {IModel} from '../base';
import {ICity} from './city';
import {IProvince} from './province';
import {ICountry} from './country';
import {IDistrict} from './district';
import {Constants} from '../constants/organization.constants';
import ORGANIZATION_TYPE = Constants.OrganizationConstants.ORGANIZATION_TYPE;

export interface IOrganization extends IModel {
    code: string;
    name: string;
    type: ORGANIZATION_TYPE;
    tax?: string | null;
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
    tel?: string | null;
    fax?: string | null;
    email?: string | null;
    remark?: string | null;
    managerId?: string | null;
    manager?: any;
    image?: string | { icon: string, pack: string } | null;
    legal_representative?: string | null;
    tel_representative?: string | null;
    business_license?: string | null;
    business_license_dt?: string | Date | null;
    date_incorporation?: string | Date | null;
    bank_company?: string | null;
    bank_company_at?: string | null;
    bank_company_account?: string | null;
    parentId?: string | null;
    parent?: IOrganization | null;
    children?: IOrganization[] | null;
}

export default class Organization extends BaseModel implements IOrganization {
    constructor(public id: string, public code: string, public name: string, public type: ORGANIZATION_TYPE) {
        super(id);
    }
}
