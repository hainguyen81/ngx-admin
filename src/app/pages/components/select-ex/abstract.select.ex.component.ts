import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    Inject, Input,
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
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import ComponentUtils from '../../../utils/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {INgxSelectOptions, NgxSelectComponent, NgxSelectOption} from 'ngx-select-ex';

/**
 * The interface of data while searching option items
 */
export interface ISelectSearchCallbackData {
    /** keyword */
    search?: string | null;
    /** concurrency item in searching */
    item?: NgxSelectOption | null;
}

/**
 * The delegate of {ISelectSearchCallbackData} while searching
 */
export type SelectSearchCallbackDelegate = (search?: string | null, item?: NgxSelectOption) => boolean;

/**
 * The extension of {INgxSelectOptions}
 */
export interface INgxSelectExOptions extends INgxSelectOptions {
    /**
     * Automatically activate item when mouse enter on it
     * {boolean}
     */
    autoActiveOnMouseEnter: boolean | true;
    /**
     * Keeps the select menu opened
     * {boolean}
     */
    keepSelectMenuOpened: boolean | false;
    /**
     * Shows the "Not Found" menu option in case of out of items at all
     * {boolean}
     */
    showOptionNotFoundForEmptyItems: boolean | false;
}

/**
 * Default select configuration
 */
export const DefaultNgxSelectOptions: INgxSelectExOptions = {
    /**
     * Provide an opportunity to change the name an id property of objects in the items
     * {string}
     */
    optionValueField: 'id',
    /**
     * Provide an opportunity to change the name a text property of objects in the items
     * {string}
     */
    optionTextField: 'text',
    /**
     * Provide an opportunity to change the name a label property of objects with an options property in the items
     * {string}
     */
    optGroupLabelField: 'label',
    /**
     * Provide an opportunity to change the name of an options property of objects in the items
     * {string}
     */
    optGroupOptionsField: 'options',
    /**
     * Mode of this component. If set true user can select more than one option
     * {boolean}
     */
    multiple: false,
    /**
     * Set to true to allow the selection to be cleared. This option only applies to single-value inputs
     * {boolean}
     */
    allowClear: false,
    /**
     * Set to true Placeholder text to display when the element has no focus and selected items
     * {string}
     */
    placeholder: '',
    /**
     * Set to true to hide the search input. This option only applies to single-value inputs
     * {boolean}
     */
    noAutoComplete: false,
    /**
     * Storing the selected items when the item list is changed
     * {boolean}
     */
    keepSelectedItems: false,
    /**
     * When true, it specifies that the component should be disabled
     * {boolean}
     */
    disabled: false,
    /**
     * Auto select a non disabled single option
     * {boolean}
     */
    autoSelectSingleOption: false,
    /**
     * Auto clear a search text after select an option. Has effect for multiple = true
     * {boolean}
     */
    autoClearSearch: false,
    /**
     * The default text showed when a search has no results
     * {string}
     */
    noResultsFound: 'No results found',
    /**
     * Adding bootstrap classes: form-control-sm, input-sm, form-control-lg input-lg, btn-sm, btn-lg
     * 'small'/'default'/'large'
     * {string}
     */
    size: 'default',
    /**
     * Automatically activate item when mouse enter on it
     * {boolean}
     */
    autoActiveOnMouseEnter: true,
    /**
     * Makes the component focused
     * {boolean}
     */
    isFocused: false,
    /**
     * Keeps the select menu opened
     * {boolean}
     */
    keepSelectMenuOpened: false,
    /**
     * Sets an autocomplete value for the input field
     * {string}
     */
    autocomplete: 'off',
    /**
     * Add css classes to the element with dropdown-menu class. For example dropdown-menu-right
     * {string}
     */
    dropDownMenuOtherClasses: '',
    /**
     * Shows the "Not Found" menu option in case of out of items at all
     * {boolean}
     */
    showOptionNotFoundForEmptyItems: false,
};

/**
 * Abstract select-ex component base on {NgxSelectComponent}
 */
