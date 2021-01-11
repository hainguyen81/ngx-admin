import {TreeviewI18n, TreeviewI18nDefault, TreeviewItem, TreeviewSelection} from 'ngx-treeview';
import {
    AfterViewInit, ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    Injectable, OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IWarehouseCategory} from '../../../../../../@core/data/warehouse/warehouse.category';
import {TOKEN_APP_TREEVIEW_SHOW_ALL} from '../../../components/app.treeview.i18n';
import {NGXLogger} from 'ngx-logger';
import {Constants} from '../../../../../../@core/data/constants/common.constants';
import {
    WarehouseCategoryDatasource,
} from '../../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import {
    AppModuleDataIndexFormlyTreeviewFieldComponent,
} from '../../../components/common/app.module.data.index.formly.treeview.field.component';
import WarehouseUtils from '../../../../../../utils/warehouse/warehouse.utils';
import {Observable} from 'rxjs';

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
            if (selection && (selection.checkedItems || []).length) {
                return this.getAllCheckboxText();
            } else {
                return '';
            }
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
    moduleId: Constants.COMMON.MODULE_CODES.WAREHOUSE_SETTINGS_CATEGORY,
    selector: 'ngx-formly-treeview-dropdown-app-module-data-index-warehouse-category',
    templateUrl: '../../../../formly/formly.treeview.dropdown.field.component.html',
    styleUrls: ['../../../../formly/formly.treeview.dropdown.field.component.scss'],
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
export class WarehouseCategoryFormlyTreeviewFieldComponent
    extends AppModuleDataIndexFormlyTreeviewFieldComponent<IWarehouseCategory, WarehouseCategoryDatasource>
    implements OnInit, AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get isEnabledItemImage(): boolean {
        return true;
    }

    protected get dataIndexKey(): IDBKeyRange {
        return undefined;
    }

    protected get dataIndexName(): string {
        return '';
    }

    protected get disableValue(): any {
        return (this.field ? this.field.model : undefined);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseCategoryFormlyTreeviewFieldComponent} class
     * @param _dataSource {WarehouseCategoryDatasource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(WarehouseCategoryDatasource) _dataSource: WarehouseCategoryDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit() {
        if (this.field) {
            this.field.templateOptions = (this.field.templateOptions || {});
            this.field.templateOptions['treeBuilder'] = WarehouseUtils.buildWarehouseCategories;
        }

        super.ngOnInit();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.getTreeviewComponent()
        && this.getTreeviewComponent().setItemImageParser((item?: TreeviewItem) => {
            let category: IWarehouseCategory;
            category = (item && item.value ? <IWarehouseCategory>item.value : null);
            return (category ? category.image : null);
        });
    }

    protected loadData(): Observable<IWarehouseCategory[] | IWarehouseCategory>
        | Promise<IWarehouseCategory[] | IWarehouseCategory> | IWarehouseCategory[] | IWarehouseCategory {
        return this.dataSource.setPaging(1, undefined, false)
            .setFilter([], false, false).getAll();
    }
}
