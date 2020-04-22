import {Inject, Injectable, InjectionToken} from '@angular/core';
import {TreeviewI18nDefault, TreeviewSelection} from 'ngx-treeview';
import {TranslateService} from '@ngx-translate/core';

export const TOKEN_APP_TREEVIEW_SHOW_ALL = new InjectionToken<boolean>('True for show \'All\'; else False');

/**
 * Multi language for treeview field
 */
@Injectable()
export class AppTreeviewI18n extends TreeviewI18nDefault {

    constructor(@Inject(TranslateService) private translateService: TranslateService,
                @Inject(TOKEN_APP_TREEVIEW_SHOW_ALL) private showAll?: boolean | true) {
        super();
    }

    getText(selection: TreeviewSelection): string {
        if ((!selection || !(selection.uncheckedItems || []).length) && this.showAll) {
            return this.getAllCheckboxText();
        }

        switch (((selection || {})['checkedItems'] || []).length) {
            case 0:
                return (this.translateService ? this.translateService.instant(
                    'common.form.treeview.not_selection') : 'Select option');
            case 1:
                return (((selection || {})['checkedItems'] || [])[0].text || '').trim();
            default:
                return `${((selection || {})['checkedItems'] || []).length} options selected`;
        }
    }

    getAllCheckboxText(): string {
        return (this.translateService ? this.translateService.instant(
            'common.form.treeview.all_selection') : 'All options');
    }

    getFilterPlaceholder(): string {
        return (this.translateService ? this.translateService.instant(
            'common.form.treeview.filter') : 'Filter');
    }

    getFilterNoItemsFoundText(): string {
        return (this.translateService ? this.translateService.instant(
            'common.form.treeview.not_found') : 'No options found');
    }

    getTooltipCollapseExpandText(isCollapse: boolean): string {
        return (this.translateService ? this.translateService.instant(
            isCollapse ? 'common.form.treeview.expand'
                : 'common.form.treeview.collapse')
            : isCollapse ? 'Expand' : 'Collapse');
    }
}
