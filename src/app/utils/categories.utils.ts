import HierarchyUtils from './hierarchy.utils';
import {TreeviewItem} from 'ngx-treeview';
import { ICategories } from '../@core/data/warehouse_catelogies';

export default class CategoriesUtils {

    /**
     * Build the menu tree by the specified Module instances type
     * @param categories to build
     * @param parent the parent menu item or undefined if root
     * @return the menu instances array or undefined
     */
    public static buildCategories<O extends ICategories>(categories: O[], parent?: TreeviewItem): TreeviewItem[] {
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
            categories, null, parent, 'children',
            'parent', 'children', treeItemMapper);
    }
}
