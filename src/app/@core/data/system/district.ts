import BaseModel, {IModel} from '../base';
import {ICountry} from './country';

export interface IDistrict extends IModel {
    code: string;
    name: string;
    image?: string | null;
    zip_code?: string | null;
    city_id?: string | null;
    city?: ICountry | null;
}

export default class District extends BaseModel implements IDistrict {
    constructor(public id: string, public code: string, public name: string) {
        super(id);
    }
}
