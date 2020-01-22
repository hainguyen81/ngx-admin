import {IRole} from './role';

export interface IRolesGroup {
    id: string;
    company: string;
    code: string;
    name: string;
    roles?: IRole[] | null;
}

export default class RolesGroup implements IRolesGroup {
    constructor(public id: string, public company: string,
                public code: string, public name: string,
                public roles?: IRole[] | null) {
    }
}
