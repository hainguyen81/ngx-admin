import BaseModel, {IModel} from '../base';
import {IModule} from './module';

export interface IGeneralSettings extends IModel {
    code: string;
    name: string;
    value: number | string;
    builtin?: boolean | false;
    module_id?: string | null;
    module?: IModule | null;
}

export default class GeneralSettings extends BaseModel implements IGeneralSettings {
    constructor(public id: string, public code: string, public name: string, public value: number | string) {
        super(id);
    }
}
