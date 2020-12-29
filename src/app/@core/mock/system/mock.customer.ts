import ObjectUtils from '../../../utils/common/object.utils';
import {IdGenerators} from '../../../config/generator.config';
import {Constants as CustomerConstants} from '../../data/constants/customer.constants';
import {ICustomer} from '../../data/system/customer';
import CUSTOMER_TYPE = CustomerConstants.CustomerConstants.CUSTOMER_TYPE;
import CUSTOMER_LEVEL = CustomerConstants.CustomerConstants.CUSTOMER_LEVEL;
import {Constants as CommonConstants} from '../../data/constants/common.constants';
import STATUS = CommonConstants.COMMON.STATUS;

export const MAXIMUM_MOCK_CUSTOMERS: number = 100;

export const MockCustomerTemplate: ICustomer = {
    id: '1',
    code: 'Customer-1',
    name: 'Customer 1',
    email: 'customer1@hsg.com',
    tel: '0916191819',
    address: 'Tan Binh',
    status: Object.keys(STATUS).find(key => ObjectUtils.requireValue(STATUS, key) === STATUS.ACTIVATED),
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
        mockCustomer.type = Object.keys(CUSTOMER_TYPE)
            .find(key => ObjectUtils.requireValue(CUSTOMER_TYPE, key) === CUSTOMER_TYPE.CUSTOMER);
        mockCustomer.level = Object.keys(CUSTOMER_LEVEL)
            .find(key => ObjectUtils.requireValue(CUSTOMER_LEVEL, key) === CUSTOMER_LEVEL.NEW);
        mockCustomers.push(mockCustomer);
    }
    return mockCustomers;
}
