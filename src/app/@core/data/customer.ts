import {IModel} from './base';

export const enum CUSTOMER_STATUS {
    NOT_ACTIVATED,
    ACTIVATED,
    LOCKED,
}

export const enum CUSTOMER_TYPE {
    CUSTOMER,
    VENDOR,
    ALL,
}

export const enum CUSTOMER_LEVEL {
    NEW,
    BRONZE,
    SILVER,
    GOLD,
    PLATINUM,
}

export function convertCustomerStatusToDisplay(value: CUSTOMER_STATUS): string {
    switch (value) {
        case CUSTOMER_STATUS.ACTIVATED:
            return 'common.enum.customerStatus.activated';
        case CUSTOMER_STATUS.LOCKED:
            return 'common.enum.customerStatus.locked';
        default:
            return 'common.enum.customerStatus.notActivated';
    }
}

export function convertCustomerTypeToDisplay(value: CUSTOMER_TYPE): string {
    switch (value) {
        case CUSTOMER_TYPE.CUSTOMER:
            return 'common.enum.customerType.customer';
        case CUSTOMER_TYPE.VENDOR:
            return 'common.enum.customerType.vendor';
        default:
            return 'common.enum.customerType.all';
    }
}

export function convertCustomerLevelToDisplay(value: CUSTOMER_LEVEL): string {
    switch (value) {
        case CUSTOMER_LEVEL.BRONZE:
            return 'common.enum.customerLevel.bronze';
        case CUSTOMER_LEVEL.SILVER:
            return 'common.enum.customerLevel.silver';
        case CUSTOMER_LEVEL.GOLD:
            return 'common.enum.customerLevel.gold';
        case CUSTOMER_LEVEL.PLATINUM:
            return 'common.enum.customerLevel.platinum';
        default:
            return 'common.enum.customerLevel.new';
    }
}

export interface ICustomer extends IModel {
    // Mã nhà cung cấp/khách hàng
    code: string;
    // Tên nhà cung cấp/khách hàng
    name: string;
    // Loại khách hàng/nhà cung cấp
    type?: CUSTOMER_TYPE | CUSTOMER_TYPE.CUSTOMER;
    // trạng thái
    status?: CUSTOMER_STATUS | CUSTOMER_STATUS.NOT_ACTIVATED;
    // cấp bậc khách hàng
    level?: CUSTOMER_LEVEL | CUSTOMER_LEVEL.NEW;
    email: string;
    tel?: string | null;
    fax?: string | null;
    website?: string | null;
    address?: string | null;
    city?: string | null;
    state_province?: string | null;
    zip_code?: string | null;
    country?: string | null;
    contact_name?: string | null;
    contact_tel?: string | null;
    contact_fax?: string | null;
    remark?: string | null;
}

export default class Customer implements ICustomer {
    constructor(public id: string,
                public code: string,
                public name: string,
                public email: string,
                public address: string | null,
                public type?: CUSTOMER_TYPE | CUSTOMER_TYPE.CUSTOMER,
                public status?: CUSTOMER_STATUS | CUSTOMER_STATUS.NOT_ACTIVATED,
                public level?: CUSTOMER_LEVEL | CUSTOMER_LEVEL.NEW,
                public tel?: string | null,
                public fax?: string | null,
                public website?: string | null,
                public city?: string | null,
                public state_province?: string | null,
                public zip_code?: string | null,
                public country?: string | null,
                public contact_name?: string | null,
                public contact_tel?: string | null,
                public contact_fax?: string | null,
                public remark?: string | null) {
    }
}
