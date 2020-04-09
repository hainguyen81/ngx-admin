import {DropdownTreeviewFormFieldComponent} from '../../../formly/formly.treeview.dropdown.field';
import {TreeviewI18n, TreeviewI18nDefault, TreeviewItem, TreeviewSelection} from 'ngx-treeview';
import {IOrganization} from '../../../../../@core/data/system/organization';
import {Component, Inject, Injectable, InjectionToken} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import ObjectUtils from '../../../../../utils/object.utils';

export const ORGANIZATION_TREEVIEW_SHOW_ALL =
    new InjectionToken<boolean>('True for show \'All\'; else False');

/**
 * Multi language for organization treeview field
 */
@Injectable()
export class OrganizationTreeviewI18n extends TreeviewI18nDefault {

    constructor(@Inject(TranslateService) private translateService: TranslateService,
                @Inject(ORGANIZATION_TREEVIEW_SHOW_ALL) private showAll?: boolean | true) {
        super();
    }

    getText(selection: TreeviewSelection): string {
        if (selection.uncheckedItems.length === 0 && this.showAll) {
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
    styleUrls: ['../../../formly/formly.treeview.dropdown.field.scss' ],
    providers: [
        {
            provide: ORGANIZATION_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: OrganizationTreeviewI18n,
            deps: [ TranslateService, ORGANIZATION_TREEVIEW_SHOW_ALL ],
        },
    ],
})
export class OrganizationFormlyTreeviewDropdownFieldComponent
    extends DropdownTreeviewFormFieldComponent {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {OrganizationFormlyTreeviewDropdownFieldComponent} class
     * @param translateService {TranslateService}
     */
    constructor(@Inject(TranslateService) _translateService: TranslateService) {
        super(_translateService);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Disable the treeview item by the specified organization
     * @param value to disable
     */
    public disableItemsByValue(value?: IOrganization | null): void {
        let item: TreeviewItem;
        item = (value && value.id ? this.valueFormatter(value.id) : null);
        item && this.disableItems(item);
    }

    protected valueFormatter(value: any): TreeviewItem {
        return this.filterValueTreeItem(value, 'id');
    }

    protected valueParser(value?: any): any {
        let itValue: TreeviewItem;
        itValue = ObjectUtils.cast(value, TreeviewItem);
        return (itValue && itValue.value ? itValue.value['id'] : (value || {})['id']);
    }
}
