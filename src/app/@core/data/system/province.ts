import {IModel} from '../base';
import {ICity} from './city';

export interface IProvince extends IModel {
    code: string;
    name: string;
    image?: string | null;
    zip_code?: string | null;
    city_id?: string | null;
    city?: ICity | null;
}

export default class Province implements IProvince {
    constructor(public id: string,
                public code: string,
                public name: string,
                public image?: string | null,
                public zip_code?: string | null,
                public city_id?: string | null,
                public city?: ICity | null) {
    }
}
