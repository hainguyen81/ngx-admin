import WarehouseUtils from './warehouse.utils';
import {IWarehouseCategory} from '../../@core/data/warehouse/warehouse.category';
import {
    WarehouseCategoryDatasource,
} from '../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import {throwError} from 'rxjs';

export default class WarehouseDataUtils {

    /**
     * Get all warehouse categories
     * @param warehouseCategoryDatasource to invoke
     */
    public static invokeAllWarehouseCategories(
        warehouseCategoryDatasource: WarehouseCategoryDatasource): Promise<any[]> {
        warehouseCategoryDatasource
        || throwError('WarehouseCategoryDatasource is required to invoke!');
        return warehouseCategoryDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false)
            .getAll().then(values => {
                return WarehouseUtils.buildWarehouseCategories(values as IWarehouseCategory[]);
            });
    }
}
