import HierarchyUtils from '../hierarchy.utils';
import {IOrganization} from '../../@core/data/system/organization';
import {TreeviewItem} from 'ngx-treeview';

export default class OrganizationUtils {

    /**
     * Build the menu tree by the specified Module instances type
     * @param organization to build
     * @param parent the parent menu item or undefined if root
     * @return the menu instances array or undefined
     */
    public static buildOrganization<O extends IOrganization>(organization: O[], parent?: TreeviewItem): TreeviewItem[] {
        let orgTreeItemMapper: (entity: O, item: TreeviewItem) => TreeviewItem;
        orgTreeItemMapper = (org: O, item: TreeviewItem) => {
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
            organization, 'id', 'parentId', undefined,
            undefined, undefined, 'children', orgTreeItemMapper);
        (items || []).sort((it1, it2) => {
            return (it1.text < it2.text ? -1 : it1.text === it2.text ? 0 : 1);
        });
        return items;
    }
}
