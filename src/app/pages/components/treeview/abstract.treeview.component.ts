import {
    AfterViewInit,
    ComponentFactoryResolver,
    Inject,
    OnInit,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {
    AbstractComponent,
    CONTEXT_MENU_ADD,
    CONTEXT_MENU_DELETE,
    CONTEXT_MENU_EDIT,
    IContextMenu,
    IEvent,
} from '../abstract.component';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {DropdownTreeviewComponent, TreeItem, TreeviewComponent, TreeviewItem} from 'ngx-treeview';
import HtmlUtils from '../../../utils/html.utils';
import KeyboardUtils from '../../../utils/keyboard.utils';
import {ToasterService} from 'angular2-toaster';

/* default tree-view config */
export const DefaultTreeviewConfig: TreeviewConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: true,
    hasFilter: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
});

/**
 * Abstract tree-view component base on {TreeviewComponent} and {DropdownTreeviewComponent}
 */
export abstract class AbstractTreeviewComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit, OnInit {

    protected static TREEVIEW_ELEMENT_SELECTOR: string = 'ngx-treeview';
    protected static TREEVIEW_ITEM_ELEMENT_SELECTOR: string = 'ngx-treeview-item';
    protected static TREEVIEW_ITEM_ROW_ELEMENT_SELECTOR: string = '.row-item';
    protected static TREEVIEW_SEARCH_ELEMENT_SELECTOR: string = '.row-filter';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(TreeviewComponent)
    private readonly queryTreeviewComponent: QueryList<TreeviewComponent>;
    private treeviewComponent: TreeviewComponent;

    @ViewChildren(DropdownTreeviewComponent)
    private readonly queryDropdownTreeviewComponent: QueryList<DropdownTreeviewComponent>;
    private dropdownTreeviewComponent: DropdownTreeviewComponent;

    /* tree-view items array */
    private treeviewItems: TreeviewItem[];
    /* drop-down button class */
    private buttonClass?: string | null;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating this component whether is drop-down tree-view component
     * @return true for drop-down; else false
     */
    public isDropDown(): boolean {
        return this.dropdown;
    }

    /**
     * Set a boolean value indicating this component whether is drop-down tree-view component
     * @param dropdown true for drop-down; else false
     */
    protected setDropDown(dropdown?: boolean | false) {
        this.dropdown = dropdown;
    }

    /**
     * Get the drop-down button class in drop-down tree-view mode
     * return the drop-down button class
     */
    public getButtonClass(): string {
        return this.buttonClass;
    }

    /**
     * Set the drop-down button class in drop-down tree-view mode
     * @param buttonClass to apply
     */
    public setButtonClass(buttonClass?: string) {
        this.buttonClass = buttonClass || '';
    }

    /**
     * Get the {TreeviewConfig} instance for configuring
     * @return the {TreeviewConfig} instance
     */
    public getConfig(): TreeviewConfig {
        return this.treeviewConfig || DefaultTreeviewConfig;
    }

    /**
     * Set the {TreeviewConfig} instance
     * @param cfg to apply. NULL for default
     */
    protected setConfig(cfg?: TreeviewConfig) {
        this.treeviewConfig = cfg || DefaultTreeviewConfig;
    }

    /**
     * Get the {TreeviewComponent} component
     * @return the {TreeviewComponent} component
     */
    protected getTreeviewComponent(): TreeviewComponent {
        return this.treeviewComponent;
    }

    /**
     * Get the {DropdownTreeviewComponent} component
     * @return the {DropdownTreeviewComponent} component
     */
    protected getDropdownTreeviewComponent(): DropdownTreeviewComponent {
        return this.dropdownTreeviewComponent;
    }

