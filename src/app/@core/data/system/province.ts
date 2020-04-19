import BaseModel, {IModel} from '../base';
import {ICity} from './city';

export interface IProvince extends IModel {
    code: string;
    name: string;
    image?: string | null;
    zip_code?: string | null;
    city_id?: string | null;
    city?: ICity | null;
}

export default class Province extends BaseModel implements IProvince {
    constructor(public id: string, public code: string, public name: string) {
        super(id);
    }
}
