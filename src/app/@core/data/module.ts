import {IApi} from './api';

export interface IModule {
    id: string;
    code: string;
    name: string;
    apiId: string;
    api?: IApi | null;
    children?: IModule[] | null;
}

export default class Module implements IModule {
    constructor(public id: string, public code: string,
                public name: string, public apiId: string,
                public api?: IApi | null, public children?: IModule[] | null) {
    }
}
