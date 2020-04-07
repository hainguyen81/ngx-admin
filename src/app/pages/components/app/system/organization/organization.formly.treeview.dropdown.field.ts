import {DropdownTreeviewFormFieldComponent} from '../../../formly/formly.treeview.dropdown.field';
import {TreeviewItem} from 'ngx-treeview';
import {IOrganization} from '../../../../../@core/data/system/organization';
import {Component} from '@angular/core';

/**
 * Custom organization formly field for selecting parent organization
 */
@Component({
    selector: 'ngx-formly-treeview-dropdown-organization',
    templateUrl: '../../../formly/formly.treeview.dropdown.field.html',
    styleUrls: ['../../../formly/formly.treeview.dropdown.field.scss',
        './organization.formly.treeview.dropdown.field.scss'],
})
export class OrganizationFormlyTreeviewDropdownFieldComponent
    extends DropdownTreeviewFormFieldComponent {

    protected valueFormatter(value: any): TreeviewItem {
        return this.filterOrganizationTreeItem(value);
    }

    protected valueParser(value?: any): any {
        return (value as IOrganization ? (value as IOrganization).id
            : value && value.value as IOrganization ? (value.value as IOrganization).id : null);
    }

    private filterOrganizationTreeItem(value: any): TreeviewItem {
        let itemValue: TreeviewItem;
        itemValue = null;
        let items: TreeviewItem[];
        items = this.getTreeviewItems() || [];
        for (const it of items) {
            itemValue = this.filterOrganizationTreeItemRecursively(value, it);
            if (itemValue) break;
        }
        return itemValue;
    }
    private filterOrganizationTreeItemRecursively(value: any, item?: TreeviewItem | null): TreeviewItem {
        if (item && item.value as IOrganization && (item.value as IOrganization).id === value) {
            return item;
        }
        if (item && (item.children || []).length) {
            for (const it of item.children) {
                if (this.filterOrganizationTreeItemRecursively(value, it)) {
                    return it;
                }
            }
        }
        return null;
    }
}
