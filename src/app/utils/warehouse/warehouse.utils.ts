import HierarchyUtils from '../hierarchy.utils';
import {TreeviewItem} from 'ngx-treeview';
import {IWarehouseCategory} from '../../@core/data/warehouse/warehouse.category';

export default class WarehouseUtils {

    /**
     * Build the menu tree by the specified Module instances type
     * @param categories to build
     * @param parent the parent menu item or undefined if root
     * @return the menu instances array or undefined
     */
    public static buildWarehouseCategories<O extends IWarehouseCategory>(
        categories: O[], parent?: TreeviewItem): TreeviewItem[] {
        let treeItemMapper: (entity: O, item: TreeviewItem) => TreeviewItem;
        treeItemMapper = (org: O, item: TreeviewItem) => {
            if (!item) {
                item = new TreeviewItem({
                    checked: false,
                    collapsed: true,
                    disabled: false,
                    text: org.name,
                    value: org,
                });
            } else if (org) {
                item.text = org.name;
                item.value = org;
            }
            return item;
        };
        return HierarchyUtils.buildHierarchyTree(
            categories, undefined, parent, 'children',
            undefined, 'children', treeItemMapper);
    }
}
