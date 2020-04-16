import {TreeviewI18n, TreeviewI18nDefault, TreeviewSelection} from 'ngx-treeview';
import {IOrganization} from '../../../../../@core/data/system/organization';
import {Component, Inject, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {APP_TREEVIEW_SHOW_ALL} from '../../components/app.treeview.i18n';
import {AppFormlyTreeviewDropdownFieldComponent} from '../../components/app.formly.treeview.dropdown.field';
import {API} from '../../../../../config/api.config';

/**
 * Multi language for treeview field
 */
@Injectable()
export class OrganizationTreeviewI18n extends TreeviewI18nDefault {

    constructor(@Inject(TranslateService) private translateService: TranslateService,
                @Inject(APP_TREEVIEW_SHOW_ALL) private showAll?: boolean | true) {
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
    moduleId: API.organization.code,
    selector: 'ngx-formly-treeview-dropdown-app-organization',
    templateUrl: '../../../formly/formly.treeview.dropdown.field.component.html',
    styleUrls: ['../../../formly/formly.treeview.dropdown.field.component.scss'],
    providers: [
        {
            provide: APP_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: OrganizationTreeviewI18n,
            deps: [TranslateService, APP_TREEVIEW_SHOW_ALL],
        },
    ],
})
export class OrganizationFormlyTreeviewDropdownFieldComponent
    extends AppFormlyTreeviewDropdownFieldComponent<IOrganization> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get isEnabledItemImage(): boolean {
        return false;
    }

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
}
