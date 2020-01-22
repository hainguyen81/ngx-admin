export interface IApi {
    id: string;
    code: string;
    name: string;
    regexUrl?: string | null;
    baseUrl?: string | null;
    icon?: string | null;
    version?: string | null;
}

export default class Api implements IApi {
    constructor(public id: string, public code: string,
                public name: string, public regexUrl?: string,
                public baseUrl?: string, public icon?: string,
                public version?: string) {
    }
}
