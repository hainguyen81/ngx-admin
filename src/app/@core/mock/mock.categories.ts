import {CATEGORIES_TYPE, ICategories} from '../data/warehouse_catelogies';
import ObjectUtils from '../../utils/object.utils';
import {IdGenerators} from '../../config/generator.config';

export const MAXIMUM_MOCK_CATEGORIES_UPPER_CATEGORIES: number = 5;
export const MAXIMUM_MOCK_CATEGORIES_TYPE: number = 6;
export const MAXIMUM_MOCK_CATEGORIES_BRAND: number = 7;

export const CategoriesUpperCategories: ICategories = {
    id: 'id',
    code: 'Code',
    name: 'Name',
    type: CATEGORIES_TYPE.UPPER_CATEGORIES,
};

export const CategoriesType: ICategories = {
    id: 'id',
    code: 'Code',
    name: 'Name',
    type: CATEGORIES_TYPE.TYPE,
};

export const CategoriesBrand: ICategories = {
    id: 'id',
    code: 'Code',
    name: 'Name',
    type: CATEGORIES_TYPE.BRAND,
};

export function categoriesGenerate(): ICategories[] {
    const mockCategories: ICategories[] = [];
    for (let i: number = 0; i < MAXIMUM_MOCK_CATEGORIES_UPPER_CATEGORIES; i++) {
        let mockCategoriesUpper: ICategories;
        mockCategoriesUpper = ObjectUtils.deepCopy(CategoriesUpperCategories);
        mockCategoriesUpper.id = IdGenerators.oid.generate();
        mockCategoriesUpper.code = 'UPPER-'.concat((i + 1).toString());
        mockCategoriesUpper.name = 'Upper '.concat((i + 1).toString());
        mockCategoriesUpper.children = [];
        mockCategories.push(mockCategoriesUpper);

        for (let j: number = 0; j < MAXIMUM_MOCK_CATEGORIES_TYPE; j++) {
            let mockCategoriesType: ICategories;
            mockCategoriesType = ObjectUtils.deepCopy(CategoriesType);
            mockCategoriesType.id = IdGenerators.oid.generate();
            mockCategoriesType.code = 'TYPE-'.concat((j + 1).toString());
            mockCategoriesType.name = 'Type '.concat((j + 1).toString());
            mockCategoriesType.parentId = mockCategoriesUpper.id;
            // TODO Be careful with recursively forever (stack overflow)
            // mockCategoriesType.parent = mockCategoriesUpper;
            mockCategoriesType.children = [];
            mockCategoriesUpper.children.push(mockCategoriesType);

            for (let k: number = 0; k < MAXIMUM_MOCK_CATEGORIES_BRAND; k++) {
                let mockCategoriesBrand: ICategories;
                mockCategoriesBrand = ObjectUtils.deepCopy(CategoriesBrand);
                mockCategoriesBrand.id = IdGenerators.oid.generate();
                mockCategoriesBrand.code = 'BRAND-'.concat((k + 1).toString());
                mockCategoriesBrand.name = 'Brand '.concat((k + 1).toString());
                mockCategoriesBrand.parentId = mockCategoriesType.id;
                // TODO Be careful with recursively forever (stack overflow)
                // mockCategoriesBrand.parent = mockCategoriesType;
                mockCategoriesType.children.push(mockCategoriesBrand);
            }
        }
    }
    return mockCategories;
}