export abstract class AbstractSelectExComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    protected static SELECT_ELEMENT_SELECTOR: string = 'ngx-select';
    protected static SELECT_ITEM_GROUP_ELEMENT_SELECTOR: string = 'ngx-select__item-group';
    protected static SELECT_ITEM_ELEMENT_SELECTOR: string = 'ngx-select__item';
    private SELECT_SEARCH_CALLBACK: SelectSearchCallbackDelegate =
        (search?: string | null, item?: NgxSelectOption) => {
            return this.onSearchCallback({ $data: { search: search, item: item } });
        }

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NgxSelectComponent)
    private readonly queryNgxSelectComponent: QueryList<NgxSelectComponent>;
    private ngxSelectExComponent: NgxSelectComponent;

    private config: INgxSelectOptions;
    /**
     * Items array.
     * Should be an array of objects with id and text properties.
     * As convenience, you may also pass an array of strings,
     * in which case the same string is used for both the ID and the text.
     * Items may be nested by adding a options property to any item,
     * whose value should be another array of items.
     * Items that have children may omit to have an ID.
     */
    @Input() private items: NgxSelectOption[];
    /**
     * Use to set default value
     * {any[]}
     */
    @Input() private initialValues: NgxSelectOption[];
    @Input() private model: any;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NgxSelectComponent} component
     * @return the {NgxSelectComponent} component
     */
    protected get selectComponent(): NgxSelectComponent {
        return this.ngxSelectExComponent;
    }

    /**
     * Get the {INgxSelectOptions} instance for configuring
     * @return the {INgxSelectOptions} instance
     */
    public getConfig(): INgxSelectOptions {
        return this.config || DefaultNgxSelectOptions;
    }

    /**
     * Set the {INgxSelectOptions} instance
     * @param config to apply. NULL for default
     */
    public setConfig(config?: INgxSelectOptions) {
        this.config = config;
    }

    /**
     * Get the option items array to show
     * @return the option items array
     */
    public getItems(): NgxSelectOption[] {
        return this.items || [];
    }

    /**
     * Set the option items array to show
     * @param items to apply
     */
    public setItems(items?: NgxSelectOption[]): void {
        this.items = (items || []);
    }

    /**
     * Get the initial selected option items array to show
     * @return the initial selected  items array
     */
    public getInitialValues(): NgxSelectOption[] {
        return this.initialValues || [];
    }

    /**
     * Set the initial selected option items array to show
     * @param items to apply
     */
    public setInitialValues(items?: NgxSelectOption[]): void {
        this.initialValues = (items || []);
    }

    /**
     * Get the {ngModel} instance for configuring
     * @return the {ngModel} instance
     */
    public getModel(): any {
        return this.model;
    }

    /**
     * Set the {ngModel} instance
     * @param model to apply. NULL for default
     */
    public setModel(model?: any) {
        this.model = model;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractSelectExComponent} class
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
     * @param treeviewConfig {TreeviewConfig}
     * @param dropdown specify using drop-down tree-view or normal tree-view
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
                          config?: INgxSelectOptions | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        this.setConfig(config);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.ngxSelectExComponent) {
            this.ngxSelectExComponent = ComponentUtils.queryComponent(
                this.queryNgxSelectComponent, component => {
                    component && component.focus.subscribe(
                        $event => this.onSelectFocus({ $event: $event }));
                    component && component.blur.subscribe(
                        $event => this.onSelectBlur({ $event: $event }));
                });
        }
    }

    /**
     * Raise by {NgxSelectComponent#focus} event.
     * Fired on select focus.
     * @param $event {IEvent} as {IEvent#$event} is event data
     */
    protected onSelectFocus($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSelectFocus', $event);
    }

    /**
     * Raise by {NgxSelectComponent#blur} event.
     * Fired on select blur.
     * @param $event {IEvent} as {IEvent#$event} is event data
     */
    protected onSelectBlur($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSelectBlur', $event);
    }

    /**
     * Callback while searching option items.
     * The callback function for custom filtering the select list
     * {(search: string, item: INgxSelectOption) => boolean}
     * @param $event {IEvent} with {IEvent#$data} is {ISelectSearchCallbackData}
     *              as {search: string, item: INgxSelectOption}
     */
    protected onSearchCallback($event: IEvent): boolean {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSearchCallback', $event);
        return false;
    }
}
