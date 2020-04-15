import {IModel} from '../base';

export interface ICountry extends IModel {
    code: string;
    name: string;
    dial_code?: string | null;
    image?: string | null;
}

export default class Country implements ICountry {
    constructor(public id: string,
                public code: string,
                public name: string,
                public dial_code?: string | null,
                public image?: string | null) {
    }
}
