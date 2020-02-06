import {IModel} from './base';

export const enum CUSTOMER_STATUS {
    NOT_ACTIVATED,
    ACTIVATED,
    LOCKED,
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

export interface ICustomer extends IModel {
    customerName: string;
    email: string;
    tel?: string | null;
    address?: string | null;
    status: CUSTOMER_STATUS;
}

export default class Customer implements ICustomer {
    constructor(public id: string, public customerName: string,
                public email: string, public status: CUSTOMER_STATUS,
                public tel?: string, public address?: string) {
    }
}
