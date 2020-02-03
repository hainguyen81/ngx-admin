import {ICustomer, CUSTOMER_STATUS} from '../data/customer';

export const MockCustomer1: ICustomer = {
    id: '1',
    customerName: 'Customer 1',
    email: 'customer1@hsg.com',
    tel: '0916191819',
    address: 'Tan Binh',
    status: CUSTOMER_STATUS.ACTIVATED,
};
export const MockCustomer2: ICustomer = {
    id: '2',
    customerName: 'Customer 2',
    email: 'customer2@hsg.com',
    tel: '0939007978',
    address: 'Quan 1',
    status: CUSTOMER_STATUS.ACTIVATED,
};
export const MockCustomer3: ICustomer = {
    id: '3',
    customerName: 'Customer 3',
    email: 'customer3@hsg.com',
    tel: '0908037705',
    address: 'Quan 2',
    status: CUSTOMER_STATUS.ACTIVATED,
};
export const MockCustomer4: ICustomer = {
    id: '4',
    customerName: 'Customer 4',
    email: 'customer4@hsg.com',
    tel: '0916191818',
    address: 'Quan 3',
    status: CUSTOMER_STATUS.ACTIVATED,
};

export const MockCustomer = [
    MockCustomer1,
    MockCustomer2,
    MockCustomer3,
    MockCustomer4,
];
