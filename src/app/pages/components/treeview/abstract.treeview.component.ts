import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Inject, Input, Output, Renderer2, ViewContainerRef} from '@angular/core';
import {DataSource} from '@app/types/index';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent, IEvent} from '../abstract.component';
import {DropdownTreeviewComponent, TreeItem, TreeviewComponent, TreeviewConfig, TreeviewItem, TreeviewSelection} from 'ngx-treeview';
import HtmlUtils from '../../../utils/common/html.utils';
import KeyboardUtils from '../../../utils/common/keyboard.utils';
import ObjectUtils from '../../../utils/common/object.utils';
import {throwError} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {CONTEXT_MENU_ADD, CONTEXT_MENU_DELETE, CONTEXT_MENU_EDIT} from '../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import ArrayUtils from '../../../utils/common/array.utils';
import FunctionUtils from 'app/utils/common/function.utils';

/**
 * The extended {TreeviewConfig}
 */
export class NgxTreeviewConfig extends TreeviewConfig {

    dropdown?: boolean | false;
    itemBuilder?: (data: any) => TreeviewItem | null;
    treeBuilder?: (data: any[]) => TreeviewItem[] | null;
    buttonClass?: string | null;
    enabledItemCheck?: boolean | false;
    enabledItemImage?: boolean | false;
    appendToBody?: boolean | false;
    itemImageParser: (item?: TreeviewItem) => string[] | string | null;

    static create(fields?: {
        hasAllCheckBox?: boolean | false;
        hasFilter?: boolean | false;
        hasCollapseExpand?: boolean | true;
        decoupleChildFromParent?: boolean | false;
        maxHeight?: number | 500;
        dropdown?: boolean | false;
        itemBuilder?: (data: any) => TreeviewItem | null;
        treeBuilder?: (data: any[]) => TreeviewItem[] | null;
        buttonClass?: string | null;
        enabledItemCheck?: boolean | false;
        enabledItemImage?: boolean | false;
        appendToBody?: boolean | false;
        itemImageParser?: (item?: TreeviewItem) => string[] | string | null;
    }): NgxTreeviewConfig {
        const config: NgxTreeviewConfig = new NgxTreeviewConfig();
        Object.keys(fields || {}).forEach(k => {
            config[k] = fields[k];
        });
        return config;
    }
}

/* default tree-view config */
export const DefaultTreeviewConfig: NgxTreeviewConfig = NgxTreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: true,
    hasFilter: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
});

/**
 * Abstract tree-view component base on {TreeviewComponent} and {DropdownTreeviewComponent}
 */
@Component({})
export abstract class AbstractTreeviewComponent<T extends DataSource> extends AbstractComponent {

    protected static TREEVIEW_ELEMENT_SELECTOR: string = 'ngx-treeview';
    protected static TREEVIEW_ITEM_ELEMENT_SELECTOR: string = 'ngx-treeview-item';
    protected static TREEVIEW_ITEM_ROW_ELEMENT_SELECTOR: string = '.row-item';
    protected static TREEVIEW_SEARCH_ELEMENT_SELECTOR: string = '.row-filter';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    /* tree-view items array */
    private _items: TreeviewItem[];

