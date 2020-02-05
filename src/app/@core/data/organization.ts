export const enum ORGANIZTAION_TYPE {
    HEAD_CENTER,
    BRANCH,
    DIVISION,
    UNIT,
    DEPARTMENT,
    TEAM_GROUP,
}

export function convertOrganizationTypeToDisplay(value: ORGANIZTAION_TYPE): string {
    switch (value) {
        case ORGANIZTAION_TYPE.HEAD_CENTER:
            return 'Head Center';
        case ORGANIZTAION_TYPE.BRANCH:
            return 'Branch';
        case ORGANIZTAION_TYPE.DIVISION:
            return 'Division';
        case ORGANIZTAION_TYPE.UNIT:
            return 'Unit';
        case ORGANIZTAION_TYPE.DEPARTMENT:
            return 'Department';
        default:
            return 'Team/Group';
    }
}

export interface IOrganization {
    id: string;
    code: string;
    name: string;
    parentId?: string | null;
    parent?: IOrganization | null;
    type: ORGANIZTAION_TYPE;
    tax?: string | null;
    address?: string | null;
    tel?: string | null;
    fax?: string | null;
    email?: string | null;
    remark?: string | null;
    managerId?: string | null;
    manager?: any;
    contact?: string | null;
    image?: string | { icon: string, pack: string } | null;
    children?: IOrganization[] | null;
}

export default class Organization implements IOrganization {
    constructor(public id: string, public code: string, public name: string,
                public type: ORGANIZTAION_TYPE,
                public parentId?: string | null, public parent?: IOrganization | null,
                public tax?: string | null, public address?: string | null,
                public tel?: string | null, public fax?: string | null,
                public email?: string | null, public remark?: string | null,
                public managerId?: string | null, public manager?: any,
                public contact?: string | null, public image?: string | { icon: string, pack: string } | null,
                public children?: IOrganization[] | null) {
    }
}
