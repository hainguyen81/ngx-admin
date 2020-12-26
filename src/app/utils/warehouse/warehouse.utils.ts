import HierarchyUtils from '../common/hierarchy.utils';
import {TreeviewItem} from 'ngx-treeview';
import {IWarehouseCategory} from '../../@core/data/warehouse/warehouse.category';

export default class WarehouseUtils {

    /**
     * Build the categories tree by the specified category instances type
     * @param categories to build
     * @param parent the parent category item or undefined if root
     * @return the category instances array or undefined
     */
    public static buildWarehouseCategories<O extends IWarehouseCategory>(
        categories: O[], parent?: TreeviewItem): TreeviewItem[] {
        return HierarchyUtils.buildModelTreeview(categories, 'name', parent);
    }
}
