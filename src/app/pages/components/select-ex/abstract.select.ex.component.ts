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
import {DataSource} from '@app/types/index';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {
    AbstractComponent, IEvent,
} from '../abstract.component';
import ComponentUtils from '../../../utils/common/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {
    INgxSelectOptions,
    NgxSelectComponent, NgxSelectOptGroup,
    NgxSelectOption, TSelectOption,
} from 'ngx-select-ex';
import {BehaviorSubject} from 'rxjs';
import {IToolbarActionsConfig} from '../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';
import ObjectUtils from '../../../utils/common/object.utils';

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
     * Specify whether appending options drop-down to body
     * {boolean}
     */
    appendToBody?: boolean | false;
    /**
     * Specify whether using image for option
     * {boolean}
     */
    enableOptionImage?: boolean | false;
    /**
     * Provide an opportunity to change the name an image property of objects in the items
     * {string}
     */
    optionImageField?: string | null;
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
    showAddNewOption?: boolean | false;
    /**
     * The configuration of 'Add new option' action
     * {IToolbarActionsConfig}
     */
    addNewOptionConfig?: IToolbarActionsConfig | null;
}

/**
 * Default select configuration
 */
export const DefaultNgxSelectExOptions: INgxSelectExOptions = {
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
     * Provide an opportunity to change the name an image property of objects in the items
     * {string}
     */
    optionImageField: 'image',
    /**
     * Mode of this component. If set true user can select more than one option
     * {boolean}
     */
    multiple: false,
    /**
     * Set to true to allow the selection to be cleared. This option only applies to single-value inputs
     * {boolean}
     */
    allowClear: true,
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
    /**
     * Specify whether appending options drop-down to body
     * {boolean}
     */
    appendToBody: false,
    /**
     * Specify whether using image for option
     * {boolean}
     */
    enableOptionImage: true,
    /**
     * Shows the 'Add new option' action in case of out of items at all
     * {boolean}
     */
    showAddNewOption: false,
    /**
     * The configuration of 'Add new option' action
     * {IToolbarActionsConfig}
     */
    addNewOptionConfig: {
        id: 'addNewOption',
        type: 'button',
        label: 'Add new option',
    },
};

/**
 * Abstract select-ex component base on {NgxSelectComponent}
 */
export abstract class AbstractSelectExComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    protected static SELECT_ELEMENT_SELECTOR: string = 'ngx-select';
    protected static SELECT_ITEM_GROUP_ELEMENT_SELECTOR: string = 'ngx-select__item-group';
    protected static SELECT_ITEM_ELEMENT_SELECTOR: string = 'ngx-select__item';
    SELECT_SEARCH_CALLBACK: SelectSearchCallbackDelegate =
        (search?: string | null, item?: NgxSelectOption) => {
            return this.onSearchCallback({ data: { search: search, item: item } });
        };

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NgxSelectComponent)
    private readonly queryNgxSelectComponent: QueryList<NgxSelectComponent>;
    private ngxSelectExComponent: NgxSelectComponent;

    /**
     * Raise after items already were loaded to show
     */
    @Output() readonly finishedLoading: EventEmitter<any> = new EventEmitter<any>();

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
    /**
     * Use to set default value
     * {any[]}
     */
    private _initialValues: any[];

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
     * Get the option items array to show
     * @return the option items array
     */
    @Input() get items(): any[] {
        return this._items || [];
    }

    /**
     * Set the option items array to show
     * @param items to apply
     */
    set items(items: any[]) {
        this._items = (items || []);
    }

    /**
     * Get the filtered {TSelectOption} that are being shown
     * @return the filtered {TSelectOption} that are being shown
     */
    protected get optionsFiltered(): TSelectOption[] {
        return (this.selectComponent ? this.selectComponent.optionsFiltered : []);
    }

    /**
     * Get a boolean value indicating the specified option whether is the latest option that are being shown
     * @param option to check
     * @return true for latest; else false
     */
    private isLatestOption(option: TSelectOption): boolean {
        const optsLength: number = this.optionsFiltered.length;
        return this.optionsFiltered.lastIndexOf(option) >= (optsLength - 1);
    }

    /**
     * Get the initial selected option items array to show
     * @return the initial selected  items array
     */
    @Input() get initialValues(): any[] {
        return this._initialValues || [];
    }

    /**
     * Set the initial selected option items array to show
     * @param items to apply
     */
    set initialValues(items: any[]) {
        this._initialValues = (items || []);
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
                          config?: INgxSelectExOptions | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        // this.setConfig(config);
        this.config = config;
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
                        $event => this.onSelectFocus({ event: $event }));
                    component && component.blur.subscribe(
                        $event => this.onSelectBlur({ event: $event }));
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
        const keyword: string = (!$event || !$event.data || !$event.data['search'] ? ''
            : (<Object>$event.data['search']).toString().toLowerCase());
        const optionText: string = (!$event || !$event.data || !($event.data['item'] instanceof NgxSelectOption)
            || !((<NgxSelectOption>$event.data['item']).text || '').length ? ''
            : (<NgxSelectOption>$event.data['item']).text.toLowerCase());
        return (keyword.length || optionText.length ? optionText.indexOf(keyword) >= 0 : true);
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
            (this.config.multiple ? this.selectComponent.optionsSelected || [] : []).concat(opts);
        (<BehaviorSubject<any>>this.selectComponent['subjOptionsSelected']).next(currentOptionsSelected);
    }

    /**
     * Find the specified option value
     * @param optionValue to filter
     */
    public filterOptions(optionValue: number | string): NgxSelectOption {
        const options: TSelectOption[] = this.selectComponent.optionsFiltered || [];
        let foundOption: NgxSelectOption;
        for (const option of options) {
            switch (option.type) {
                case 'optgroup': {
                    foundOption = this.__filterOptions(
                        (<NgxSelectOptGroup>option).options, optionValue);
                    break;
                }
                case 'option': {
                    foundOption = ((<NgxSelectOption>option).value === optionValue
                        ? <NgxSelectOption>option : undefined);
                    break;
                }
            }
            if (ObjectUtils.isNotNou(foundOption)) {
                break;
            }
        }
        return foundOption;
    }
    /**
     * Find the specified option value
     * @param options to filter
     * @param optionValue to filter
     */
    private __filterOptions(options: NgxSelectOption[], optionValue: number | string): NgxSelectOption {
        const foundOptions: NgxSelectOption[] = (options || []).filter(option => {
            return (option && option.value === optionValue);
        });
        return ((foundOptions || []).length ? foundOptions[0] : undefined);
    }
}
