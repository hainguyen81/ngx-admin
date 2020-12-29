import ObjectUtils from '../../../utils/common/object.utils';
import {IdGenerators} from '../../../config/generator.config';
import {IWarehouseCategory} from '../../data/warehouse/warehouse.category';
import {Constants as WarehouseConstants} from '../../data/constants/warehouse.category.constants';
import CATEGORY_TYPE = WarehouseConstants.WarehouseConstants.WarehouseCategoryConstants.CATEGORY_TYPE;
import {Constants as CommonConstants} from '../../data/constants/common.constants';
import STATUS = CommonConstants.COMMON.STATUS;

export const MAXIMUM_MOCK_CATEGORY_CHILDS: number = 10;
export const MAXIMUM_MOCK_CATEGORY: number = 10;

export const MockCategoryTemplate: IWarehouseCategory = {
    id: 'id',
    code: 'Code',
    name: 'Name',
    type: Object.keys(CATEGORY_TYPE).find(
        key => ObjectUtils.requireValue(CATEGORY_TYPE, key) === CATEGORY_TYPE.CATEGORY),
    status: Object.keys(STATUS).find(
        key => ObjectUtils.requireValue(STATUS, key) === STATUS.ACTIVATED),
};

export function categoryGenerate(): IWarehouseCategory[] {
    let mockCategories: IWarehouseCategory[];
    mockCategories = [];
    for (let i: number = 0; i < MAXIMUM_MOCK_CATEGORY; i++) {
        let mockCategory: IWarehouseCategory;
        mockCategory = ObjectUtils.deepCopy(MockCategoryTemplate);
        mockCategory.id = IdGenerators.oid.generate();
        mockCategory.code = 'C'.concat((i + 1).toString());
        mockCategory.name = 'Category '.concat(mockCategory.code);
        // TODO Be careful with recursively forever (stack overflow)
        // mockCategory.parentId = (parent ? parent.id : undefined);
        // mockCategory.parent = undefined;
        // mockCategory.children = [];
        // if (parent) {
        //     if (!(parent.children || []).length) {
        //         parent.children = [];
        //     }
        //     parent.children.push(mockCategory);
        // }
        mockCategories.push(mockCategory);

        for (let j: number = 0; j < MAXIMUM_MOCK_CATEGORY_CHILDS; j++) {
            let mockChildCategory: IWarehouseCategory;
            mockChildCategory = ObjectUtils.deepCopy(MockCategoryTemplate);
            mockChildCategory.id = IdGenerators.oid.generate();
            mockChildCategory.code = 'C'.concat((i + 1).toString(), 'S', (j + 1).toString());
            mockChildCategory.name = 'Category '.concat(mockChildCategory.code);
            mockChildCategory.parentId = mockCategory.id;
            // TODO Be careful with recursively forever (stack overflow)
            // mockChildCategory.parent = mockOrgHead;
            // mockChildCategory.children = [];
            // mockCategory.children.push(mockChildCategory);
            mockCategories.push(mockChildCategory);
        }
    }
    return mockCategories;
}
