import BaseModel, {IModel} from '../base';

export interface ICountry extends IModel {
    code: string;
    name: string;
    capital?: string | null;
    region?: string | null;
    currency?: {
        code?: string | null;
        name?: string | null;
        symbol?: string | null;
    } | null;
    language?: {
        code?: string | null;
        name?: string | null;
    } | null;
    dial_code?: string | null;
    flag?: string | null;
}

export default class Country extends BaseModel implements ICountry {
    constructor(public id: string, public code: string, public name: string) {
        super(id);
    }
}
