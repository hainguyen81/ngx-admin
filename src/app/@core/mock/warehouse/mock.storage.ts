import ObjectUtils from '../../../utils/object.utils';
import {IdGenerators} from '../../../config/generator.config';
import {IWarehouse} from '../../data/warehouse/warehouse';
import {Constants as WarehouseStorageConstants} from '../../data/constants/warehouse.storage.constants';
import STORAGE_TYPE = WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE;
import {$enum} from 'ts-enum-util';

export const MAXIMUM_MOCK_WAREHOUSE: number = 10;

export const MockWarehouseTemplate: IWarehouse = {
    id: 'id',
    code: 'Code',
    name: 'Name',
    street_address: 'Address',
};

export function warehouseGenerate(): IWarehouse[] {
    let mockWarehouses: IWarehouse[];
    mockWarehouses = [];
    for (let i: number = 0; i < MAXIMUM_MOCK_WAREHOUSE; i++) {
        let mockWarehouse: IWarehouse;
        mockWarehouse = ObjectUtils.deepCopy(MockWarehouseTemplate);
        mockWarehouse.id = IdGenerators.oid.generate();
        mockWarehouse.code = 'W'.concat((i + 1).toString());
        mockWarehouse.name = 'Warehouse '.concat(mockWarehouse.code);
        mockWarehouse.type = $enum(STORAGE_TYPE).getKeyOrThrow(STORAGE_TYPE.STORAGE);
        mockWarehouse.street_address = 'Address '.concat(mockWarehouse.code);
        mockWarehouse.pathCodes = '/';
        mockWarehouse.pathIds = '/';
        mockWarehouses.push(mockWarehouse);
    }
    return mockWarehouses;
}