    @Output() private selectedChange: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);
    @Output() private filterChange: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);
    @Output() private clickItem: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the tree-view items array to show
     * @return the tree-view items array
     */
    @Input('items') get items(): TreeviewItem[] {
        return this._items || [];
    }

    /**
     * Set the tree-view items array to show
     * @param _items to apply
     */
    set items(_items: TreeviewItem[]) {
        this._items = _items;
    }

    /**
     * Get a boolean value indicating this component whether uses checkbox for tree-view item
     * @return true for using checkbox; else false
     */
    public get isEnabledItemCheck(): boolean {
        return this.getConfigValue('enabledItemCheck', false);
    }

    /**
     * Set a boolean value indicating this component whether uses checkbox for tree-view item
     * @param enabledItemCheck true for using checkbox; else false
     */
    public set isEnabledItemCheck(enabledItemCheck: boolean) {
        this.setConfigValue('enabledItemCheck', enabledItemCheck);
    }

    /**
     * Get a boolean value indicating this dropdown tree whether appending to body document
     * @return true for appending to body; else false
     */
    public get isAppendToBody(): boolean {
        return this.getConfigValue('appendToBody', false);
    }

    /**
     * Set a boolean value indicating this dropdown tree whether appending to body document
     * @param appendToBody true for appending to body; else false
     */
    public set isAppendToBody(appendToBody: boolean) {
        this.setConfigValue('appendToBody', appendToBody);
    }

    /**
     * Get a boolean value indicating this component whether uses image for tree-view item
     * @return true for using checkbox; else false
     */
    public get isEnabledItemImage(): boolean {
        return this.getConfigValue('enabledItemImage', false);
    }

    /**
     * Set a boolean value indicating this component whether uses image for tree-view item
     * @param enabledItemImage true for using image; else false
     */
    public set isEnabledItemImage(enabledItemImage: boolean) {
        this.setConfigValue('enabledItemImage', enabledItemImage);
    }

    /**
     * Get the parser delegate to parse item image
     * @return the parser delegate to parse item image
     */
    public get itemImageParser(): (item?: TreeviewItem) => string[] | string | null {
        return this.getConfigValue('itemImageParser') as (item?: TreeviewItem) => string[] | string | null;
    }

    /**
     * Set a boolean value indicating this component whether uses image for tree-view item
     * @param itemImageParser function to get images from {TreeviewItem}
     */
    public set itemImageParser(itemImageParser: (item?: TreeviewItem) => string[] | string) {
        this.setConfigValue('itemImageParser', itemImageParser);
    }

    /**
     * Get the specified {TreeviewItem} image. NULL for not using
     * @param item to parse
     * @return the specified {TreeviewItem} image
     */
    public getItemImages(item?: TreeviewItem): string[] | string | null {
        const imageParser: any = this.itemImageParser;
        return (ObjectUtils.isNou(imageParser) || typeof imageParser !== 'function'
            ? null : imageParser.apply(this, [item]));
    }

    /**
     * Get the item builder factory to build {TreeviewItem} while data source has been refreshed
     * @return the item builder factory to build {TreeviewItem}
     */
    public get itemBuilder(): (data: any) => TreeviewItem | null {
        return this.getConfigValue('itemBuilder') as (data: any) => TreeviewItem | null;
    }

    /**
     * Set the item builder factory to build {TreeviewItem} while data source has been refreshed
     * @param itemBuilder to apply
     */
    public set itemBuilder(itemBuilder: ((data: any) => TreeviewItem) | null) {
        this.setConfigValue('itemBuilder', itemBuilder);
    }

    /**
     * Get the items builder factory to build {TreeviewItem} while data source has been refreshed
     * @return the item builder factory to build {TreeviewItem}
     */
    public get treeBuilder(): (data: any[]) => TreeviewItem[] | null {
        return this.getConfigValue('treeBuilder') as (data: any[]) => TreeviewItem[] | null;
    }

    /**
     * Set the items builder factory to build {TreeviewItem} while data source has been refreshed
     * @param treeBuilder to apply
     */
    public set treeBuilder(treeBuilder: ((data: any[]) => TreeviewItem[]) | null) {
        this.setConfigValue('treeBuilder', treeBuilder);
    }

    /**
     * Get a boolean value indicating this component whether is drop-down tree-view component
     * @return true for drop-down; else false
     */
    public isDropDown(): boolean {
        return this.getConfigValue('dropdown', false);
    }

    /**
     * Set a boolean value indicating this component whether is drop-down tree-view component
     * @param dropdown true for drop-down; else false
     */
    protected setDropDown(dropdown?: boolean | false): void {
        this.setConfigValue('dropdown', dropdown);
    }

    /**
     * Get the drop-down button class in drop-down tree-view mode
     * return the drop-down button class
     */
    public get buttonClass(): string {
        return this.getConfigValue('buttonClass');
    }

    /**
     * Set the drop-down button class in drop-down tree-view mode
     * @param buttonClass to apply
     */
    public set buttonClass(buttonClass: string) {
        this.setConfigValue('buttonClass', buttonClass);
    }

    /**
     * Get the {EventEmitter} instance for listening the selected item changes
     * @return the {EventEmitter} instance or default
     */
    public get selectedChangeEvent(): EventEmitter<IEvent> {
        return this.selectedChange;
    }

    /**
     * Set the {EventEmitter} instance for listening the selected item changes
     * @param selectedChange to apply
     */
    public set selectedChangeEvent(selectedChange: EventEmitter<IEvent> | null) {
        if (selectedChange) {
            this.selectedChange = selectedChange;
        }
    }

    /**
     * Get the {EventEmitter} instance for listening the filter changes
     * @return the {EventEmitter} instance
     */
    public get filterChangeEvent(): EventEmitter<IEvent> | null {
        return this.filterChange;
    }

    /**
     * Set the {EventEmitter} instance for listening the filter changes
     * @param filterChange to apply
     */
    public set filterChangeEvent(filterChange: EventEmitter<IEvent> | null) {
        if (filterChange) {
            this.filterChange = filterChange;
        }
    }

    /**
     * Get the {EventEmitter} instance for listening the clicked item
     * @return the {EventEmitter} instance
     */
    public get clickItemEvent(): EventEmitter<IEvent> | null {
        return this.clickItem;
    }

    /**
     * Set the {EventEmitter} instance for listening the clicked item
     * @param clickItem to apply
     */
    public set clickItemEvent(clickItem: EventEmitter<IEvent> | null) {
        if (clickItem) {
            this.clickItem = clickItem;
        }
    }

    /**
     * Get the {TreeviewComponent} component
     * @return the {TreeviewComponent} component
     */
    protected abstract get treeviewComponent(): TreeviewComponent;

    /**
     * Get the {DropdownTreeviewComponent} component
     * @return the {DropdownTreeviewComponent} component
     */
    protected abstract get dropdownTreeviewComponent(): DropdownTreeviewComponent;

    /**
     * Get the {TreeviewSelection} instance
     * @return {TreeviewSelection}
     */
    public get treeviewSelection(): TreeviewSelection {
        if (this.isDropDown() && this.dropdownTreeviewComponent) {
            return (!this.dropdownTreeviewComponent.treeviewComponent ? null
                : this.dropdownTreeviewComponent.treeviewComponent.selection);
        }
        return (!this.isDropDown() && this.treeviewComponent ?  this.treeviewComponent.selection : null);
    }

    /**
     * Get the checked {TreeviewItem} array
     * @return the checked {TreeviewItem} array
     */
    public get checkedTreeviewItems(): TreeviewItem[] {
        return (!this.treeviewSelection ? [] : this.treeviewSelection.checkedItems);
    }

    /**
     * Get the un-checked {TreeviewItem} array
     * @return the un-checked {TreeviewItem} array
     */
    public get uncheckedTreeviewItems(): TreeviewItem[] {
        return (!this.treeviewSelection ? [] : this.treeviewSelection.uncheckedItems);
    }

    /**
     * Get the selected {TreeviewItem} array
     * @return the selected {TreeviewItem} array
     */
    public get selectedTreeviewItems(): TreeviewItem[] {
        let selectedItems: TreeviewItem[];
        selectedItems = [];
        // search current selected items by `selected` class
        let hoveredItemEls: NodeListOf<HTMLElement>;
        hoveredItemEls = this.getElementsBySelector(
            [AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, '.selected'].join(''));
        hoveredItemEls && hoveredItemEls.length
        && hoveredItemEls.forEach(el => {
            let item: TreeviewItem;
            item = this.getTreeviewItemByElement(el);
            item && selectedItems.push(item);
        });
        return selectedItems;
    }

    /**
     * Set the selected {TreeviewItem} array
     * @param items to select
     * @param reset specify whether reset the current selected items
     */
    public setSelectedTreeviewItems(items?: TreeviewItem[] | [], reset?: boolean | false): void {
        let currentItems: TreeviewItem[];
        currentItems = this.items;
        if (!(currentItems || []).length) {
            return;
        }

        currentItems.forEach(item => {
            let treeviewItemEl: HTMLElement;
            treeviewItemEl = this.getTreeviewElementByItem(item);
            if ((items || []).indexOf(item) < 0 && reset) {
                item.checked = false;
                this.toggleElementClass(treeviewItemEl, 'selected', false);

            } else if ((items || []).indexOf(item) >= 0) {
                item.checked = true;
                this.toggleElementClass(treeviewItemEl, 'selected', true);
            }
        });
    }

    /**
     * Set the selected {TreeviewItem} keys array
     * @param itemKeys to select
     * @param reset specify whether reset the current selected items
     */
    public setSelectedTreeviewItemByKeys(itemKeys?: string[] | [], reset?: boolean | false): void {
        let itemByKeys: TreeviewItem[];
        itemByKeys = [];
        (itemKeys || []).forEach(itemKey => itemByKeys.push(this.findTreeviewItemByKey(itemKey)));
        this.setSelectedTreeviewItems(itemByKeys, reset);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractComponent} class
     * @param dataSource {DataSource}
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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     */
    protected constructor(@Inject(DataSource) dataSource: T,
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
                          @Inject(Lightbox) lightbox?: Lightbox,
                          @Inject(Router) router?: Router,
                          @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
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
        // this.getLogger().debug('onClickItem', event);
        this.clickItemEvent && this.clickItemEvent.emit(event);
    }

    /**
     * Raise when selected items have been changed
     * @param event {IEvent} that contains {$data} as selected values
     */
    onSelectedChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        // this.getLogger().debug('[', this.constructor.name, '] - onSelectedChange', event, this.selectedChangeEvent);
        this.selectedChangeEvent && this.selectedChangeEvent.emit(event);
    }

    /**
     * Raise when tree-view filter has been changed
     * @param event {IEvent} that contains {$data} as filtered values
     */
    onFilterChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        // this.getLogger().debug('onFilterChange', event);
        this.filterChangeEvent && this.filterChangeEvent.emit(event);
    }

    /**
     * Perform action on data-source changed event
     * @param event {IEvent} that contains {$event} as changed values
     */
    onDataSourceChanged(event: IEvent) {
        super.onDataSourceChanged(event);
        const elements: any[] = (event && event.data
            && event.data.hasOwnProperty('elements') && ArrayUtils.isArray(event.data['elements'])
            ? Array.from(event.data['elements']) : [event.data['elements']]);
        const treeBuilder: (data: any[]) => TreeviewItem[] = this.treeBuilder;
        const itemBuilder: (data: any) => TreeviewItem = this.itemBuilder;
        // this.getLogger().debug('treeBuilder', treeBuilder, 'itemBuilder', itemBuilder);
        if (FunctionUtils.isFunction(itemBuilder)) {
            const items: TreeviewItem[] = [];
            (elements || []).forEach(element => {
                const item: TreeviewItem = itemBuilder.apply(this, [element]);
                item && items.push(item);
            });
            this._items = items;

        } else if (FunctionUtils.isFunction(treeBuilder)) {
            this._items = treeBuilder.apply(this, [elements || []]);

        } else {
            this._items = this.mappingDataSourceToTreeviewItems(elements);
        }
        this.getChangeDetectorRef().detectChanges();
    }

    /**
     * Perform navigate keydown action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onNavigateKeyDown(event: IEvent): void {
        super.onNavigateKeyDown(event);

        const kbEvent: KeyboardEvent = event.event as KeyboardEvent;

        // check whether navigating on context menu
        const targetEl: HTMLElement = (event && event.event as Event ? (<Event>event.event).target as HTMLElement : null);
        if (this.hasClosestElement(AbstractTreeviewComponent.TREEVIEW_SEARCH_ELEMENT_SELECTOR, targetEl)) {
            return;
        }

        // detect the latest hovered item element
        const treeviewItemEls: NodeListOf<HTMLElement> = this.getElementsBySelector(
            AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);
        const hoveredItemEls: NodeListOf<HTMLElement> = this.getElementsBySelector(
            [AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, '.selected'].join(''));
        if (!hoveredItemEls || !hoveredItemEls.length) {
            this.toggleTreeviewItemElement(treeviewItemEls.item(0));

        } else {
            const hoveredItemEl: HTMLElement = hoveredItemEls.item(hoveredItemEls.length - 1);
            const nextSibling: Element = HtmlUtils.next(hoveredItemEl,
                AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);
            const prevSibling: Element = HtmlUtils.previous(hoveredItemEl,
                AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);

            // toggle hover class
            if (KeyboardUtils.isHomeKey(kbEvent) || KeyboardUtils.isPageUpKey(kbEvent)
                || (KeyboardUtils.isUpKey(kbEvent) && !prevSibling)) {
                this.toggleTreeviewItemElement(treeviewItemEls.item(0));

            } else if (KeyboardUtils.isEndKey(kbEvent) || KeyboardUtils.isPageDownKey(kbEvent)
                || (KeyboardUtils.isDownKey(kbEvent) && !nextSibling)) {
                this.toggleTreeviewItemElement(treeviewItemEls.item(treeviewItemEls.length - 1));

            } else if (KeyboardUtils.isUpKey(kbEvent)) {
                this.toggleTreeviewItemElement(prevSibling as HTMLElement);

            } else if (KeyboardUtils.isDownKey(kbEvent)) {
                this.toggleTreeviewItemElement(nextSibling as HTMLElement);

            } else if (KeyboardUtils.isRightKey(kbEvent) || KeyboardUtils.isLeftKey(kbEvent)) {
                if (!this.toggleExpandCollapseTreeviewItemElement(hoveredItemEl)) {
                    // toggle selected parent item
                    const parentEl: Element = this.getClosestElementBySelector(
                        AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, hoveredItemEl);
                    (parentEl instanceof HTMLElement)
                    && this.toggleTreeviewItemElement(parentEl as HTMLElement);
                }
            }
        }

        this.preventEvent(event.event);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Get the collection of the checked items
     * @param needToCheckedItems to check
     */
    protected collectSelection(needToCheckedItems?: TreeviewItem[] | null):
        {checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[]} {
        let checkedItems: TreeviewItem[];
        checkedItems = [];
        if ((needToCheckedItems || []).length) {
            needToCheckedItems.forEach(it => this.internalCheck(it, true));
            checkedItems = checkedItems.concat(needToCheckedItems);
        }
        let uncheckedItems: TreeviewItem[];
        uncheckedItems = [];

        let items: TreeviewItem[];
        items = [].concat(this.items);
        items.forEach(item => this.checkSelection(item, checkedItems, uncheckedItems));
        return  {
            checkedItems: [].concat(checkedItems),
            uncheckedItems: [].concat(uncheckedItems),
        };
    }
    private checkSelection(item: TreeviewItem, checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[]): void {
        if (item.checked && checkedItems.indexOf(item) < 0) {
            checkedItems.push(item);
        } else if (!item.checked && uncheckedItems.indexOf(item) < 0) {
            uncheckedItems.push(item);
        }
        if ((item.children || []).length) {
            item.children.forEach(child => this.checkSelection(child, checkedItems, uncheckedItems));
        }
    }

    /**
     * Perform action on menu item
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      menu: menu item
     *      item: menu item data
     * and {$event} as action event
     * @param menuId menu item identity
     * @param data menu data
     */
    protected doMenuAction(event: IEvent, menuId?: string | null, data?: any | null) {
        switch (menuId || '') {
            case CONTEXT_MENU_ADD:
                let newItem: TreeviewItem;
                newItem = this.newItem(event.data['item']);
                this.setSelectedTreeviewItems([newItem], true);
                this.onClickItem({ data: newItem });
                break;
            case CONTEXT_MENU_EDIT:
                this.toggleTreeviewItem(event.data['item']);
                break;
            case CONTEXT_MENU_DELETE:
                this.deleteItem(event.data['item']);
                break;
        }
    }

    /**
     * Create new tree-view item node with the specified node data and the parent node
     * @param parent parent tree-view item {TreeviewItem}
     * @param treeItem new tree-view item data {TreeItem}
     * @return new tree-view item
     */
    protected newItem(parent?: TreeviewItem, treeItem?: TreeItem): TreeviewItem {
        const newItem: TreeviewItem = new TreeviewItem(treeItem || {
            checked: false,
            collapsed: true,
            disabled: false,
            text: '',
            value: undefined,
        });
        if (parent) {
            if (!parent.children || !parent.children.length) {
                parent.children = [newItem];
            } else {
                parent.children.push(newItem);
            }
            // expand parent for new item
            parent.collapsed = false;

        } else {
            this.items.push(newItem);
        }
        return newItem;
    }

    /**
     * Delete the specified {TreeviewItem}
     * @param treeviewItem to delete
     * @return the deleted {TreeviewItem}
     */
    protected deleteItem(treeviewItem: TreeviewItem): TreeviewItem {
        if (!treeviewItem) {
            return undefined;
        }

        const itIdx: number = this.items.indexOf(treeviewItem);
        if (itIdx < 0) {
            const deletedItems: TreeviewItem[] = [];
            for (const it of this.items) {
                if (it.children && this.doDeleteItem(it, treeviewItem, deletedItems)) {
                    return (deletedItems.length ? deletedItems[0] : undefined);
                }
            }

        } else {
            const delItems: TreeviewItem[] = this.items.splice(itIdx, 1);
            return (delItems && delItems.length > 0 ? delItems[0] : undefined);
        }
    }

    /**
     * Delete the specified {TreeviewItem} out of the specified {TreeviewItem} parent if existed
     * @param parent to detect
     * @param delItem to delete
     * @return deleted {TreeviewItem}
     */
    private doDeleteItem(parent: TreeviewItem, delItem: TreeviewItem, deletedItems: TreeviewItem[]): boolean {
        deletedItems = (deletedItems || []);
        if (!parent || !parent.children) {
            return false;
        }

        const itIdx: number = parent.children.indexOf(delItem);
        if (itIdx < 0) {
            for (const it of parent.children) {
                if (it.children && this.doDeleteItem(it, delItem, deletedItems)) {
                    return true;
                }
            }
            return false;
        }

        deletedItems.push(...parent.children.splice(itIdx, 1));
        if (!parent.children.length) {
            this.internalProperty(parent, 'internalChildren', null);
        }
        return true;
    }

    /**
     * Map the specified data from data-source to tree-view items to show
     * @param data to map
     */
    abstract mappingDataSourceToTreeviewItems(data: any): TreeviewItem[];

    /**
     * Generate the specified {TreeviewItem} key to improve the item searching
     * @param item to generate key
     * @return item key
     */
    protected generateTreeviewItemKey(item?: TreeviewItem): string {
        let key: string;
        key = ObjectUtils.ifDefined(
            (item || {})['key'], ((item || {})['value'] || {})['uid'],
            ((item || {})['value'] || {})['id'], (new Date()).getTime().toString());
        key = key.toString();
        if (item) {
            item['key'] = key;
        }
        return key;
    }

    /**
     * Get the {TreeviewItem} key
     * @param item to parse
     * @return the {TreeviewItem} key
     */
    public getTreeviewItemKey(item?: TreeviewItem | null): string {
        return (item ? item['key'] : null);
    }

    /**
     * Toggle expand/collapse the specified tree-view item element
     * @param treeviewItemEl to toggle
     * @return true for toggled; else false
     */
    protected toggleExpandCollapseTreeviewItemElement(treeviewItemEl: HTMLElement): boolean {
        const item: TreeviewItem = (treeviewItemEl ? this.getTreeviewItemByElement(treeviewItemEl) : undefined);
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
        if (!treeviewItemEl) {
            return;
        }

        // remove previous selected elements
        const hoveredItemEls: NodeListOf<HTMLElement> = this.getElementsBySelector(
            [AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, '.selected'].join(''));
        hoveredItemEls && hoveredItemEls.length
        && hoveredItemEls.forEach(el => this.toggleElementClass(el, 'selected', false));

        // toggle selected current element
        this.toggleElementClass(treeviewItemEl, 'selected', true);
        this.onClickItem({data: this.getTreeviewItemByElement(treeviewItemEl)});
    }

    /**
     * Toggle selected the specified tree-view item
     * @param treeviewItem to toggle
     */
    protected toggleTreeviewItem(treeviewItem: TreeviewItem) {
        this.toggleTreeviewItemElement(this.getTreeviewElementByItem(treeviewItem));
    }

    /**
     * Get {TreeviewItem} of the specified tree-view item DOM element
     * @param treeviewItemEl to detect
     * @return {TreeviewItem}
     */
    public getTreeviewItemByElement(treeviewItemEl: HTMLElement): TreeviewItem {
        treeviewItemEl || throwError('Could not get tree-view item of undefined element');

        const itemRowEl: HTMLElement = this.getFirstElementBySelector(
            AbstractTreeviewComponent.TREEVIEW_ITEM_ROW_ELEMENT_SELECTOR, treeviewItemEl);
        if (itemRowEl && (itemRowEl.id || '').length) {
            return this.findTreeviewItemByKey(itemRowEl.id);
        }
        return undefined;
    }

    /**
     * Get {HTMLElement} of the specified tree-view item {TreeviewItem}
     * @param treeviewItem to detect
     * @return {HTMLElement}
     */
    public getTreeviewElementByItem(treeviewItem: TreeviewItem): HTMLElement {
        const itemKey: string = this.generateTreeviewItemKey(treeviewItem);
        if (!treeviewItem || !treeviewItem.value || !(itemKey || '').length) {
            return undefined;
        }

        const treeviewItemElSelector: string = '[id=\''.concat(itemKey).concat('\']')
            .concat(AbstractTreeviewComponent.TREEVIEW_ITEM_ROW_ELEMENT_SELECTOR);
        const treeviewItemEl: HTMLElement = this.getFirstElementBySelector(treeviewItemElSelector);
        return this.getClosestElementBySelector(
            AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR,
            treeviewItemEl) as HTMLElement;
    }

    /**
     * Find the tree-item by data identity
     * @param id to find
     * @param item specify whether filter only in this item. undefined for all items
     * @return {TreeviewItem}
     */
    protected findTreeviewItemByKey(id: string, item?: TreeviewItem): TreeviewItem {
        // if specifying item to filter
        if (item) {
            let itemKey: string;
            itemKey = this.generateTreeviewItemKey(item);
            if (item && item.value && itemKey === id) {
                return item;
            }

            if (item.children && item.children.length) {
                for (const it of item.children) {
                    let found: TreeviewItem;
                    found = this.findTreeviewItemByKey(id, it);
                    if (found) {
                        return found;
                    }
                }
            }

            // search all
        } else {
            for (const it of this.items) {
                let found: TreeviewItem;
                found = this.findTreeviewItemByKey(id, it);
                if (found) {
                    return found;
                }
            }
        }
        return undefined;
    }

    /**
     * Apply internal property value for the specified {TreeviewItem}
     * @param item to apply
     * @param propertyKey the property key
     * @param value to apply
     */
    public internalProperty(item?: TreeviewItem, propertyKey?: string, value?: any) {
        if (!item || !(propertyKey || '').length) return;
        item[propertyKey] = value;
    }

    /**
     * Get internal property value for the specified {TreeviewItem}
     * @param item to apply
     * @param propertyKey the property key
     * @return the property value or default if not found
     */
    public internalPropertyValue(item?: TreeviewItem, propertyKey?: string, defaultValue?: any | null): any {
        if (!item || !(propertyKey || '').length) return defaultValue;
        return item[propertyKey];
    }

    /**
     * Apply internal checked value for the specified {TreeviewItem}
     * @param item to apply
     * @param checked to apply
     */
    protected internalCheck(item?: TreeviewItem, checked?: boolean | false) {
        this.internalProperty(item, 'internalChecked', checked);
    }
    /**
     * Revert internal checked value for the specified {TreeviewItem}
     * @param item to apply
     */
    protected revertCheck(item?: TreeviewItem) {
        this.internalCheck(item,
            (item && (<Object>item).hasOwnProperty('internalChecked')
                ? !item['internalChecked'] : false));
    }

    /**
     * Apply internal disabled value for the specified {TreeviewItem}
     * @param item to apply
     * @param disabled to apply
     */
    protected internalDisabled(item?: TreeviewItem, disabled?: boolean | false) {
        this.internalProperty(item, 'internalDisabled', disabled);
    }
    /**
     * Revert internal disabled value for the specified {TreeviewItem}
     * @param item to apply
     */
    protected revertDisabled(item?: TreeviewItem) {
        this.internalCheck(item,
            (item && (<Object>item).hasOwnProperty('internalDisabled')
                ? !item['internalDisabled'] : false));
    }

    /**
     * Apply internal collapsed value for the specified {TreeviewItem}
     * @param item to apply
     * @param collapsed to apply
     */
    protected internalCollapsed(item?: TreeviewItem, collapsed?: boolean | false) {
        this.internalProperty(item, 'internalCollapsed', collapsed);
    }
    /**
     * Revert internal collapsed value for the specified {TreeviewItem}
     * @param item to apply
     */
    protected revertCollapsed(item?: TreeviewItem) {
        this.internalCheck(item,
            (item && (<Object>item).hasOwnProperty('internalCollapsed')
                ? !item['internalCollapsed'] : false));
    }
}
