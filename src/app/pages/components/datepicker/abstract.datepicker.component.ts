import {DatePickerComponent, IDatePickerConfig} from 'ng2-date-picker';
import {DataSource} from '@app/types/index';
import {AbstractComponent, IEvent} from '../abstract.component';
import {AfterContentChecked, ChangeDetectorRef, ComponentFactoryResolver, ElementRef, EventEmitter, Inject, Input, Output, Renderer2, ViewContainerRef,} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {Moment} from 'moment';
import ObjectUtils from '../../../utils/common/object.utils';

export interface INgxDatePickerConfig {
    /**
     * The mode of the calender which will be displayed in the picker
     * Default is 'day'
     */
    mode?: 'day' | 'month' | 'time' | 'daytime';
    /**
     * Indicates on what date to open the calendar on
     * TODO Only for day|month|daytime
     */
    displayDate?: string | null;
    /**
     * If set to true the input would be disabled
     */
    disabled?: boolean | false;
    /**
     * The date-picker input placeholder
     */
    placeholder?: string | '';
    /**
     * This is a validation rule, if there won't be any selected date then the containing form will be invalid.
     */
    required?: boolean | false;
    /**
     * This is a validation rule, if the selected date will be before minDate the containing form will be invalid.
     * TODO Note: if provided as string format configuration should be provided in the config object.
     * TODO Only for day|month|daytime
     */
    minDate?: string | null;
    /**
     * This is a validation rule, if the selected date will be after maxDate the containing form will be invalid.
     * TODO Note: if provided as string format configuration should be provided in the config object.
     * TODO Only for day|month|daytime
     */
    maxDate?: string | null;
    /**
     * This is a validation rule, if the selected date will be before minTime the containing form will be invalid.
     * TODO Note: if provided as string format configuration should be provided in the config object.
     * TODO Only for time
     */
    minTime?: string | null;
    /**
     * This is a validation rule, if the selected date will be after maxTime the containing form will be invalid.
     * TODO Note: if provided as string format configuration should be provided in the config object.
     * TODO Only for time
     */
    maxTime?: string | null;
    theme?: string | null;
    /**
     * {IDatePickerConfig}
     */
    config?: IDatePickerConfig | null;
}

/**
 * Abstract tree-view component base on {DatePickerComponent}
 */
export abstract class AbstractDatePickerComponent<T extends DataSource>
    extends AbstractComponent implements AfterContentChecked {

    protected static DATEPICKER_SELECTOR: string = 'dp-date-picker';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _model: any;

    private _selected: Moment[];

    @Output() readonly openListener: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);
    @Output() readonly closeListener: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);
    @Output() readonly selectListener: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {DatePickerComponent} instance
     * @return the {DatePickerComponent} instance
     */
    protected abstract get datePickerComponent(): DatePickerComponent;

    @Input('config') get config(): any {
        return super.config;
    }

    set config(_config: any) {
        super.config = _config;
        const __config: INgxDatePickerConfig = _config as INgxDatePickerConfig;
        const __dtConfig: IDatePickerConfig = (__config ? __config.config : undefined);
        if (ObjectUtils.isNotNou(__dtConfig) && (__dtConfig.format || '').length) {
            __dtConfig.format = this.translate(__dtConfig.format);
        }
        if (this.datePickerComponent) {
            this.datePickerComponent.config = this.getConfigValue('config');
            this.datePickerComponent.displayDate = this.displayDate;
            this.datePickerComponent.disabled = this.isDisabled;
            this.datePickerComponent.maxDate = this.maxDate;
            this.datePickerComponent.maxTime = this.maxTime;
            this.datePickerComponent.minDate = this.minDate;
            this.datePickerComponent.minTime = this.minTime;
            this.datePickerComponent.placeholder = this.translate(this.placeholder || '');
            this.datePickerComponent.theme = this.theme;
        }
    }

    /**
     * Get a boolean value indicating the popup whether is showing
     * @return true for showing; else false
     */
    get isShowing(): boolean {
        return this.datePickerComponent && this.datePickerComponent._areCalendarsShown;
    }

    /**
     * Data model
     */
    @Input('model') get model(): any {
        return this._model;
    }

    /**
     * Data model
     */
    set model(_model: any) {
        this._model = _model;
    }

    /**
     * The mode of the calender which will be displayed in the picker
     * Default is 'day'
     */
    get mode(): string {
        return this.getConfigValue('mode', 'day');
    }

    /**
     * Indicates on what date to open the calendar on
     * TODO Only for day|month|daytime
     */
    get displayDate(): string {
        return this.getConfigValue('displayDate');
    }

    /**
     * Indicates on what date to open the calendar on
     * TODO Only for day|month|daytime
     */
    set displayDate(_displayDate: string) {
        this.getConfigValue('displayDate', _displayDate);
    }

    /**
     * If set to true the input would be disabled
     */
    get isDisabled(): boolean {
        return this.getConfigValue('disabled', false);
    }

    /**
     * The date-picker input placeholder
     */
    get placeholder(): string {
        return this.getConfigValue('placeholder');
    }

    /**
     * This is a validation rule, if there won't be any selected date then the containing form will be invalid.
     */
    get isRequired(): boolean {
        return this.getConfigValue('required', false);
    }

    /**
     * This is a validation rule, if the selected date will be before minDate the containing form will be invalid.
     * TODO Note: if provided as string format configuration should be provided in the config object.
     * TODO Only for day|month|daytime
     */
    get minDate(): string {
        return this.getConfigValue('minDate');
    }

    /**
     * This is a validation rule, if the selected date will be after maxDate the containing form will be invalid.
     * TODO Note: if provided as string format configuration should be provided in the config object.
     * TODO Only for day|month|daytime
     */
    get maxDate(): string {
        return this.getConfigValue('maxDate');
    }

    /**
     * This is a validation rule, if the selected date will be before minTime the containing form will be invalid.
     * TODO Note: if provided as string format configuration should be provided in the config object.
     * TODO Only for time
     */
    get minTime(): string {
        return this.getConfigValue('minTime');
    }

    /**
     * This is a validation rule, if the selected date will be after maxTime the containing form will be invalid.
     * TODO Note: if provided as string format configuration should be provided in the config object.
     * TODO Only for time
     */
    get maxTime(): string {
        return this.getConfigValue('maxTime');
    }

    get theme(): string {
        return this.getConfigValue('theme');
    }

    get datePickerConfig(): IDatePickerConfig {
        return this.getConfigValue('config') as IDatePickerConfig;
    }

    @Input('selected') get selected(): Moment[] {
        return this._selected;
    }

    set selected(_selected: Moment[]) {
        this._selected = _selected;
        if (this.datePickerComponent) {
            this.datePickerComponent.selected = _selected;
        }
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractDatePickerComponent} class
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

    ngAfterContentChecked() {
        super.ngAfterContentChecked();

        this.datePickerComponent
        && this.datePickerComponent.onScroll();
    }

    onClose($event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClose', $event);
        this.closeListener.emit($event);
    }

    onChange($event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onChange', $event);
    }

    onGoToCurrent($event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onGoToCurrent', $event);
    }

    onLeftNav($event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onLeftNav', $event);
    }

    onRightNav($event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onRightNav', $event);
    }

    onSelect($event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSelect', $event);
        this.selectListener.emit($event);
    }

    onOpen($event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onOpen', $event);
        this.openListener.emit($event);
    }
}
