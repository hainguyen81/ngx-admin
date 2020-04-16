import {IModel} from '../base';

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
            return 'common.enum.organizationType.head';
        case ORGANIZTAION_TYPE.BRANCH:
            return 'common.enum.organizationType.branch';
        case ORGANIZTAION_TYPE.DIVISION:
            return 'common.enum.organizationType.division';
        case ORGANIZTAION_TYPE.UNIT:
            return 'common.enum.organizationType.unit';
        case ORGANIZTAION_TYPE.DEPARTMENT:
            return 'common.enum.organizationType.department';
        default:
            return 'common.enum.organizationType.team_group';
    }
}

export interface IOrganization extends IModel {
    code: string;
    name: string;
    type: ORGANIZTAION_TYPE;
    tax?: string | null;
    address?: string | null;
    // Thành phố
    city?: string | null;
    // Tỉnh
    state_province?: string | null;
    // Zip code
    zip_code?: string | null;
    // Quốc gia
    country?: string | null;
    tel?: string | null;
    fax?: string | null;
    email?: string | null;
    remark?: string | null;
    managerId?: string | null;
    manager?: any;
    image?: string | { icon: string, pack: string } | null;
    legal_representative?: string | null;
    tel_representative?: string | null;
    business_license?: string | null;
    business_license_dt?: string | Date | null;
    date_incorporation?: string | Date | null;
    bank_company?: string | null;
    bank_company_at?: string | null;
    bank_company_account?: string | null;
    parentId?: string | null;
    parent?: IOrganization | null;
    children?: IOrganization[] | null;
}

export default class Organization implements IOrganization {
    constructor(public id: string, public code: string, public name: string,
                public type: ORGANIZTAION_TYPE,
                public tax?: string | null, public address?: string | null,
                public city?: string | null, public state_province?: string | null,
                public zip_code?: string | null, public country?: string | null,
                public tel?: string | null, public fax?: string | null,
                public email?: string | null, public remark?: string | null,
                public managerId?: string | null, public manager?: any,
                public image?: string | { icon: string, pack: string } | null,
                public legal_representative?: string | null, public tel_representative?: string | null,
                public business_license?: string | null, public business_license_dt?: string | Date | null,
                public date_incorporation?: string | Date | null,
                public bank_company?: string | null, public bank_company_at?: string | null,
                public bank_company_account?: string | null,
                public parentId?: string | null, public parent?: IOrganization | null,
                public children?: IOrganization[] | null) {
    }
}
