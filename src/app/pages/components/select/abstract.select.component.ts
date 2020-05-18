import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    Output,
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
    AbstractComponent, IEvent,
} from '../abstract.component';
import ComponentUtils from '../../../utils/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {DropdownPosition, NgOption, NgSelectComponent} from '@ng-select/ng-select';
import {IToolbarActionsConfig} from '../../../config/toolbar.actions.conf';
import {isArray, isNullOrUndefined, isObject} from 'util';

/**
 * The extension of {NgSelectConfig}
 */
export interface INgxSelectOptions {
    /**
     * Allows to create custom options.
     * Default is false
     */
    addTag?: ((term: string) => (any | Promise<any>)) | boolean | false;
    /**
     * Set custom text when using tagging.
     * Default is `Add item`
     */
    addTagText?: string | 'Add item' | null;
    /**
     * Allows to select dropdown appearance.
     * Set to outline to add border instead of underline (applies only to Material theme)
     * Default is undefined
     */
    appearance?: string | null;
    /**
     * Append dropdown to body or any other element using css selector.
     * For correct positioning body should have position:relative
     * Default is null
     */
    appendTo?: string | null;
    /**
     * Object property to use for selected model.
     * By default binds to whole object.
     */
    bindValue?: string | null;
    /**
     * Object property to use for label.
     * Default `label`
     */
    bindLabel?: string | 'label' | null;
    /**
     * Specify whether using image for option
     * {boolean}
     */
    enableImage?: boolean | false;
    /**
     * Object property to use for image.
     * Default `image`
     */
    bindImage?: (item: any) => (string | string[] | null) | string[] | string | 'image' | null;
    /**
     * Whether to close the menu when a value is selected.
     * Default is true
     */
    closeOnSelect?: boolean | true;
    /**
     * Set custom text for clear all icon title.
     * Default is `Clear all`
     */
    clearAllText?: string | 'Clear all' | null;
    /**
     * Allow to clear selected value.
     * Default true
     */
    clearable?: boolean | true;
    /**
     * Clear selected values one by one when clicking backspace.
     * Default true
     */
    clearOnBackspace?: boolean | true;
    /**
     * A function to compare the option values with the selected values.
     * The first argument is a value from an option.
     * The second is a value from the selection(model).
     * A boolean should be returned.
     * Default is `(a, b) => a === b`
     * @param a
     * @param b
     */
    compareWith?: (a: any, b: any) => boolean | null;
    /**
     * Set the dropdown position on open.
     * Default is `auto`
     */
    dropdownPosition?: 'bottom' | 'top' | 'auto';
    /**
     * Allow to group items by key or function expression.
     * Default is null
     */
    groupBy?: string | Function | null;
    /**
     * Function expression to provide group value.
     * Default is null
     * @param groupKey
     * @param children
     */
    groupValue?: (groupKey: string, children: any[]) => Object | null;
    /**
     * Allow to select group when groupBy is used.
     * Default is false
     */
    selectableGroup?: boolean | false;
    /**
     * Indicates whether to select all children or group itself.
     * Default is true
     */
    selectableGroupAsModel?: boolean | true;
    /**
     * You can set the loading state from the outside (e.g. async items loading)
     * Default is false
     */
    loading?: boolean | false;
    /**
     * Set custom text when for loading items.
     * Default is `Loading...`
     */
    loadingText?: string | 'Loading...' | null;
    /**
     * Id to associate control with label.
     * Default is null
     */
    labelForId?: string | null;
    /**
     * Marks first item as focused when opening/filtering.
     * Default is true
     */
    markFirst?: boolean | true;
    /**
     * Allows manual control of dropdown opening and closing. True - won't close. False - won't open.
     * Default is null
     */
    isOpen?: boolean | null;
    /**
     * When multiple = true, allows to set a limit number of selection.
     */
    maxSelectedItems?: number | null;
    /**
     * Allows to hide selected items.
     * Default is false
     */
    hideSelected?: boolean | false;
    /**
     * Allows to select multiple items.
     * Default is false
     */
    multiple?: boolean | false;
    /**
     * Set custom text when filter returns empty result
     * Default is `No items found`
     */
    notFoundText?: string | 'No items found' | null;
    /**
     * Placeholder text.
     * Default is null
     */
    placeholder?: string | null;
    /**
     * Allow to search for value.
     * Default true
     */
    searchable?: boolean | true;
    /**
     * Set ng-select as readonly.
     * Mostly used with reactive forms.
     * Default is false
     */
    readonly?: boolean | false;
    /**
     * Allow to filter by custom search function.
     * Default is null
     * @param term
     * @param item
     */
    searchFn?: (term: string, item: any) => boolean | null;
    /**
     * Whether items should be filtered while composition started.
     * Default is true
     */
    searchWhileComposing?: boolean | true;
    /**
     * Provide custom trackBy function.
     * Default is null
     * @param item
     */
    trackByFn?: (item: any) => any | null;
    /**
     * Clears search input when item is selected.
     * Default true.
     * Default false when closeOnSelect is false
     */
    clearSearchOnAdd?: boolean | true;
    /**
     * Allow to edit search query if option selected.
     * Default false.
     * Works only if multiple is false.
     */
    editableSearchTerm?: boolean | false;
    /**
     * Select marked dropdown item using tab.
     * Default false
     */
    selectOnTab?: boolean | false;
    /**
     * Open dropdown using enter.
     * Default true
     */
    openOnEnter?: boolean | true;
    /**
     * Custom autocomplete or advanced filter.
     * Default is null
     */
    typeahead?: Subject<any> | null;
    /**
     * Minimum term length to start a search.
     * Should be used with typeahead
     */
    minTermLength?: number | 0;
    /**
     * Set custom text when using Typeahead.
     * Default is `Type to search`
     */
    typeToSearchText?: string | 'Type to search' | null;
    /**
     * Enable virtual scroll for better performance when rendering a lot of data.
     * Default is false
     */
    virtualScroll?: boolean | false;
    /**
     * Pass custom attributes to underlying input element
     */
    inputAttrs?: { [key: string]: string } | null;
    /**
     * Set tabindex on ng-select
     */
    tabIndex?: number | null;
    /**
     * Provide custom keyDown function.
     * Executed before default handler.
     * Return false to suppress execution of default key down handlers
     * Default is false
     * @param $event {KeyboardEvent}
     */
    keyDownFn?: (($event: KeyboardEvent) => boolean) | boolean | false;
    /**
     * Shows the 'Add new option' action in case of out of items at all
     * {boolean}
     */
    addNewOption?: boolean | false;
    /**
     * The configuration of 'Add new option' action
     * {IToolbarActionsConfig}
     */
    addNewOptionConfig?: IToolbarActionsConfig | null;
}

