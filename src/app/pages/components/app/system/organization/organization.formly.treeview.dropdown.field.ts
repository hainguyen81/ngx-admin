import {DropdownTreeviewFormFieldComponent} from '../../../formly/formly.treeview.dropdown.field';
import {TreeviewI18nDefault, TreeviewItem, TreeviewSelection} from 'ngx-treeview';
import {IOrganization} from '../../../../../@core/data/system/organization';
import {AfterViewInit, Component, Inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

/**
 * Multi language for organization treeview field
 */
export class OrganizationTreeviewI18n extends TreeviewI18nDefault {

    constructor(@Inject(TranslateService) private translateService: TranslateService) {
        super();
    }

    getText(selection: TreeviewSelection): string {
        if (selection.uncheckedItems.length === 0) {
            return this.getAllCheckboxText();
        }

        switch (selection.checkedItems.length) {
            case 0:
                return (this.translateService ? this.translateService.instant(
                    'system.organization.form.belongTo.not_selection') : 'Select organization');
            case 1:
                return selection.checkedItems[0].text;
            default:
                return `${selection.checkedItems.length} organization selected`;
        }
    }

    getAllCheckboxText(): string {
        return (this.translateService ? this.translateService.instant(
            'system.organization.form.belongTo.all_selection') : 'All organization');
    }

    getFilterPlaceholder(): string {
        return (this.translateService ? this.translateService.instant(
            'system.organization.form.belongTo.filter') : 'Filter');
    }

    getFilterNoItemsFoundText(): string {
        return (this.translateService ? this.translateService.instant(
            'system.organization.form.belongTo.not_found') : 'No organization found');
    }

    getTooltipCollapseExpandText(isCollapse: boolean): string {
        return (this.translateService ? this.translateService.instant(
            isCollapse ? 'system.organization.form.belongTo.expand'
                : 'system.organization.form.belongTo.collapse')
            : isCollapse ? 'Expand' : 'Collapse');
    }
}

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
    extends DropdownTreeviewFormFieldComponent
    implements AfterViewInit {

    constructor(@Inject(TranslateService) private translateService: TranslateService) {
        super();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.getTreeviewComponent()
        && this.getTreeviewComponent().setTreeviewI18n(
            new OrganizationTreeviewI18n(this.translateService));
    }

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
