import BaseModel, {IModel} from '../base';
import {ICountry} from './country';

export interface ICity extends IModel {
    code: string;
    name: string;
    image?: string | null;
    zip_code?: string | null;
    country_id?: string | null;
    country?: ICountry | null;
}

export default class City extends BaseModel implements ICity {
    constructor(public id: string, public code: string, public name: string) {
        super(id);
    }
}
