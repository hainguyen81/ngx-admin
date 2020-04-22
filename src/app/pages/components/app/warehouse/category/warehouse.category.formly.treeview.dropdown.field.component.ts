import {TreeviewI18n, TreeviewI18nDefault, TreeviewItem, TreeviewSelection} from 'ngx-treeview';
import {AfterViewInit, Component, Inject, Injectable, Renderer2} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IWarehouseCategory} from '../../../../../@core/data/warehouse/warehouse.category';
import {
    AppFormlyTreeviewDropdownFieldComponent,
} from '../../components/app.formly.treeview.dropdown.field.component';
import {TOKEN_APP_TREEVIEW_SHOW_ALL} from '../../components/app.treeview.i18n';
import {API} from '../../../../../config/api.config';
import {NGXLogger} from 'ngx-logger';

/**
 * Multi language for treeview field
 */
@Injectable()
export class WarehouseCategoryTreeviewI18n extends TreeviewI18nDefault {

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
                    'warehouse.category.form.belongTo.not_selection') : 'Select category');
            case 1:
                return (((selection || {})['checkedItems'] || [])[0].text || '').trim();
            default:
                return `${((selection || {})['checkedItems'] || []).length} categories selected`;
        }
    }

    getAllCheckboxText(): string {
        return (this.translateService ? this.translateService.instant(
            'warehouse.category.form.belongTo.all_selection') : 'All categories');
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
    moduleId: API.warehouseCategory.code,
    selector: 'ngx-formly-treeview-dropdown-app-warehouse-category',
    templateUrl: '../../../formly/formly.treeview.dropdown.field.component.html',
    styleUrls: ['../../../formly/formly.treeview.dropdown.field.component.scss'],
    providers: [
        {
            provide: TOKEN_APP_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: WarehouseCategoryTreeviewI18n,
            deps: [TranslateService, TOKEN_APP_TREEVIEW_SHOW_ALL],
        },
    ],
})
export class WarehouseCategoryFormlyTreeviewDropdownFieldComponent
    extends AppFormlyTreeviewDropdownFieldComponent<IWarehouseCategory>
    implements AfterViewInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseCategoryFormlyTreeviewDropdownFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     */
    constructor(@Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_translateService, _renderer, _logger);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.getTreeviewComponent()
        && this.getTreeviewComponent().setItemImageParser((item?: TreeviewItem) => {
            let category: IWarehouseCategory;
            category = (item && item.value ? <IWarehouseCategory>item.value : null);
            return (category ? category.image : null);
        });
    }
}
