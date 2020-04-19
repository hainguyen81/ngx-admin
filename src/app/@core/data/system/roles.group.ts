import {IRole} from './role';
import BaseModel, {IModel} from '../base';

export interface IRolesGroup extends IModel {
    company: string;
    code: string;
    name: string;
    roles?: IRole[] | null;
}

export default class RolesGroup extends BaseModel implements IRolesGroup {
    constructor(public id: string, public company: string, public code: string, public name: string) {
        super(id);
    }
}
