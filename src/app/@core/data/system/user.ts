import {IRolesGroup} from './roles.group';
import BaseModel, {IModel} from '../base';

export interface IUser extends IModel {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    company: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string | string[];
    lang?: string | 'en';
    status?: string | null;
    rolesGroupId?: string | null;
    rolesGroup?: IRolesGroup | null;
    enterprise?: boolean | false;
}

export default class User extends BaseModel implements IUser {
    constructor(public id: string, public access_token: string,
                public token_type: string, public refresh_token: string,
                public expires_in: number, public scope: string,
                public company: string, public username: string, public password: string,
                public firstName: string, public lastName: string,
                public email: string) {
        super(id);
    }
}
