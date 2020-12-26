import HierarchyUtils from '../common/hierarchy.utils';
import {IOrganization} from '../../@core/data/system/organization';
import {TreeviewItem} from 'ngx-treeview';

export default class OrganizationUtils {

    /**
     * Build the menu tree by the specified organization instances type
     * @param organization to build
     * @param parent the parent organization item or undefined if root
     * @return the organization instances array or undefined
     */
    public static buildOrganization<O extends IOrganization>(
        organization: O[], parent?: TreeviewItem): TreeviewItem[] {
        return HierarchyUtils.buildModelTreeview(organization, 'name', parent);
    }
}
