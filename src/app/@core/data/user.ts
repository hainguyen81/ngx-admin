import {IRolesGroup} from './roles.group';

export const enum USER_STATUS {
    NOT_ACTIVATED,
    ACTIVATED,
    LOCKED,
}

export interface IUser {
    id: string;
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    company: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    status: USER_STATUS;
    rolesGroupId?: string | null;
    rolesGroup?: IRolesGroup | null;
    enterprise?: boolean | false;
}

export default class User implements IUser {
    constructor(public id: string, public access_token: string,
                public token_type: string, public refresh_token: string,
                public expires_in: number, public scope: string,
                public company: string, public username: string,
                public firstName: string, public lastName: string,
                public email: string, public status: USER_STATUS,
                public rolesGroupId?: string | null, public rolesGroup?: IRolesGroup | null,
                public enterprise?: boolean | false) {
    }
}