/**
 * Default select configuration
 */
export const DefaultNgxSelectOptions: INgxSelectOptions = {
    /**
     * Allows to create custom options.
     * Default is false
     */
    // @ts-ignore
    addTag: false,
    /**
     * Set custom text when using tagging.
     * Default is `Add item`
     */
    addTagText: 'Add item',
    /**
     * Allows to select dropdown appearance.
     * Set to outline to add border instead of underline (applies only to Material theme)
     * Default is undefined
     */
    appearance: null,
    /**
     * Append dropdown to body or any other element using css selector.
     * For correct positioning body should have position:relative
     * Default is null
     */
    appendTo: 'body',
    /**
     * Object property to use for selected model.
     * By default binds to whole object.
     */
    bindValue: null,
    /**
     * Object property to use for label.
     * Default `label`
     */
    bindLabel: 'label',
    /**
     * Whether to close the menu when a value is selected.
     * Default is true
     */
    closeOnSelect: true,
    /**
     * Set custom text for clear all icon title.
     * Default is `Clear all`
     */
    clearAllText: 'Clear all',
    /**
     * Allow to clear selected value.
     * Default true
     */
    clearable: true,
    /**
     * Clear selected values one by one when clicking backspace.
     * Default true
     */
    clearOnBackspace: true,
    /**
     * A function to compare the option values with the selected values.
     * The first argument is a value from an option.
     * The second is a value from the selection(model).
     * A boolean should be returned.
     * Default is `(a, b) => a === b`
     * @param a
     * @param b
     */
    compareWith: null,
    /**
     * Set the dropdown position on open.
     * Default is `auto`
     */
    dropdownPosition: 'auto',
    /**
     * Allow to group items by key or function expression.
     * Default is null
     */
    groupBy: null,
    /**
     * Function expression to provide group value.
     * Default is null
     * @param groupKey
     * @param children
     */
    groupValue: null,
    /**
     * Allow to select group when groupBy is used.
     * Default is false
     */
    selectableGroup: false,
    /**
     * Indicates whether to select all children or group itself.
     * Default is true
     */
    selectableGroupAsModel: true,
    /**
     * You can set the loading state from the outside (e.g. async items loading)
     * Default is false
     */
    loading: false,
    /**
     * Set custom text when for loading items.
     * Default is `Loading...`
     */
    loadingText: 'Loading...',
    /**
     * Id to associate control with label.
     * Default is null
     */
    labelForId: null,
    /**
     * Marks first item as focused when opening/filtering.
     * Default is true
     */
    markFirst: true,
    /**
     * Allows manual control of dropdown opening and closing. True - won't close. False - won't open.
     * Default is null
     */
    isOpen: null,
    /**
     * When multiple = true, allows to set a limit number of selection.
     */
    maxSelectedItems: null,
    /**
     * Allows to hide selected items.
     * Default is false
     */
    hideSelected: false,
    /**
     * Allows to select multiple items.
     * Default is false
     */
    multiple: false,
    /**
     * Set custom text when filter returns empty result
     * Default is `No items found`
     */
    notFoundText: 'No items found',
    /**
     * Placeholder text.
     * Default is null
     */
    placeholder: null,
    /**
     * Allow to search for value.
     * Default true
     */
    searchable: true,
    /**
     * Set ng-select as readonly.
     * Mostly used with reactive forms.
     * Default is false
     */
    readonly: false,
    /**
     * Allow to filter by custom search function.
     * Default is null
     * @param term
     * @param item
     */
    searchFn: null,
    /**
     * Whether items should be filtered while composition started.
     * Default is true
     */
    searchWhileComposing: true,
    /**
     * Provide custom trackBy function.
     * Default is null
     * @param item
     */
    trackByFn: null,
    /**
     * Clears search input when item is selected.
     * Default true.
     * Default false when closeOnSelect is false
     */
    clearSearchOnAdd: true,
    /**
     * Allow to edit search query if option selected.
     * Default false.
     * Works only if multiple is false.
     */
    editableSearchTerm: false,
    /**
     * Select marked dropdown item using tab.
     * Default false
     */
    selectOnTab: false,
    /**
     * Open dropdown using enter.
     * Default true
     */
    openOnEnter: true,
    /**
     * Custom autocomplete or advanced filter.
     * Default is null
     */
    typeahead: null,
    /**
     * Minimum term length to start a search.
     * Should be used with typeahead
     */
    minTermLength: 0,
    /**
     * Set custom text when using Typeahead.
     * Default is `Type to search`
     */
    typeToSearchText: 'Type to search',
    /**
     * Enable virtual scroll for better performance when rendering a lot of data.
     * Default is false
     */
    virtualScroll: false,
    /**
     * Pass custom attributes to underlying input element
     */
    inputAttrs: null,
    /**
     * Set tabindex on ng-select
     */
    tabIndex: null,
    /**
     * Provide custom keyDown function.
     * Executed before default handler.
     * Return false to suppress execution of default key down handlers
     * Default is false
     * @param $event {KeyboardEvent}
     */
    keyDownFn: false,
    /**
     * Specify whether using image for option
     * {boolean}
     */
    enableImage: false,
    /**
     * Shows the 'Add new option' action in case of out of items at all
     * {boolean}
     */
    addNewOption: false,
    /**
     * The configuration of 'Add new option' action
     * {IToolbarActionsConfig}
     */
    addNewOptionConfig: null,
};

