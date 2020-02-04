import {ICustomer, CUSTOMER_STATUS} from '../data/customer';
import ObjectUtils from '../../utils/object.utils';
import {IdGenerators} from '../../config/generator.config';

export const MAXIMUM_MOCK_CUSTOMERS: number = 100;

export const MockCustomerTemplate: ICustomer = {
    id: '1',
    customerName: 'Customer 1',
    email: 'customer1@hsg.com',
    tel: '0916191819',
    address: 'Tan Binh',
    status: CUSTOMER_STATUS.ACTIVATED,
};

export function customersGenerate(): ICustomer[] {
    let mockCustomers: ICustomer[];
    mockCustomers = [];
    for (let i: number = 0; i < MAXIMUM_MOCK_CUSTOMERS; i++) {
        let mockCustomer: ICustomer;
        mockCustomer = ObjectUtils.deepCopy(MockCustomerTemplate);
        mockCustomer.id = IdGenerators.oid.generate();
        mockCustomer.customerName = 'Customer '.concat((i + 1).toString());
        mockCustomer.email = 'customer'.concat((i + 1).toString(), '@hsg.com');
        mockCustomers.push(mockCustomer);
    }
    return mockCustomers;
}
