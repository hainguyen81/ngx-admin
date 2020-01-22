import {IModule} from './module';

export interface IRole {
    id: string;
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
