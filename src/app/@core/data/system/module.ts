import {IApi} from './api';
import BaseModel, {IModel} from '../base';

export interface IModule extends IModel {
    code: string;
    name: string;
    apiId: string;
    api?: IApi | null;
    icon?: string | { icon: string, pack: string } | null;
    children?: IModule[] | null;
}

export default class Module extends BaseModel implements IModule {
    constructor(public id: string, public code: string, public name: string, public apiId: string) {
        super(id);
    }
}
