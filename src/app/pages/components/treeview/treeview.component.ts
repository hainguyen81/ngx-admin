import {AfterViewInit, Component, ComponentFactoryResolver, Inject, Renderer2, ViewContainerRef} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewItem} from 'ngx-treeview';
import {AbstractTreeviewComponent} from './abstract.treeview.component';
import {IEvent} from '../abstract.component';
import {throwError} from 'rxjs';

/**
 * Tree-view component base on {TreeviewComponent} and {DropdownTreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
})
export class NgxTreeviewComponent extends AbstractTreeviewComponent<DataSource> implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private enabledItemCheck?: boolean | false;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating this component whether uses checkbox for tree-view item
     * @return true for using checkbox; else false
     */
    public isEnabledItemCheck(): boolean {
        return this.enabledItemCheck;
    }

    /**
     * Set a boolean value indicating this component whether uses checkbox for tree-view item
     * @param enabledItemCheck true for using checkbox; else false
     */
    protected setEnabledItemCheck(enabledItemCheck?: boolean | false): void {
        this.enabledItemCheck = enabledItemCheck;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NgxTreeviewComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     */
    constructor(@Inject(DataSource) dataSource: DataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
        super(dataSource, contextMenuService, logger, renderer,
            translateService, factoryResolver, viewContainerRef, null, false);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Raise when tree-view item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {TreeviewItem}
     */
    onClickItem(event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClickItem', event);
        if (event && event.$event && event.$event.target instanceof Element) {
            let targetEl: Element;
            targetEl = event.$event.target as Element;
            let itemEl: Element;
            itemEl = (targetEl.tagName === AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR
                ? targetEl : targetEl.closest(AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR));
            if (itemEl && !itemEl.classList.contains('selected')) {
                // clear another selected items
                let prevSelectedItemEls: NodeListOf<HTMLElement>;
                prevSelectedItemEls = this.getElementsBySelector(
                    [AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, '.selected'].join(''));
                if (prevSelectedItemEls && prevSelectedItemEls.length) {
                    prevSelectedItemEls.forEach(selItemEl => this.toggleElementClass(selItemEl, 'selected', false));
                }

                // toggle current selected item
                this.toggleElementClass(itemEl as HTMLElement, 'selected', true);
            }
        }
    }

    /**
     * Perform action on menu item has been clicked
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      event: action event
     *      item: menu item data
     */
    onMenuEvent(event: IEvent) {
        super.onMenuEvent(event);

    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Map the specified data from data-source to tree-view items to show
     * @param data to map
     */
    mappingDataSourceToTreeviewItems(data: any): TreeviewItem[] {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('mappingDataSourceToTreeviewItems', data);
        return [];
    }

    /**
     * Get {TreeviewItem} of the specified tree-view item DOM element
     * @param treeviewItemEl to detect
     * @return {TreeviewItem}
     */
    public getTreeviewItemByElement(treeviewItemEl: HTMLElement): TreeviewItem {
        treeviewItemEl || throwError('Could not get tree-view item of undefined element');

        let itemRowEl: HTMLElement;
        itemRowEl = this.getFirstElementBySelector(
            AbstractTreeviewComponent.TREEVIEW_ITEM_ROW_ELEMENT_SELECTOR, treeviewItemEl);
        if (itemRowEl && (itemRowEl.id || '').length) {
            return this.findTreeviewItemById(itemRowEl.id);
        }
        return undefined;
    }

    /**
     * Find the tree-item by data identity
     * @param id to find
     * @param item specify whether filter only in this item. undefined for all items
     * @return {TreeviewItem}
     */
    private findTreeviewItemById(id: string, item?: TreeviewItem): TreeviewItem {
        // if specifying item to filter
        if (item) {
            if (item && item.value && item.value['id'] === id) {
                return item;
            }
            if (item.children && item.children.length) {
                for (const it of item.children) {
                    let found: TreeviewItem;
                    found = this.findTreeviewItemById(id, it);
                    if (found) {
                        return found;
                    }
                }
            }

            // search all
        } else {
            for (const it of this.getTreeviewItems()) {
                let found: TreeviewItem;
                found = this.findTreeviewItemById(id, it);
                if (found) {
                    return found;
                }
            }
        }
        return undefined;
    }
}
