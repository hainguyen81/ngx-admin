import {IModule} from './module';
import {IModel} from '../base';

export interface IRole extends IModel {
    moduleId: string;
    groupId: string;
    writable?: boolean | false;
    module?: IModule | null;
}

export default class Role implements IRole {
    constructor(public id: string, public moduleId: string,
                public groupId: string, public writable?: boolean | false,
                public module?: IModule | null) {
    }
}
