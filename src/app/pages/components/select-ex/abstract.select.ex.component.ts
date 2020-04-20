import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef, EventEmitter,
    Inject, Input, Output,
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
import {
    INgxSelectOptions,
    NgxSelectComponent,
    NgxSelectOption,
} from 'ngx-select-ex';
import {BehaviorSubject} from 'rxjs';
import {IToolbarActionsConfig} from '../toolbar/abstract.toolbar.component';

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
     * Specify whether using image for option
     * {boolean}
     */
    enableOptionImage?: boolean | false;
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
     * Shows the 'Not Found' menu option in case of out of items at all
     * {boolean}
     */
    showOptionNotFoundForEmptyItems: boolean | false;
    /**
     * Shows the 'Add new option' action in case of out of items at all
     * {boolean}
     */
    showAddNewOptionIfNotFound?: boolean | false;
    /**
     * The configuration of 'Add new option' action
     * {IToolbarActionsConfig}
     */
    addNewOptionConfig?: IToolbarActionsConfig | null;
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
     * Shows the 'Not Found' menu option in case of out of items at all
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

    /**
     * Raise after items already were loaded to show
     */
    @Output() finishedLoading: EventEmitter<any> = new EventEmitter<any>();

    @Input() config: INgxSelectOptions;
    /**
     * Items array.
     * Should be an array of objects with id and text properties.
     * As convenience, you may also pass an array of strings,
     * in which case the same string is used for both the ID and the text.
     * Items may be nested by adding a options property to any item,
     * whose value should be another array of items.
     * Items that have children may omit to have an ID.
     */
    @Input() private items: any[];
    /**
     * Use to set default value
     * {any[]}
     */
    @Input() private initialValues: any[];

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
        this.config = config || DefaultNgxSelectOptions;
    }

    /**
     * Get the option items array to show
     * @return the option items array
     */
    public getItems(): any[] {
        return this.items || [];
    }

    /**
     * Set the option items array to show
     * @param items to apply
     */
    public setItems(items?: any[]): void {
        this.items = (items || []);
    }

    /**
     * Get the initial selected option items array to show
     * @return the initial selected  items array
     */
    public getInitialValues(): any[] {
        return this.initialValues || [];
    }

    /**
     * Set the initial selected option items array to show
     * @param items to apply
     */
    public setInitialValues(items?: any[]): void {
        this.initialValues = (items || []);
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
                    component && component.subjOptions.subscribe(
                        value => this.finishedLoading.emit(value));
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
     * {(search: string, item: INgxSelectOption) => boolean}.
     * Default is <code>TRUE</code> for showing all items.
     * @param $event {IEvent} with {IEvent#$data} is {ISelectSearchCallbackData}
     *              as {search: string, item: INgxSelectOption}
     * @return true for showing this item; else false
     */
    protected onSearchCallback($event: IEvent): boolean {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSearchCallback', $event);
        const keyword: string = (!$event || !$event.$data || !$event.$data['search'] ? ''
            : (<Object>$event.$data['search']).toString().toLowerCase());
        const optionText: string = (!$event || !$event.$data || !($event.$data['item'] instanceof NgxSelectOption)
            || !((<NgxSelectOption>$event.$data['item']).text || '').length ? ''
            : (<NgxSelectOption>$event.$data['item']).text.toLowerCase());
        return (keyword.length && optionText.length ? optionText.indexOf(keyword) >= 0 : true);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Get the selected options
     * @return {NgxSelectOption} array
     */
    public get selectedOptions(): NgxSelectOption[] {
        return (this.selectComponent ? this.selectComponent.optionsSelected : []);
    }

    /**
     * Get the selected options
     * @return {NgxSelectOption} array
     */
    public get selectedOptionValues(): any[] {
        const selectedOptions: NgxSelectOption[] = this.selectedOptions;
        let selectedValues: any[];
        selectedValues = [];
        selectedOptions.forEach(opt => {
            selectedValues.push(opt.data);
        });
        return selectedValues;
    }

    /**
     * Set the selected items
     * TODO Need to cross-check with multiple selected items and items group
     * @param items to apply
     */
    public setSelectedItems(items?: any[]) {
        if (!this.selectComponent
            || typeof this.selectComponent['buildOption'] !== 'function'
            || !(this.selectComponent['subjOptionsSelected'] instanceof BehaviorSubject)) {
            this.getLogger().warn('Could not apply selected items!');
            return;
        }

        let buildOptFnc: any;
        buildOptFnc = this.selectComponent['buildOption'];
        let opts: NgxSelectOption[];
        opts = [];
        (items || []).forEach(it => {
            const opt: NgxSelectOption = buildOptFnc['apply'](this.selectComponent, [it, null]);
            opt && opts.push(opt);
        });
        const currentOptionsSelected: NgxSelectOption[] =
            (this.getConfig().multiple ? this.selectComponent.optionsSelected || [] : []).concat(opts);
        (<BehaviorSubject<any>>this.selectComponent['subjOptionsSelected']).next(currentOptionsSelected);
    }
}