/**
 * Abstract select component base on {NgSelectComponent}
 */
export abstract class AbstractSelectComponent<T extends DataSource>
    extends AbstractComponent implements AfterContentChecked, AfterViewInit {

    protected static NG_SELECT_PARENT_COMPONENT_REF_PROPERTY = '__parentComponentRef';
    protected static NG_SELECT_CONTAINER_SELECTOR = '.ng-select-container';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NgSelectComponent)
    private readonly queryNgSelectComponent: QueryList<NgSelectComponent>;
    private ngSelectComponent: NgSelectComponent;

    /**
     * Fired when item is added while [multiple]='true'. Outputs added item.
     * $event {IEvent} with data is an added item
     */
    @Output() readonly load: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /**
     * Fired when item is added while [multiple]='true'. Outputs added item.
     * $event {IEvent} with data is an added item
     */
    @Output() readonly add: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /**
     * Fired on model change. Outputs whole model
     * @param $event {IEvent} with data is model
     */
    @Output() readonly change: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /**
     * Fired on select dropdown close
     * @param $event {IEvent} no data
     */
    @Output() readonly close: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /**
     * Fired on clear icon click
     * @param $event {IEvent} no data
     */
    @Output() readonly clear: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /**
     * Fired while typing search term. Outputs search term with filtered items
     * @param $event {IEvent} with data is { term, items: this.itemsList.filteredItems.map(x => x.value) }
     */
    @Output() readonly search: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /**
     * Fired on select dropdown open
     * @param $event {IEvent} no data
     */
    @Output() readonly open: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /**
     * Fired when item is removed while [multiple]='true'
     * @param $event {IEvent} with data is a removed item
     */
    @Output() readonly remove: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /**
     * Fired when scrolled.
     * Provides the start and end index of the currently available items.
     * Can be used for loading more items in chunks before the user has scrolled all the way to the bottom of the list.
     * @param $event {IEvent} with data is { start: number; end: number }
     */
    @Output() readonly scroll: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /**
     * Fired when scrolled to the end of items.
     * Can be used for loading more items in chunks.
     * @param $event {IEvent} no data
     */
    @Output() readonly scrollToEnd: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /**
     * Raise by clicking on 'Add new option' action.
     * @param $event {IEvent} as {IEvent#$event} is event data
     */
    @Output() readonly addNewOption: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    /**
     * Items array.
     * Should be an array of objects with id and text properties.
     * As convenience, you may also pass an array of strings,
     * in which case the same string is used for both the ID and the text.
     * Items may be nested by adding a options property to any item,
     * whose value should be another array of items.
     * Items that have children may omit to have an ID.
     */
    private _items: any[];

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NgSelectComponent} component
     * @return the {NgSelectComponent} component
     */
    protected get selectComponent(): NgSelectComponent {
        return this.ngSelectComponent;
    }

    /**
     * Get the option items array to show
     * @return the option items array
     */
    get items(): any[] {
        return this._items || [];
    }

    /**
     * Set the option items array to show
     * @param _items to apply
     */
    @Input('items')
    set items(_items: any[]) {
        this._items = (_items || []);
        this.load.emit();
    }

    /**
     * Get the selected options
     * @return the selected options
     */
    get selectedItems(): NgOption[] {
        return (this.selectComponent ? this.selectComponent.selectedItems : []);
    }

    /**
     * Get the selected options
     * @return the selected options
     */
    set selectedItems(items: NgOption[]) {
        if (!isNullOrUndefined(this.selectComponent)) {
            const control: NgSelectComponent = this.selectComponent;
            const multiple: boolean = this.getConfigValue('multiple', false);
            if (items.length) {
                for (const item of items) {
                    if (!isNullOrUndefined(item) && !item.selected) {
                        this.selectComponent.select(item);
                        if (!multiple) break;
                    }
                }

            } else {
                items = [].concat(this.selectedItems);
                items.forEach(item => control.unselect(item));
            }
        }
    }

    /**
     * Get the selected values
     * @return the selected values
     */
    get selectedValues(): any[] {
        return (this.selectComponent ? this.selectComponent.selectedValues : []);
    }

    /**
     * Set the selected values
     * @param values value from `bindValue` to select
     */
    set selectedValues(values: any[]) {
        if (!isNullOrUndefined(this.selectComponent)) {
            this.selectedItems = this.findItems(values);
        }
    }

    /**
     * Get a boolean value indicating the select component whether has value
     * @return true for having value; else false
     */
    get hasValue() {
        return (this.selectComponent ? this.selectComponent.hasValue : false);
    }

    /**
     * Get the current position of dropdown panel
     * @return the current position of dropdown panel
     */
    get currentPanelPosition(): DropdownPosition {
        return (this.selectComponent ? this.selectComponent.currentPanelPosition : null);
    }

    /**
     * Get the {IToolbarActionsConfig} instance of the `add new option` action
     * @return the {IToolbarActionsConfig} instance
     */
    get addNewOptionConfig(): IToolbarActionsConfig {
        return this.getConfigValue('addNewOptionConfig') as IToolbarActionsConfig;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractSelectComponent} class
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
     * @param config {INgxSelectOptions}
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
                          @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                          config?: INgxSelectOptions | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        this.config = config || DefaultNgxSelectOptions;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.ngSelectComponent) {
            const _this: AbstractSelectComponent<T> = this;
            this.ngSelectComponent = ComponentUtils.queryComponent(
                this.queryNgSelectComponent, component => {
                    if (!isNullOrUndefined(component)) {
                        component[AbstractSelectComponent.NG_SELECT_PARENT_COMPONENT_REF_PROPERTY] = _this;
                        component.addEvent.subscribe(addedItem => {
                            this.onAdd({ data: addedItem });
                        });
                        component.blurEvent.subscribe($event => {
                            this.onBlur({ event: $event });
                        });
                        component.changeEvent.subscribe(model => {
                            this.onChange({ data: model });
                        });
                        component.closeEvent.subscribe($event => {
                            this.onClose({ event: $event });
                        });
                        component.clearEvent.subscribe($event => {
                            this.onClear({ event: $event });
                        });
                        component.focusEvent.subscribe($event => {
                            this.onFocus({ event: $event });
                        });
                        component.searchEvent.subscribe(data => {
                            this.onSearch({ data: data });
                        });
                        component.searchEvent.subscribe(data => {
                            this.onSearch({ data: data });
                        });
                        component.openEvent.subscribe($event => {
                            this.onOpen({ event: $event });
                        });
                        component.removeEvent.subscribe(removedItem => {
                            this.onRemove({ data: removedItem });
                        });
                        component.scroll.subscribe(data => {
                            this.onScroll({ data: data });
                        });
                        component.scrollToEnd.subscribe($event => {
                            this.onScrollToEnd({ event: $event });
                        });
                    }
                });
        }
    }

    ngAfterContentChecked(): void {
        super.ngAfterContentChecked();

        // check for reposition dropdown panel
        this.__checkForDropdownPanelPosition();
    }

    onMouseWheel(event: IEvent): void {
        super.onMouseWheel(event);

        // check for reposition dropdown panel
        this.__checkForDropdownPanelPosition();
    }

    /**
     * Adjust dropdown-panel position
     * @private
     */
    private __checkForDropdownPanelPosition(): void {
        // check for reposition dropdown panel
        const selectComponent: NgSelectComponent = this.selectComponent;
        if (!isNullOrUndefined(selectComponent) && selectComponent.isOpen
            && !isNullOrUndefined(selectComponent.dropdownPanel)) {
            selectComponent.dropdownPanel.adjustPosition();
        }
    }

    /**
     * Fired when item is added while [multiple]='true'. Outputs added item.
     * $event {IEvent} with data is an added item
     */
    protected onAdd($event: IEvent): void {
        this.getLogger().debug('onAdd', $event);
        this.add.emit($event);
    }

    /**
     * Fired on model change. Outputs whole model
     * @param $event {IEvent} with data is model
     */
    protected onChange($event: IEvent): void {
        this.getLogger().debug('onChange', $event);
        this.change.emit($event);
    }

    /**
     * Fired on select dropdown close
     * @param $event {IEvent} no data
     */
    protected onClose($event: IEvent): void {
        this.getLogger().debug('onClose', $event);
        this.close.emit($event);
    }

    /**
     * Fired on clear icon click
     * @param $event {IEvent} no data
     */
    protected onClear($event: IEvent): void {
        this.getLogger().debug('onClear', $event);
        this.clear.emit($event);
    }

    /**
     * Fired while typing search term. Outputs search term with filtered items
     * @param $event {IEvent} with data is { term, items: this.itemsList.filteredItems.map(x => x.value) }
     */
    protected onSearch($event: IEvent): void {
        this.getLogger().debug('onSearch', $event);
        this.search.emit($event);
    }

    /**
     * Fired on select dropdown open
     * @param $event {IEvent} no data
     */
    protected onOpen($event: IEvent): void {
        this.getLogger().debug('onOpen', $event);
        this.open.emit($event);
    }

    /**
     * Fired when item is removed while [multiple]='true'
     * @param $event {IEvent} with data is a removed item
     */
    protected onRemove($event: IEvent): void {
        this.getLogger().debug('onRemove', $event);
        this.remove.emit($event);
    }

    /**
     * Fired when scrolled.
     * Provides the start and end index of the currently available items.
     * Can be used for loading more items in chunks before the user has scrolled all the way to the bottom of the list.
     * @param $event {IEvent} with data is { start: number; end: number }
     */
    protected onScroll($event: IEvent): void {
        this.getLogger().debug('onScroll', $event);
        this.scroll.emit($event);
    }

    /**
     * Fired when scrolled to the end of items.
     * Can be used for loading more items in chunks.
     * @param $event {IEvent} no data
     */
    protected onScrollToEnd($event: IEvent): void {
        this.getLogger().debug('onScrollToEnd', $event);
        this.scrollToEnd.emit($event);
    }

    /**
     * Raise by clicking on 'Add new option' action.
     * @param $event {IEvent} as {IEvent#$event} is event data
     */
    protected onAddNewOption($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onAddNewOption', $event);
        this.addNewOption.emit($event);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Parse the specified option item images
     * @param item to parse
     */
    public parseOptionImages(item: any): string[] {
        if (!this.getConfigValue('enableImage', false)) {
            return [];
        }

        const parser: (item: any) => string | string[] | null = this.getBindImage(item);
        let images: string[] = [];
        if (!isNullOrUndefined(parser)) {
            if (typeof parser === 'function') {
                const image: string | string[] = parser.apply(this, [item]);
                if (isArray(image)) {
                    images = Array.from(image);

                } else if ((image || '').length) {
                    images.push(image as string);
                }

            } else if (isArray(parser)) {
                images = [].concat(Array.from(parser));

            } else {
                images.push(parser as string);
            }
        }
        return images;
    }

    /**
     * Parse the specified option item first image
     * @param item to parse
     */
    public parseOptionFirstImage(item: any): string {
        const images: string[] = this.parseOptionImages(item);
        return (!isNullOrUndefined(images) && images.length ? images[0] : null);
    }

    /**
     * Get the bind value of the specified item
     * @param item to parse
     */
    public getBindValue(item: any): any {
        const bindValue: string = this.getConfigValue('bindValue');
        return (this.getBindProperty(item, bindValue, 'id')
            || this.getBindProperty(item, bindValue, 'code'));
    }

    /**
     * Get the bind iamge of the specified item
     * @param item to parse
     */
    public getBindImage(item: any): any {
        const bindValue: string = this.getConfigValue('bindImage');
        return this.getBindProperty(item, bindValue, 'image');
    }

    /**
     * Get the bind label of the specified item
     * @param item to parse
     */
    public getBindLabel(item: any): any {
        const bindLabel: string = this.getConfigValue('bindLabel');
        return (this.getBindProperty(item, bindLabel, 'title')
            || this.getBindProperty(item, bindLabel, 'text')
            || this.getBindProperty(item, bindLabel, 'name'));
    }

    /**
     * Get the bind property value of the specified item
     * @param item to parse
     * @param property item property to bind
     * @param defaultProperty default property to bind if not valid
     */
    public getBindProperty(item: any, property: string, defaultProperty?: string | null): any {
        let bindPropertyValue: any;
        if (!(property || '').length || !item || !item.hasOwnProperty(property)) {
            if (!(defaultProperty || '').length || !item || !item.hasOwnProperty(defaultProperty)) {
                bindPropertyValue = undefined;
            } else {
                bindPropertyValue = item[defaultProperty];
            }
        } else {
            bindPropertyValue = item[property];
        }
        return bindPropertyValue;
    }

    /**
     * The comparation from configuration. If not found in config, then it will compare by `bidnValue`
     * @param a to compare
     * @param b to compare
     */
    protected compareWith(a: any, b: any): boolean {
        const _this: AbstractSelectComponent<T> =
            (this[AbstractSelectComponent.NG_SELECT_PARENT_COMPONENT_REF_PROPERTY] || this);
        if (isNullOrUndefined(_this)) return false;

        const _compareWith: (a1: any, b1: any) => boolean = _this.getConfigValue('compareWith');
        if (isNullOrUndefined(_compareWith)) {
            const aObj: boolean = isObject(a);
            const bObj: boolean = isObject(b);
            const aVal: any = (aObj ? _this.getBindValue(a) : a);
            const bVal: any = (bObj ? _this.getBindValue(b) : b);
            return (aVal === bVal);
        }
        return _compareWith.apply(_this, [a, b]);
    }

    /**
     * Disable the option items by the specified values
     * @param values to make disable
     */
    public setDisabledItemsByValues(values: any[]): void {
        if (isNullOrUndefined(this.selectComponent)) {
            return;
        }
        this.findItems(values).forEach(option => option.disabled = true);
        this.getChangeDetectorRef().detectChanges();
    }

    /**
     * Find the {NgOption} array of the specified values array
     * @param values to find
     */
    public findItems(values: any[]): NgOption[] {
        if (isNullOrUndefined(this.selectComponent)) {
            return [];
        }

        const findValues: any[] = (isArray(values) ? Array.from(values)
            : !isNullOrUndefined(values) ? [values] : []);
        const _selectedItems: NgOption[] = [];
        if (findValues.length) {
            const multiple: boolean = this.getConfigValue('multiple', false);
            for (const value of findValues) {
                const item: NgOption = this.selectComponent.itemsList.findItem(value);
                if (!isNullOrUndefined(item)) {
                    _selectedItems.push(item);
                    if (!multiple) break;
                }
            }
        }
        return _selectedItems;
    }
}
