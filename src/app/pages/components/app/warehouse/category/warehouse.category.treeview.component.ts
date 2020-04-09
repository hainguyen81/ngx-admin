import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseNgxTreeviewComponent} from '../../../treeview/base.treeview.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {TreeItem, TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {IContextMenu, IEvent} from '../../../abstract.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {
    WarehouseCategoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import WarehouseCategory, {
    CATEGORY_TYPE,
    IWarehouseCategory,
} from '../../../../../@core/data/warehouse/warehouse.category';
import WarehouseUtils from '../../../../../utils/warehouse/warehouse.utils';
import {
    WAREHOUSE_CATEGORY_TREEVIEW_SHOW_ALL,
    WarehouseCategoryTreeviewI18n,
} from './warehouse.category.formly.treeview.dropdown.field';

export const WarehouseCategoryTreeviewConfig: TreeviewConfig = {
    decoupleChildFromParent: false,
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasDivider: false,
    hasFilter: true,
    maxHeight: -1,
};

export const WarehouseCategoryContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

/**
 * Base tree-view component base on {TreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view-warehouse-category',
    templateUrl: '../../../treeview/treeview.component.html',
    styleUrls: ['../../../treeview/treeview.component.scss'],
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
export class WarehouseCategoryTreeviewComponent extends BaseNgxTreeviewComponent<WarehouseCategoryDatasource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private clickItemDelegate: (event: MouseEvent, item: TreeviewItem) => void;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Set the item click listener
     * @param clickItemDelegate listener
     */
    public setClickItemListener(clickItemDelegate: (event: MouseEvent, item: TreeviewItem) => void) {
        this.clickItemDelegate = clickItemDelegate;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseCategoryTreeviewComponent} class
     * @param dataSource {WarehouseCategoryDatasource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param elementRef {ElementRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     * @param lightbox {Lightbox}
     */
    constructor(@Inject(WarehouseCategoryDatasource) dataSource: WarehouseCategoryDatasource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toasterService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) elementRef: ElementRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        super.setConfig(WarehouseCategoryTreeviewConfig);
        super.setContextMenu(WarehouseCategoryContextMenu);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Raise when tree-view item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {TreeviewItem}
     */
    onClickItem(event: IEvent) {
        super.onClickItem(event);
        this.clickItemDelegate
        && this.clickItemDelegate.apply(this, [event.$event, event.$data]);
    }

    /**
     * Perform action on data-source changed event
     * @param event {IEvent} that contains {$event} as changed values
     */
    onDataSourceChanged(event: IEvent) {
        super.onDataSourceChanged(event);
        let timer: number;
        timer = window.setTimeout(() => {
            this.focus();
            window.clearTimeout(timer);
        }, 300);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.getDataSource().refresh();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Create new tree-view item node with the specified node data and the parent node
     * @param parent parent tree-view item {TreeviewItem}
     * @param treeItem new tree-view item data {TreeItem}
     * @return new tree-view item
     */
    protected newItem(parent?: TreeviewItem, treeItem?: TreeItem): TreeviewItem {
        let newItem: TreeviewItem;
        newItem = super.newItem(parent, treeItem);
        if (newItem) {
            newItem.text = this.translate('warehouse.category.new');
            newItem.value = new WarehouseCategory(
                undefined, undefined, undefined, CATEGORY_TYPE.CATEGORY);
        }
        return newItem;
    }

    /**
     * Delete the specified {TreeviewItem}
     * @param treeviewItem to delete
     * @return the deleted {TreeviewItem}
     */
    protected deleteItem(treeviewItem: TreeviewItem): TreeviewItem {
        return this.doDeleteItemFromDataSource(super.deleteItem(treeviewItem));
    }

    /**
     * Delete the specified {TreeviewItem} from data source
     * @param item to delete
     * @return the deleted item
     */
    private doDeleteItemFromDataSource(item: TreeviewItem): TreeviewItem {
        if (!item || !item.value) {
            return item;
        }

        // check for deleting children first
        if (item.children && item.children.length) {
            for (const it of item.children) {
                this.doDeleteItemFromDataSource(it);
            }
        }

        // if valid identity to delete
        if (item.value && (item.value['id'] || '').length) {
            this.getDataSource().remove(item.value)
                .then(() => this.getLogger().debug('DELETED?', item.value),
                    (errors) => this.getLogger().error(errors));
        }
        return item;
    }

    /**
     * Mapping warehouse categories data to warehouse categories tree item
     * @param data to map
     */
    mappingDataSourceToTreeviewItems(data: any): TreeviewItem[] {
        return WarehouseUtils.buildWarehouseCategories(data as IWarehouseCategory[]);
    }

    /**
     * Focus on tree-view
     */
    public focus(): void {
        let treeviewEls: NodeListOf<HTMLElement>;
        treeviewEls = this.getElementsBySelector(
            WarehouseCategoryTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);
        if (treeviewEls && treeviewEls.length) {
            this.toggleTreeviewItemElement(treeviewEls.item(0));

        } else {
            treeviewEls = this.getElementsBySelector(
                WarehouseCategoryTreeviewComponent.TREEVIEW_ELEMENT_SELECTOR);
            if (treeviewEls && treeviewEls.length) {
                treeviewEls.item(0).focus();
            }
        }
    }
}
