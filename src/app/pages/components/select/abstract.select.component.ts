import {
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
import {
    INgxSelectOptions,
} from 'ngx-select-ex';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {DropdownPosition, NgOption, NgSelectComponent} from '@ng-select/ng-select';

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
     * Default is true
     * @param $event {KeyboardEvent}
     */
    keyDownFn?: ($event: KeyboardEvent) => boolean | true;
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
    appendTo: null,
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
     * Default is true
     * @param $event {KeyboardEvent}
     */
    keyDownFn: true,
};

/**
 * Abstract select component base on {NgSelectComponent}
 */
export abstract class AbstractSelectComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NgSelectComponent)
    private readonly queryNgSelectComponent: QueryList<NgSelectComponent>;
    private ngSelectComponent: NgSelectComponent;

    /**
     * Raise after items already were loaded to show
     */
    @Output() finishedLoading: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Items array.
     * Should be an array of objects with id and text properties.
     * As convenience, you may also pass an array of strings,
     * in which case the same string is used for both the ID and the text.
     * Items may be nested by adding a options property to any item,
     * whose value should be another array of items.
     * Items that have children may omit to have an ID.
     */
    @Input('items') private _items: any[];

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
    public get items(): any[] {
        return this.items || [];
    }

    /**
     * Set the option items array to show
     * @param _items to apply
     */
    public set items(_items: any[]) {
        this._items = (_items || []);
    }

    /**
     * Get the selected options
     * @return the selected options
     */
    get selectedItems(): NgOption[] {
        return (this.selectComponent ? this.selectComponent.selectedItems : []);
    }

    /**
     * Get the selected values
     * @return the selected values
     */
    get selectedValues(): any[] {
        return (this.selectComponent ? this.selectComponent.selectedValues : []);
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
            this.ngSelectComponent = ComponentUtils.queryComponent(
                this.queryNgSelectComponent, component => {
                    component && component.addEvent.subscribe(addedItem => {
                        this.onAdd({ data: addedItem });
                    });
                    component && component.blurEvent.subscribe($event => {
                        this.onBlur({ event: $event });
                    });
                    component && component.changeEvent.subscribe(model => {
                        this.onChange({ data: model });
                    });
                    component && component.closeEvent.subscribe($event => {
                        this.onClose({ event: $event });
                    });
                    component && component.clearEvent.subscribe($event => {
                        this.onClear({ event: $event });
                    });
                    component && component.focusEvent.subscribe($event => {
                        this.onFocus({ event: $event });
                    });
                    component && component.searchEvent.subscribe(data => {
                        this.onSearch({ data: data });
                    });
                    component && component.searchEvent.subscribe(data => {
                        this.onSearch({ data: data });
                    });
                    component && component.openEvent.subscribe($event => {
                        this.onOpen({ event: $event });
                    });
                    component && component.removeEvent.subscribe(removedItem => {
                        this.onRemove({ data: removedItem });
                    });
                    component && component.scroll.subscribe(data => {
                        this.onScroll({ data: data });
                    });
                    component && component.scrollToEnd.subscribe($event => {
                        this.onScrollToEnd({ event: $event });
                    });
                });
        }
    }

    /**
     * Fired when item is added while [multiple]='true'. Outputs added item.
     * $event {IEvent} with data is an added item
     */
    protected onAdd($event: IEvent): void {
        this.getLogger().debug('onAdd', $event);
    }

    /**
     * Fired on model change. Outputs whole model
     * @param $event {IEvent} with data is model
     */
    protected onChange($event: IEvent): void {
        this.getLogger().debug('onChange', $event);
    }

    /**
     * Fired on select dropdown close
     * @param $event {IEvent} no data
     */
    protected onClose($event: IEvent): void {
        this.getLogger().debug('onClose', $event);
    }

    /**
     * Fired on clear icon click
     * @param $event {IEvent} no data
     */
    protected onClear($event: IEvent): void {
        this.getLogger().debug('onClear', $event);
    }

    /**
     * Fired while typing search term. Outputs search term with filtered items
     * @param $event {IEvent} with data is { term, items: this.itemsList.filteredItems.map(x => x.value) }
     */
    protected onSearch($event: IEvent): void {
        this.getLogger().debug('onSearch', $event);
    }

    /**
     * Fired on select dropdown open
     * @param $event {IEvent} no data
     */
    protected onOpen($event: IEvent): void {
        this.getLogger().debug('onOpen', $event);
    }

    /**
     * Fired when item is removed while [multiple]='true'
     * @param $event {IEvent} with data is a removed item
     */
    protected onRemove($event: IEvent): void {
        this.getLogger().debug('onRemove', $event);
    }

    /**
     * Fired when scrolled.
     * Provides the start and end index of the currently available items.
     * Can be used for loading more items in chunks before the user has scrolled all the way to the bottom of the list.
     * @param $event {IEvent} with data is { start: number; end: number }
     */
    protected onScroll($event: IEvent): void {
        this.getLogger().debug('onScroll', $event);
    }

    /**
     * Fired when scrolled to the end of items.
     * Can be used for loading more items in chunks.
     * @param $event {IEvent} no data
     */
    protected onScrollToEnd($event: IEvent): void {
        this.getLogger().debug('onScrollToEnd', $event);
    }
}
