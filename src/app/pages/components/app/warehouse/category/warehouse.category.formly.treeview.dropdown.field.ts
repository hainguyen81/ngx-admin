import {DropdownTreeviewFormFieldComponent} from '../../../formly/formly.treeview.dropdown.field';
import {TreeviewI18n, TreeviewI18nDefault, TreeviewItem, TreeviewSelection} from 'ngx-treeview';
import {AfterViewInit, Component, Inject, Injectable, InjectionToken, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import ObjectUtils from '../../../../../utils/object.utils';
import {IWarehouseCategory} from '../../../../../@core/data/warehouse/warehouse.category';

export const WAREHOUSE_CATEGORY_TREEVIEW_SHOW_ALL =
    new InjectionToken<boolean>('True for show \'All\'; else False');

/**
 * Multi language for organization treeview field
 */
@Injectable()
export class WarehouseCategoryTreeviewI18n extends TreeviewI18nDefault {

    constructor(@Inject(TranslateService) private translateService: TranslateService,
                @Inject(WAREHOUSE_CATEGORY_TREEVIEW_SHOW_ALL) private showAll?: boolean | true) {
        super();
    }

    getText(selection: TreeviewSelection): string {
        if ((!selection || !(selection.uncheckedItems || []).length) && this.showAll) {
            return this.getAllCheckboxText();
        }

        switch (((selection || {})['checkedItems'] || []).length) {
            case 0:
                return (this.translateService ? this.translateService.instant(
                    'warehouse.category.form.belongTo.not_selection') : 'Select category');
            case 1:
                return (((selection || {})['checkedItems'] || [])[0].text || '').trim();
            default:
                return `${((selection || {})['checkedItems'] || []).length} categories selected`;
        }
    }

    getAllCheckboxText(): string {
        return (this.translateService ? this.translateService.instant(
            'warehouse.category.form.belongTo.all_selection') : 'All category');
    }

    getFilterPlaceholder(): string {
        return (this.translateService ? this.translateService.instant(
            'warehouse.category.form.belongTo.filter') : 'Filter');
    }

    getFilterNoItemsFoundText(): string {
        return (this.translateService ? this.translateService.instant(
            'warehouse.category.form.belongTo.not_found') : 'No category found');
    }

    getTooltipCollapseExpandText(isCollapse: boolean): string {
        return (this.translateService ? this.translateService.instant(
            isCollapse ? 'warehouse.category.form.belongTo.expand'
                : 'warehouse.category.form.belongTo.collapse')
            : isCollapse ? 'Expand' : 'Collapse');
    }
}

/**
 * Custom warehouse category formly field for selecting parent category
 */
@Component({
    selector: 'ngx-formly-treeview-dropdown-warehouse-category',
    templateUrl: '../../../formly/formly.treeview.dropdown.field.html',
    styleUrls: ['../../../formly/formly.treeview.dropdown.field.scss' ],
    providers: [
        {
            provide: WAREHOUSE_CATEGORY_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: WarehouseCategoryTreeviewI18n,
            deps: [ TranslateService, WAREHOUSE_CATEGORY_TREEVIEW_SHOW_ALL ],
        },
    ],
})
export class WarehouseCategoryFormlyTreeviewDropdownFieldComponent
    extends DropdownTreeviewFormFieldComponent
    implements OnInit, AfterViewInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseCategoryFormlyTreeviewDropdownFieldComponent} class
     * @param translateService {TranslateService}
     */
    constructor(@Inject(TranslateService) _translateService: TranslateService) {
        super(_translateService);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        this.getTreeviewComponent()
        && this.getTreeviewComponent().setEnabledItemImage(true);
        this.getTreeviewComponent()
        && this.getTreeviewComponent().setItemImageParser((item?: TreeviewItem) => {
            let category: IWarehouseCategory;
            category = (item && item.value ? <IWarehouseCategory>item.value : null);
            return (category ? category.image : null);
        });
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Disable the treeview item by the specified organization
     * @param value to disable
     */
    public disableItemsByValue(value?: IWarehouseCategory | null): void {
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
