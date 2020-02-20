import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseNgxTreeviewComponent} from '../../../treeview/base.treeview.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {TreeItem, TreeviewItem} from 'ngx-treeview';
import {IContextMenu, IEvent} from '../../../abstract.component';
import {COMMON} from '../../../../../config/common.config';
import { CategoriesDataSource } from '../../../../../services/implementation/categories/categories.datasource';
import Categories, { ICategories } from '../../../../../@core/data/warehouse_catelogies';
import CategoriesUtils from '../../../../../utils/categories.utils';
import {ToastrService} from 'ngx-toastr';

export const CategoriesTreeviewConfig: TreeviewConfig = {
    decoupleChildFromParent: false,
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasDivider: false,
    hasFilter: true,
    maxHeight: -1,
};

export const CategoriesContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

/**
 * Base tree-view component base on {TreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view',
    templateUrl: '../../../treeview/treeview.component.html',
    styleUrls: ['../../../treeview/treeview.component.scss'],
})
export class CategoriesTreeviewComponent extends BaseNgxTreeviewComponent<CategoriesDataSource> {

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
     * Create a new instance of {OrganizationTreeviewComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toastrService
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     */
    constructor(@Inject(CategoriesDataSource) dataSource: CategoriesDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toastrService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef) {
        super(dataSource, contextMenuService, toastrService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef);
        super.setConfig(CategoriesTreeviewConfig);
        super.setContextMenu(CategoriesContextMenu);
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
        setTimeout(() => this.focus(), 300);
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
            newItem.text = this.getTranslateService().instant('system.categories.new');
            newItem.value = new Categories(
                undefined, undefined, undefined, undefined);
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
     * Mapping organization data to organization tree item
     * @param data to map
     */
    mappingDataSourceToTreeviewItems(data: any): TreeviewItem[] {
        return CategoriesUtils.buildCategories(data as ICategories[]);
    }

    /**
     * Focus on tree-view
     */
    public focus(): void {
        let treeviewEls: NodeListOf<HTMLElement>;
        treeviewEls = this.getElementsBySelector(
            CategoriesTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);
        if (treeviewEls && treeviewEls.length) {
            this.toggleTreeviewItemElement(treeviewEls.item(0));

        } else {
            treeviewEls = this.getElementsBySelector(
                CategoriesTreeviewComponent.TREEVIEW_ELEMENT_SELECTOR);
            if (treeviewEls && treeviewEls.length) {
                treeviewEls.item(0).focus();
            }
        }
    }
}