    /**
     * Get the tree-view items array to show
     * @return the tree-view items array
     */
    protected getTreeviewItems(): TreeviewItem[] {
        return this.treeviewItems || [];
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToasterService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param treeviewConfig {TreeviewConfig}
     * @param dropdown specify using drop-down tree-view or normal tree-view
     */
    protected constructor(@Inject(DataSource) dataSource: T,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(ToasterService) toasterService: ToasterService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                          private treeviewConfig?: TreeviewConfig,
                          private dropdown?: boolean | false) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver, viewContainerRef);
        this.setConfig(treeviewConfig);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        (!this.treeviewComponent && this.queryTreeviewComponent)
        && this.queryTreeviewComponent.map(
            (item) => {
                this.treeviewComponent = item;
                this.treeviewComponent
                && this.treeviewComponent.selectedChange
                    .subscribe(value => this.onSelectedChange({$data: value}));
                this.treeviewComponent
                && this.treeviewComponent.filterChange
                    .subscribe(value => this.onFilterChange({$data: value}));
            });
        (!this.dropdownTreeviewComponent && this.queryDropdownTreeviewComponent)
        && this.queryDropdownTreeviewComponent.map(
            (item) => {
                this.dropdownTreeviewComponent = item;
                this.dropdownTreeviewComponent
                && this.dropdownTreeviewComponent.selectedChange
                    .subscribe(value => this.onSelectedChange({$data: value}));
                this.dropdownTreeviewComponent
                && this.dropdownTreeviewComponent.filterChange
                    .subscribe(value => this.onFilterChange({$data: value}));
            });
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
    }

    /**
     * Raise when selected items have been changed
     * @param event {IEvent} that contains {$data} as selected values
     */
    onSelectedChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSelectedChange', event);
    }

    /**
     * Raise when tree-view filter has been changed
     * @param event {IEvent} that contains {$data} as filtered values
     */
    onFilterChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onFilterChange', event);
    }

    /**
     * Perform action on data-source changed event
     * @param event {IEvent} that contains {$event} as changed values
     */
    onDataSourceChanged(event: IEvent) {
        this.getLogger().debug('DataSource has been changed', event);
        if (event && event.$data && event.$data.hasOwnProperty('elements')) {
            this.treeviewItems = this.mappingDataSourceToTreeviewItems(event.$data['elements']);

        } else {
            this.treeviewItems = [];
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
        if (targetEl && targetEl.closest(AbstractTreeviewComponent.TREEVIEW_SEARCH_ELEMENT_SELECTOR)) {
            return;
        }

        // detect the latest hovered item element
        let treeviewItemEls: NodeListOf<HTMLElement>;
        treeviewItemEls = this.getElementsBySelector(
            AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);
        let hoveredItemEls: NodeListOf<HTMLElement>;
        hoveredItemEls = this.getElementsBySelector(
            [AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, '.selected'].join(''));
        if (!hoveredItemEls || !hoveredItemEls.length) {
            this.toggleTreeviewItemElement(treeviewItemEls.item(0));

        } else {
            let hoveredItemEl: HTMLElement;
            hoveredItemEl = hoveredItemEls.item(hoveredItemEls.length - 1);
            let nextSibling: Element;
            nextSibling = HtmlUtils.next(hoveredItemEl,
                AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);
            let prevSibling: Element;
            prevSibling = HtmlUtils.previous(hoveredItemEl,
                AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);

            // toggle hover class
            if (KeyboardUtils.isHomeKey(kbEvent) || KeyboardUtils.isPageUpKey(kbEvent)
                || (KeyboardUtils.isUpKey(kbEvent) && !prevSibling)) {
                this.toggleElementClass(hoveredItemEl, 'selected', false);
                this.toggleTreeviewItemElement(treeviewItemEls.item(0));

            } else if (KeyboardUtils.isEndKey(kbEvent) || KeyboardUtils.isPageDownKey(kbEvent)
                || (KeyboardUtils.isDownKey(kbEvent) && !nextSibling)) {
                this.toggleElementClass(hoveredItemEl, 'selected', false);
                this.toggleTreeviewItemElement(treeviewItemEls.item(treeviewItemEls.length - 1));

            } else if (KeyboardUtils.isUpKey(kbEvent)) {
                this.toggleElementClass(hoveredItemEl, 'selected', false);
                this.toggleTreeviewItemElement(prevSibling as HTMLElement);

            } else if (KeyboardUtils.isDownKey(kbEvent)) {
                this.toggleElementClass(hoveredItemEl, 'selected', false);
                this.toggleTreeviewItemElement(nextSibling as HTMLElement);

            } else if (KeyboardUtils.isRightKey(kbEvent) || KeyboardUtils.isLeftKey(kbEvent)) {
                if (!this.toggleExpandCollapseTreeviewItemElement(hoveredItemEl)) {
                    // toggle selected parent item
                    let parentEl: HTMLElement;
                    parentEl = hoveredItemEl.parentElement.closest(
                        AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR) as HTMLElement;
                    parentEl && this.toggleElementClass(hoveredItemEl, 'selected', false);
                    parentEl && this.toggleTreeviewItemElement(parentEl);
                }
            }
        }

        this.preventEvent(event.$event);
    }

    /**
     * Perform action on menu item has been clicked
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      menu: menu item
     *      item: menu item data
     * and {$event} as action event
     */
    onMenuEvent(event) {
        let menuItem: IContextMenu;
        menuItem = (event && event.$data && event.$data['menu']
            ? event.$data['menu'] as IContextMenu : undefined);
        let mnuId: string;
        mnuId = (menuItem ? menuItem.id.apply(this, [event.$data['item']]) : '');
        switch (mnuId) {
            case CONTEXT_MENU_ADD:
                this.toggleTreeviewItem(this.newItem(event.$data['item']));
                break;
            case CONTEXT_MENU_EDIT:
                this.toggleTreeviewItem(event.$data['item']);
                break;
            case CONTEXT_MENU_DELETE:
                this.deleteItem(event.$data['item']);
                break;
        }
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Create new tree-view item node with the specified node data and the parent node
     * @param parent parent tree-view item {TreeviewItem}
     * @param treeItem new tree-view item data {TreeItem}
     * @return new tree-view item
     */
    protected newItem(parent?: TreeviewItem, treeItem?: TreeItem): TreeviewItem {
        let newItem: TreeviewItem;
        newItem = new TreeviewItem(treeItem || {
            checked: false,
            collapsed: true,
            disabled: false,
            text: '',
            value: {'id': (new Date()).getTime().toString()},
        });
        if (parent) {
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(newItem);
            // expand parent for new item
            parent.collapsed = false;

        } else {
            if (!this.treeviewItems) {
                this.treeviewItems = [];
            }
            this.treeviewItems.push(newItem);
        }
        return newItem;
    }

    /**
     * Delete the specified {TreeviewItem}
     * @param treeviewItem to delete
     */
    protected deleteItem(treeviewItem: TreeviewItem): void {
        if (!treeviewItem) {
            return;
        }

        let itIdx: number;
        itIdx = this.getTreeviewItems().indexOf(treeviewItem);
        if (itIdx < 0) {
            for (const it of this.getTreeviewItems()) {
                if (it.children && this.doDeleteItem(it, treeviewItem)) {
                    break;
                }
            }
        } else {
            this.getTreeviewItems().splice(itIdx, 1);
        }
    }

    /**
     * Delete the specified {TreeviewItem} out of the specified {TreeviewItem} parent if existed
     * @param parent to detect
     * @param delItem to delete
     * @return true for deleted; else false
     */
    private doDeleteItem(parent: TreeviewItem, delItem: TreeviewItem): boolean {
        if (!parent || !parent.children) {
            return false;
        }

        let itIdx: number;
        itIdx = parent.children.indexOf(delItem);
        if (itIdx < 0) {
            for (const it of parent.children) {
                if (it.children && this.doDeleteItem(it, delItem)) {
                    return true;
                }
            }
            return false;
        }

        parent.children.splice(itIdx, 1);
        return true;
    }

    /**
     * Map the specified data from data-source to tree-view items to show
     * @param data to map
     */
    abstract mappingDataSourceToTreeviewItems(data: any): TreeviewItem[];

    /**
     * Get {TreeviewItem} of the specified tree-view item DOM element
     * @param treeviewItemEl to detect
     * @return {TreeviewItem}
     */
    abstract getTreeviewItemByElement(treeviewItemEl: HTMLElement): TreeviewItem;

    /**
     * Toggle expand/collapse the specified tree-view item element
     * @param treeviewItemEl to toggle
     * @return true for toggled; else false
     */
    protected toggleExpandCollapseTreeviewItemElement(treeviewItemEl: HTMLElement): boolean {
        let item: TreeviewItem;
        item = (treeviewItemEl ? this.getTreeviewItemByElement(treeviewItemEl) : undefined);
        if (item && item.children && item.children.length) {
            item.collapsed = !item.collapsed;
            return true;
        }
        return false;
    }

    /**
     * Toggle selected the specified tree-view item element
     * @param treeviewItemEl to toggle
     */
    protected toggleTreeviewItemElement(treeviewItemEl: HTMLElement) {
        treeviewItemEl && this.toggleElementClass(treeviewItemEl, 'selected', true);
        treeviewItemEl && this.onClickItem({$data: this.getTreeviewItemByElement(treeviewItemEl)});
    }

    /**
     * Toggle selected the specified tree-view item
     * @param treeviewItem to toggle
     */
    protected toggleTreeviewItem(treeviewItem: TreeviewItem) {
        if (!treeviewItem || !treeviewItem.value || !treeviewItem.value['id']) {
            return;
        }

        let treeviewItemElSelector: string;
        treeviewItemElSelector = '[id=\''.concat(treeviewItem.value['id']).concat('\']')
            .concat(AbstractTreeviewComponent.TREEVIEW_ITEM_ROW_ELEMENT_SELECTOR);
        let treeviewItemEl: HTMLElement;
        treeviewItemEl = this.getFirstElementBySelector(treeviewItemElSelector);
        treeviewItemEl = (treeviewItemEl ? treeviewItemEl.closest(
            AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR) as HTMLElement : undefined);
        this.toggleTreeviewItemElement(treeviewItemEl);
    }
}
