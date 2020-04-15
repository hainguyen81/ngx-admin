import {IModel} from '../base';

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

export default class Country implements ICountry {
    constructor(public id: string,
                public code: string,
                public name: string,
                public capital?: string | null,
                public region?: string | null,
                public currency?: { code?: string | null, name?: string | null, symbol?: string | null } | null,
                public language?: { code?: string | null, name?: string | null } | null,
                public dial_code?: string | null,
                public flag?: string | null) {
    }
}
