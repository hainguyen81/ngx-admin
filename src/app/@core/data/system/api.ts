import {IModel} from '../base';

export interface IApi extends IModel {
    code: string;
    name: string;
    regexUrl?: string | null;
    baseUrl?: string | null;
    icon?: string | { icon: string, pack: string } | null;
    version?: string | null;
}

export default class Api implements IApi {
    constructor(public id: string, public code: string,
                public name: string, public regexUrl?: string,
                public baseUrl?: string, public icon?: string | { icon: string, pack: string },
                public version?: string) {
    }
}
