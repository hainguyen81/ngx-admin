import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef, EventEmitter, HostListener,
    Inject, Input,
    Output,
    QueryList,
    Renderer2, RendererStyleFlags2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {
    AbstractComponent,
    IEvent,
} from '../abstract.component';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {
    DropdownTreeviewComponent,
    TreeItem,
    TreeviewComponent,
    TreeviewItem,
} from 'ngx-treeview';
import HtmlUtils from '../../../utils/html.utils';
import KeyboardUtils from '../../../utils/keyboard.utils';
import ObjectUtils from '../../../utils/object.utils';
import {throwError} from 'rxjs';
import ComponentUtils from '../../../utils/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {TreeviewSelection} from 'ngx-treeview/src/treeview-item';
import {
    CONTEXT_MENU_ADD,
    CONTEXT_MENU_DELETE,
    CONTEXT_MENU_EDIT,
} from '../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {isArray, isNullOrUndefined} from 'util';

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
export abstract class AbstractTreeviewComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit, AfterContentChecked {

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
    private _items: TreeviewItem[];

    @Output() private selectedChange: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);
    @Output() private filterChange: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);
    @Output() private clickItem: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /** backup pointer to generate selection function of treeview component */
    private __originalGenerateSelection: () => void;
    private __originalDropdownOpen: () => void;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the tree-view items array to show
     * @return the tree-view items array
     */
    @Input('items') get items(): TreeviewItem[] {
        if (isNullOrUndefined(this._items)) {
            this._items = [];
        }
        return this._items;
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
    public isEnabledItemCheck(): boolean {
        return this.getConfigValue('enabledItemCheck', false);
    }

    /**
     * Set a boolean value indicating this component whether uses checkbox for tree-view item
     * @param enabledItemCheck true for using checkbox; else false
     */
    public setEnabledItemCheck(enabledItemCheck?: boolean | false): void {
        this.setConfigValue('enabledItemCheck', enabledItemCheck);
    }

    /**
     * Get a boolean value indicating this dropdown tree whether appending to body document
     * @return true for appending to body; else false
     */
    public isAppendToBody(): boolean {
        return this.getConfigValue('appendToBody', false);
    }

    /**
     * Set a boolean value indicating this dropdown tree whether appending to body document
     * @param appendToBody true for appending to body; else false
     */
    public setAppendToBody(appendToBody?: boolean | false): void {
        this.setConfigValue('appendToBody', appendToBody);
    }

    /**
     * Get a boolean value indicating this component whether uses image for tree-view item
     * @return true for using checkbox; else false
     */
    public isEnabledItemImage(): boolean {
        return this.getConfigValue('enabledItemImage', false);
    }

    /**
     * Set a boolean value indicating this component whether uses image for tree-view item
     * @param enabledItemImage true for using image; else false
     */
    public setEnabledItemImage(enabledItemImage?: boolean | false): void {
        this.setConfigValue('enabledItemImage', enabledItemImage);
    }

    /**
     * Get the parser delegate to parse item image
     * @return the parser delegate to parse item image
     */
    public getItemImageParser(): (item?: TreeviewItem) => string[] | string | null {
        return this.getConfigValue('itemImageParser') as (item?: TreeviewItem) => string[] | string | null;
    }

    /**
     * Set a boolean value indicating this component whether uses image for tree-view item
     * @param itemImageParser function to get images from {TreeviewItem}
     */
    public setItemImageParser(itemImageParser?: (item?: TreeviewItem) => string[] | string | null): void {
        this.setConfigValue('itemImageParser', itemImageParser);
    }

    /**
     * Get the specified {TreeviewItem} image. NULL for not using
     * @param item to parse
     * @return the specified {TreeviewItem} image
     */
    public getItemImages(item?: TreeviewItem): string[] | string | null {
        const imageParser: any = this.getItemImageParser();
        return (isNullOrUndefined(imageParser) || typeof imageParser !== 'function'
            ? null : imageParser.apply(this, [item]));
    }

    /**
     * Get the item builder factory to build {TreeviewItem} while data source has been refreshed
     * @return the item builder factory to build {TreeviewItem}
     */
    public getItemBuilder(): (data: any) => TreeviewItem | null {
        return this.getConfigValue('itemBuilder') as (data: any) => TreeviewItem | null;
    }

    /**
     * Set the item builder factory to build {TreeviewItem} while data source has been refreshed
     * @param itemBuilder to apply
     */
    public setItemBuilder(itemBuilder: (data: any) => TreeviewItem): void {
        this.setConfigValue('itemBuilder', itemBuilder);
    }

    /**
     * Get the items builder factory to build {TreeviewItem} while data source has been refreshed
     * @return the item builder factory to build {TreeviewItem}
     */
    public getTreeBuilder(): (data: any[]) => TreeviewItem[] | null {
        return this.getConfigValue('treeBuilder') as (data: any[]) => TreeviewItem[] | null;
    }

    /**
     * Set the items builder factory to build {TreeviewItem} while data source has been refreshed
     * @param treeBuilder to apply
     */
    public setTreeBuilder(treeBuilder: (data: any[]) => TreeviewItem[] | null): void {
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
    protected setDropDown(dropdown?: boolean | false) {
        this.setConfigValue('dropdown', dropdown);
    }

    /**
     * Get the drop-down button class in drop-down tree-view mode
     * return the drop-down button class
     */
    public getButtonClass(): string {
        return this.getConfigValue('buttonClass');
    }

    /**
     * Set the drop-down button class in drop-down tree-view mode
     * @param buttonClass to apply
     */
    public setButtonClass(buttonClass?: string) {
        this.setConfigValue('buttonClass', buttonClass);
    }

    /**
     * Get the {EventEmitter} instance for listening the selected item changes
     * @return the {EventEmitter} instance or default
     */
    public getSelectedChangeEvent(): EventEmitter<IEvent> {
        return this.selectedChange;
    }

    /**
     * Set the {EventEmitter} instance for listening the selected item changes
     * @param selectedChange to apply
     */
    public setSelectedChangeEvent(selectedChange?: EventEmitter<IEvent> | null) {
        if (selectedChange) {
            this.selectedChange = selectedChange;
        }
    }

    /**
     * Get the {EventEmitter} instance for listening the filter changes
     * @return the {EventEmitter} instance
     */
    public getFilterChangeEvent(): EventEmitter<IEvent> {
        return this.filterChange;
    }

    /**
     * Set the {EventEmitter} instance for listening the filter changes
     * @param filterChange to apply
     */
    public setFilterChangeEvent(filterChange?: EventEmitter<IEvent> | null) {
        if (filterChange) {
            this.filterChange = filterChange;
        }
    }

    /**
     * Get the {EventEmitter} instance for listening the clicked item
     * @return the {EventEmitter} instance
     */
    public getClickItemEvent(): EventEmitter<IEvent> {
        return this.clickItem;
    }

    /**
     * Set the {EventEmitter} instance for listening the clicked item
     * @param clickItem to apply
     */
    public setClickItemEvent(clickItem?: EventEmitter<IEvent> | null) {
        if (clickItem) {
            this.clickItem = clickItem;
        }
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
     * Get the {TreeviewSelection} instance
     * @return {TreeviewSelection}
     */
    public getTreeviewSelection(): TreeviewSelection {
        if (this.isDropDown() && this.getDropdownTreeviewComponent()) {
            return (!this.getDropdownTreeviewComponent().treeviewComponent ? null
                : this.getDropdownTreeviewComponent().treeviewComponent.selection);
        }
        return (this.isDropDown() || !this.getTreeviewComponent() ? null
            : this.getTreeviewComponent().selection);
    }

    /**
     * Get the checked {TreeviewItem} array
     * @return the checked {TreeviewItem} array
     */
    public getCheckedTreeviewItems(): TreeviewItem[] {
        return (!this.getTreeviewSelection() ? [] : this.getTreeviewSelection().checkedItems);
    }

    /**
     * Get the un-checked {TreeviewItem} array
     * @return the un-checked {TreeviewItem} array
     */
    public getUncheckedTreeviewItems(): TreeviewItem[] {
        return (!this.getTreeviewSelection() ? [] : this.getTreeviewSelection().uncheckedItems);
    }

    /**
     * Get the selected {TreeviewItem} array
     * @return the selected {TreeviewItem} array
     */
    public getSelectedTreeviewItems(): TreeviewItem[] {
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

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        const _this: AbstractTreeviewComponent<T> = this;

        if (!this.treeviewComponent) {
            this.treeviewComponent = ComponentUtils.queryComponent(
                this.queryTreeviewComponent, (component) => {
                    if (component) {
                        // unique hack (cheat) for single item selection
                        _this.__originalGenerateSelection = component['generateSelection'];
                        component['generateSelection'] = () => _this.generateSelection();
                        component.selectedChange.subscribe(
                            value => this.onSelectedChange({data: value}));
                        component.filterChange.subscribe(
                            value => this.onFilterChange({data: value}));
                    }
                });
        }

        if (!this.dropdownTreeviewComponent) {
            this.dropdownTreeviewComponent = ComponentUtils.queryComponent(
                this.queryDropdownTreeviewComponent, (component) => {
                    if (component) {
                        // unique hack (cheat) for appending to body
                        _this.__originalDropdownOpen = component.dropdownDirective.open;
                        component.dropdownDirective.open = () => _this.detectDropdownForAppendToBody(component);
                        // unique hack (cheat) for single item selection
                        _this.__originalGenerateSelection = component.treeviewComponent['generateSelection'];
                        component.treeviewComponent['generateSelection'] = () => _this.generateSelection();
                        component.selectedChange.subscribe(
                            value => this.onSelectedChange({data: value}));
                        component.filterChange.subscribe(
                            value => this.onFilterChange({data: value}));
                    }
                });
        }
    }

    ngAfterContentChecked() {
        super.ngAfterContentChecked();

        // re-calculate dropdown position
        if (this.isDropDown() && this.getDropdownTreeviewComponent()) {
            this.calculateDropdownPosition(this.getDropdownTreeviewComponent());
        }
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
        this.getClickItemEvent().emit(event);
    }

    /**
     * Raise when selected items have been changed
     * @param event {IEvent} that contains {$data} as selected values
     */
    onSelectedChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSelectedChange', event);
        this.getSelectedChangeEvent().emit(event);
    }

    /**
     * Raise when tree-view filter has been changed
     * @param event {IEvent} that contains {$data} as filtered values
     */
    onFilterChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onFilterChange', event);
        this.getFilterChangeEvent().emit(event);
    }

    /**
     * Perform action on data-source changed event
     * @param event {IEvent} that contains {$event} as changed values
     */
    onDataSourceChanged(event: IEvent) {
        this.getLogger().debug('DataSource has been changed', event);
        const elements: any[] = (event && event.data
            && event.data.hasOwnProperty('elements') && isArray(event.data['elements'])
            ? Array.from(event.data['elements']) : [event.data['elements']]);
        const treeBuilder: (data: any[]) => TreeviewItem[] = this.getTreeBuilder();
        const itemBuilder: (data: any) => TreeviewItem = this.getItemBuilder();
        if (!isNullOrUndefined(itemBuilder) && typeof itemBuilder === 'function') {
            const items: TreeviewItem[] = [];
            (elements || []).forEach(element => {
                const item: TreeviewItem = itemBuilder.apply(this, [element]);
                item && items.push(item);
            });
            this._items = items;

        } else if (!isNullOrUndefined(treeBuilder) && typeof treeBuilder === 'function') {
            this._items = treeBuilder.apply(this, [elements || []]);

        } else {
            this._items = this.mappingDataSourceToTreeviewItems(elements);
        }
    }

    /**
     * Perform navigate keydown action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onNavigateKeyDown(event: IEvent): void {
        super.onNavigateKeyDown(event);

        let kbEvent: KeyboardEvent;
        kbEvent = event.event as KeyboardEvent;

        // check whether navigating on context menu
        let targetEl: HTMLElement;
        targetEl = (event && event.event as Event ? (<Event>event.event).target as HTMLElement : null);
        if (this.hasClosestElement(AbstractTreeviewComponent.TREEVIEW_SEARCH_ELEMENT_SELECTOR, targetEl)) {
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
     * Detect and ensure dropdown tree while using {appendToBody} configuration
     * @param dropdownTreeviewComponent {DropdownTreeviewComponent}
     */
    private detectDropdownForAppendToBody(dropdownTreeviewComponent: DropdownTreeviewComponent): void {
        if (!this.isDropDown() || isNullOrUndefined(dropdownTreeviewComponent)
            || isNullOrUndefined(dropdownTreeviewComponent.dropdownDirective)
            || isNullOrUndefined(dropdownTreeviewComponent.dropdownDirective.toggleElement)
            || !this.isAppendToBody()) {
            dropdownTreeviewComponent && dropdownTreeviewComponent.dropdownDirective
            && this.__originalDropdownOpen.apply(dropdownTreeviewComponent.dropdownDirective);
            return;
        }

        const dropdownMenuEl: Element = (dropdownTreeviewComponent.dropdownDirective['dropdownMenu'] instanceof Element
            ? dropdownTreeviewComponent.dropdownDirective['dropdownMenu'] as Element
                : HtmlUtils.nextSibling(dropdownTreeviewComponent.dropdownDirective.toggleElement, '[ngxDropdownMenu].dropdown-menu'));
        if (!isNullOrUndefined(dropdownMenuEl)) {
            dropdownTreeviewComponent.dropdownDirective['dropdownMenu'] = dropdownMenuEl;
            this.getRenderer().removeClass(dropdownMenuEl, 'ngx-treeview');
            this.getRenderer().addClass(dropdownMenuEl, 'ngx-treeview');
            this.getRenderer().appendChild(document.body, dropdownMenuEl);
            this.calculateDropdownPosition(dropdownTreeviewComponent, dropdownMenuEl);
        }

        this.__originalDropdownOpen.apply(dropdownTreeviewComponent.dropdownDirective);
    }

    /**
     * Calculate the offset position of the dropdown tree
     * @param dropdownTreeviewComponent {DropdownTreeviewComponent}
     * @param dropdownMenuEl dropdown menu element
     */
    private calculateDropdownPosition(
        dropdownTreeviewComponent: DropdownTreeviewComponent, dropdownMenuEl?: Element | null) {
        const menuEl: Element = (!isNullOrUndefined(dropdownMenuEl) ? dropdownMenuEl
            : dropdownTreeviewComponent.dropdownDirective['dropdownMenu'] instanceof Element
                ? dropdownTreeviewComponent.dropdownDirective['dropdownMenu'] as Element
                : HtmlUtils.nextSibling(dropdownTreeviewComponent.dropdownDirective.toggleElement, '[ngxDropdownMenu].dropdown-menu'));
        if (!isNullOrUndefined(menuEl) && this.isAppendToBody()) {
            const offset: { top: number, left: number, width: number, height: number } =
                super.offset(dropdownTreeviewComponent.dropdownDirective.toggleElement);
            this.getRenderer().setStyle(
                menuEl,
                'top', (offset.top + offset.height + 5) + 'px',
                RendererStyleFlags2.Important);
            this.getRenderer().setStyle(
                menuEl,
                'left', offset.left + 'px',
                RendererStyleFlags2.Important);
            this.getRenderer().setStyle(
                menuEl,
                'width', offset.width + 'px',
                RendererStyleFlags2.Important);
        }
    }

    /**
     * Override this method of {TreeviewComponent}
     */
    private generateSelection() {
        if (this.isEnabledItemCheck() && typeof this.__originalGenerateSelection === 'function') {
            if (this.getTreeviewComponent()) {
                this.__originalGenerateSelection.apply(this.getTreeviewComponent());
            }
            if (this.getDropdownTreeviewComponent() && this.getDropdownTreeviewComponent().treeviewComponent) {
                this.__originalGenerateSelection.apply(this.getDropdownTreeviewComponent().treeviewComponent);
            }

        } else {
            if (this.isDropDown() && this.getDropdownTreeviewComponent()
                && this.getDropdownTreeviewComponent().treeviewComponent) {
                this.getDropdownTreeviewComponent().treeviewComponent.selection = this.collectSelection();
            } else if (!this.isDropDown() && this.getTreeviewComponent()) {
                this.getTreeviewComponent().selection = this.collectSelection();
            } else {
                throwError('Could not initialize tree-view selection while component has not been initialized yet!');
            }
        }
    }
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
                // wait for rendering new item
                let timer: number;
                timer = window.setTimeout(() => {
                    this.toggleTreeviewItem(newItem);
                    clearTimeout(timer);
                }, 300);
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
        let newItem: TreeviewItem;
        newItem = new TreeviewItem(treeItem || {
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

        let itIdx: number;
        itIdx = this.items.indexOf(treeviewItem);
        if (itIdx < 0) {
            const deletedItems: TreeviewItem[] = [];
            for (const it of this.items) {
                if (it.children && this.doDeleteItem(it, treeviewItem, deletedItems)) {
                    return (deletedItems.length ? deletedItems[0] : undefined);
                }
            }

        } else {
            let delItems: TreeviewItem[];
            delItems = this.items.splice(itIdx, 1);
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

        let itIdx: number;
        itIdx = parent.children.indexOf(delItem);
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
        if (!treeviewItemEl) {
            return;
        }

        // remove previous selected elements
        let hoveredItemEls: NodeListOf<HTMLElement>;
        hoveredItemEls = this.getElementsBySelector(
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

        let itemRowEl: HTMLElement;
        itemRowEl = this.getFirstElementBySelector(
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
        let itemKey: string;
        itemKey = this.generateTreeviewItemKey(treeviewItem);
        if (!treeviewItem || !treeviewItem.value || !(itemKey || '').length) {
            return undefined;
        }

        let treeviewItemElSelector: string;
        treeviewItemElSelector = '[id=\''.concat(itemKey).concat('\']')
            .concat(AbstractTreeviewComponent.TREEVIEW_ITEM_ROW_ELEMENT_SELECTOR);
        let treeviewItemEl: HTMLElement;
        treeviewItemEl = this.getFirstElementBySelector(treeviewItemElSelector);
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
