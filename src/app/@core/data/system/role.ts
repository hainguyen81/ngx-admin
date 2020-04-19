import {IModule} from './module';
import BaseModel, {IModel} from '../base';

export interface IRole extends IModel {
    moduleId: string;
    groupId: string;
    writable?: boolean | false;
    module?: IModule | null;
}

export default class Role extends BaseModel implements IRole {
    constructor(public id: string, public moduleId: string, public groupId: string) {
        super(id);
    }
}
