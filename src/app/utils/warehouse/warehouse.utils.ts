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
        let warehouseTreeItemMapper: (entity: O, item: TreeviewItem) => TreeviewItem;
        warehouseTreeItemMapper = (org: O, item: TreeviewItem) => {
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
        let items: TreeviewItem[];
        items = HierarchyUtils.buildFlatToHierarchyTree(
            categories, 'id', 'parentId', undefined,
            undefined, undefined, 'children', warehouseTreeItemMapper);
        (items || []).sort((it1, it2) => {
            return (it1.text < it2.text ? -1 : it1.text === it2.text ? 0 : 1);
        });
        return items;
    }
}
