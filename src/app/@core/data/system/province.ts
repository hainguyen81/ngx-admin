import BaseModel, {IModel} from '../base';
import {ICountry} from './country';

export interface IProvince extends IModel {
    code: string;
    name: string;
    image?: string | null;
    zip_code?: string | null;
    country_id?: string | null;
    country?: ICountry | null;
}

export default class Province extends BaseModel implements IProvince {
    constructor(public id: string, public code: string, public name: string) {
        super(id);
    }
}
