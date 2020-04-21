import BaseModel, {IModel} from '../base';
import {IProvince} from './province';

export interface ICity extends IModel {
    code: string;
    name: string;
    image?: string | null;
    zip_code?: string | null;
    province_id?: string | null;
    province?: IProvince | null;
}

export default class City extends BaseModel implements ICity {
    constructor(public id: string, public code: string, public name: string) {
        super(id);
    }
}
