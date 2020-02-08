import {AfterViewInit, Component, ComponentFactoryResolver, Inject, Renderer2, ViewContainerRef} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewItem} from 'ngx-treeview';
import {AbstractTreeviewComponent} from './abstract.treeview.component';
import {IEvent} from '../abstract.component';
import KeyboardUtils from '../../../utils/keyboard.utils';
import HtmlUtils from '../../../utils/html.utils';

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
            itemEl = (targetEl.tagName === NgxTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR
                ? targetEl : targetEl.closest(NgxTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR));
            if (itemEl && !itemEl.classList.contains('selected')) {
                // clear another selected items
                let prevSelectedItemEls: NodeListOf<HTMLElement>;
                prevSelectedItemEls = this.getElementsBySelector(
                    [NgxTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, '.selected'].join(''));
                if (prevSelectedItemEls && prevSelectedItemEls.length) {
                    prevSelectedItemEls.forEach(selItemEl => this.toggleElementClass(selItemEl, 'selected', false));
                }

                // toggle current selected item
                this.toggleElementClass(itemEl as HTMLElement, 'selected', true);
            }
        }
    }

    /**
     * Perform navigate keydown action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onNavigateKeyDown(event: IEvent): void {
        super.onNavigateKeyDown(event);

        let kbEvent: KeyboardEvent;
        kbEvent = event.$event as KeyboardEvent;

        // check whether navigating on context menu
        let targetEl: HTMLElement;
        targetEl = event.$event.target as HTMLElement;
        if (targetEl
            && (targetEl.closest(AbstractTreeviewComponent.CONTEXT_MENU_SELECTOR)
                || targetEl.closest(AbstractTreeviewComponent.TREEVIEW_SEARCH_ELEMENT_SELECTOR))) {
            return;

        } else {
            // close context menu if necessary
            this.closeContextMenu();
        }

        // detect event data
        let item: TreeviewItem;
        item = event.$data as TreeviewItem;

        // detect the latest hovered item element
        let treeviewItemEls: NodeListOf<HTMLElement>;
        treeviewItemEls = this.getElementsBySelector(
            NgxTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);
        let hoveredItemEls: NodeListOf<HTMLElement>;
        hoveredItemEls = this.getElementsBySelector(
            [AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, '.selected'].join(''));
        if (!hoveredItemEls || !hoveredItemEls.length) {
            this.toggleElementClass(treeviewItemEls.item(0), 'selected', true);

        } else {
            let hoveredItemEl: HTMLElement;
            hoveredItemEl = hoveredItemEls.item(hoveredItemEls.length - 1);
            let nextSibling: Element;
            nextSibling = HtmlUtils.nextSibling(hoveredItemEl,
                NgxTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);
            let prevSibling: Element;
            prevSibling = HtmlUtils.previousSibling(hoveredItemEl,
                NgxTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);

            // toggle hover class
            this.toggleElementClass(hoveredItemEl, 'selected', false);
            if (KeyboardUtils.isHomeKey(kbEvent) || KeyboardUtils.isPageUpKey(kbEvent)
                || (KeyboardUtils.isUpKey(kbEvent) && !prevSibling)) {
                hoveredItemEl = treeviewItemEls.item(0);
                this.toggleElementClass(hoveredItemEl, 'selected', true);

            } else if (KeyboardUtils.isEndKey(kbEvent) || KeyboardUtils.isPageDownKey(kbEvent)
                || (KeyboardUtils.isDownKey(kbEvent) && !nextSibling)) {
                hoveredItemEl = treeviewItemEls.item(treeviewItemEls.length - 1);
                this.toggleElementClass(hoveredItemEl, 'selected', true);

            } else if (KeyboardUtils.isUpKey(kbEvent)) {
                hoveredItemEl = prevSibling as HTMLElement;
                this.toggleElementClass(hoveredItemEl, 'selected', true);

            } else if (KeyboardUtils.isDownKey(kbEvent)) {
                hoveredItemEl = nextSibling as HTMLElement;
                this.toggleElementClass(hoveredItemEl, 'selected', true);

            } else if (KeyboardUtils.isRightKey(kbEvent) && item
                && item.children && item.children.length && item.collapsed) {
                item.collapsed = !item.collapsed;

            } else if (KeyboardUtils.isLeftKey(kbEvent) && item
                && item.children && item.children.length && !item.collapsed) {
                item.collapsed = !item.collapsed;
            }
        }

        this.preventEvent(event.$event);
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
}
