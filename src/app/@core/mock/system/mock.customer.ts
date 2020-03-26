import {CUSTOMER_LEVEL, CUSTOMER_STATUS, CUSTOMER_TYPE, ICustomer} from '../../data/system/customer';
import ObjectUtils from '../../../utils/object.utils';
import {IdGenerators} from '../../../config/generator.config';

export const MAXIMUM_MOCK_CUSTOMERS: number = 100;

export const MockCustomerTemplate: ICustomer = {
    id: '1',
    code: 'Customer-1',
    name: 'Customer 1',
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
        mockCustomer.code = 'Customer-'.concat((i + 1).toString());
        mockCustomer.name = 'Customer '.concat((i + 1).toString());
        mockCustomer.email = 'customer'.concat((i + 1).toString(), '@hsg.com');
        mockCustomer.type = CUSTOMER_TYPE.CUSTOMER;
        mockCustomer.level = CUSTOMER_LEVEL.NEW;
        mockCustomers.push(mockCustomer);
    }
    return mockCustomers;
}
