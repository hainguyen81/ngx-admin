import HierarchyUtils from './hierarchy.utils';
import {IOrganization} from '../@core/data/organization';
import {TreeviewItem} from 'ngx-treeview';

export default class OrganizationUtils {

    /**
     * Build the menu tree by the specified Module instances type
     * @param organization to build
     * @param parent the parent menu item or undefined if root
     * @return the menu instances array or undefined
     */
    public static buildOrganization<O extends IOrganization>(organization: O[], parent?: TreeviewItem): TreeviewItem[] {
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
            organization, undefined, parent, 'children',
            undefined, 'children', treeItemMapper);
    }
}
