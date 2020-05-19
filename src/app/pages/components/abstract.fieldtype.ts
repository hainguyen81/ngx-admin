import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {of, throwError} from 'rxjs';
import {FieldType} from '@ngx-formly/material';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {NGXLogger} from 'ngx-logger';
import {IEvent} from './abstract.component';
import {isNullOrUndefined} from 'util';
import HtmlUtils from '../../utils/html.utils';

export abstract class AbstractFieldType<F extends FormlyFieldConfig = FormlyFieldConfig>
    extends FieldType<F> implements OnDestroy, AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _field: F;
    private _config: any;
    /* use for standalone component */
    private __internalValue: any;

    private _valueFormatter: (value: any) => any;
    private _valueParser: (value: any) => any;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the component configuration
     * @return the component configuration
     */
    @Input('config') get config(): any {
        return this._config;
    }

    /**
     * Set the {NgxTreeviewConfig} instance
     * @param _config to apply. NULL for default
     */
    set config(_config: any) {
        this._config = _config;
        if (this._field) {
            this._field.templateOptions = (this._field.templateOptions || {});
            if (!(<Object>this._field.templateOptions).hasOwnProperty('config')
                || isNullOrUndefined(this._field.templateOptions['config'])
                || this._field.templateOptions['config'] !== this._config) {
                this._field.templateOptions['config'] = this._config;
            }
        }
    }

    /**
     * Get the method to format field value to show
     * @return the method to format field value to show
     */
    get valueFormatter(): (value: any) => any {
        let formatter: (value: any) => any = this._valueFormatter;
        if (isNullOrUndefined(formatter) || typeof formatter !== 'function') {
            formatter = this.getConfigValue('valueFormatter');
        }
        return formatter;
    }

    /**
     * Get the method to format field value to show
     * @return the method to format field value to show
     */
    set valueFormatter(_valueFormatter: (value: any) => any) {
        this._valueFormatter = _valueFormatter;
    }

    /**
     * Get the method to format field value to show
     * @return the method to format field value to show
     */
    get valueParser(): (value: any) => any {
        let parser: (value: any) => any = this._valueParser;
        if (isNullOrUndefined(parser) || typeof parser !== 'function') {
            parser = this.getConfigValue('valueParser');
        }
        return parser;
    }

    /**
     * Get the method to format value to field value
     * @return the method to format value to field value
     */
    set valueParser(_valueParser: (value: any) => any) {
        this._valueParser = _valueParser;
    }

    /**
     * Get the configuration value of the specified configuration property key
     * @param propertyKey configuration key
     * @param defaultValue default value if not found or undefined
     */
    protected getConfigValue(propertyKey: string, defaultValue?: any | null): any {
        const _config: any = this.config;
        const value: any = (_config || {})[propertyKey];
        return (isNullOrUndefined(value) ? defaultValue : value);
    }

    /**
     * Set the configuration value of the specified configuration property key
     * @param propertyKey configuration key
     * @param configValue configuration value
     */
    protected setConfigValue(propertyKey: string, configValue?: any | null): void {
        const _config: any = this.config;
        if (!isNullOrUndefined(_config)) {
            _config[propertyKey] = configValue;
        }
    }

    /**
     * Get the {FormlyFieldConfig} instance
     * @return the {FormlyFieldConfig} instance
     */
    get field(): F {
        return this._field;
    }

    /**
     * Set the {FormlyFieldConfig} instance
     * @param field to apply
     */
    set field(field: F) {
        this._field = field;
        if (this._field) {
            this._field.templateOptions = (this._field.templateOptions || {});
            this._field.templateOptions['componentRef'] = this;
            if ((<Object>this._field.templateOptions).hasOwnProperty('config')
                && (isNullOrUndefined(this._config) || this._field.templateOptions['config'] !== this.config)) {
                this.config = this._field.templateOptions['config'];
            }
            if (this._field.formControl) {
                this._field.formControl['componentRef'] = this;
            }
        }
    }

    /**
     * Get the application base href
     * @return the application base href
     */
    get baseHref(): string {
        return HtmlUtils.getBaseHref();
    }

    /**
     * Get the {TranslateService} instance for applying multilingual
     * @return the {TranslateService} instance
     */
    protected get translateService(): TranslateService {
        return this._translateService;
    }

    /**
     * Get the {Renderer2} instance for applying HTML element attributes
     * @return the {Renderer2} instance
     */
    protected get renderer(): Renderer2 {
        return this._renderer;
    }

    /**
     * Get the {Renderer2} instance for applying HTML element attributes
     * @return the {Renderer2} instance
     */
    protected get logger(): NGXLogger {
        return this._logger;
    }

    /**
     * TODO Override to define the {FormlyFieldConfig#expressionProperties} key to observe
     */
    protected expressionPropertyObserver(): string {
        return null;
    }

    /**
     * Get the {ComponentFactoryResolver} instance
     * @return the {ComponentFactoryResolver} instance
     */
    protected get factoryResolver(): ComponentFactoryResolver {
        return this._factoryResolver;
    }

    /**
     * Get the {ViewContainerRef} instance
     * @return the {ViewContainerRef} instance
     */
    protected get viewContainerRef(): ViewContainerRef {
        return this._viewContainerRef;
    }

    /**
     * Get the {ChangeDetectorRef} instance
     * @return the {ChangeDetectorRef} instance
     */
    protected get changeDetectorRef(): ChangeDetectorRef {
        return this._changeDetectorRef;
    }

    /**
     * Get the {ElementRef} instance
     * @return the {ElementRef} instance
     */
    protected get elementRef(): ElementRef {
        return this._elementRef;
    }

    /**
     * Get the field value
     * @return the field value
     */
    get value(): any {
        return this._field && this.formControl ? super.value : this.__internalValue;
    }

    /**
     * Set field value
     * @param _value to apply
     */
    set value(_value: any) {
        const parsedValue: any = this.parseValue(_value);
        window.console.error(['set value', _value, super.value, parsedValue]);
        if (!isNullOrUndefined(this._field) && !isNullOrUndefined(this.formControl) && super.value !== parsedValue) {
            super.value = parsedValue;

        } else if (this.__internalValue !== parsedValue) {
            this.__internalValue = parsedValue;
        }
    }

    /**
     * Get the formatted value value to show if necessary
     * @return the formatted value
     */
    protected get viewValue(): any {
        return this.formatValue(this.value);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractFieldType} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    protected constructor(@Inject(TranslateService) private _translateService: TranslateService,
                          @Inject(Renderer2) private _renderer: Renderer2,
                          @Inject(NGXLogger) private _logger: NGXLogger,
                          @Inject(ComponentFactoryResolver) private _factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) private _viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) private _changeDetectorRef: ChangeDetectorRef,
                          @Inject(ElementRef) private _elementRef: ElementRef) {
        super();
        _translateService || throwError('Could not inject TranslateService');
        _renderer || throwError('Could not inject Renderer2');
        _logger || throwError('Could not inject NGXLogger');
        _translateService.onLangChange.subscribe(value => this.onLangChange({event: value}));
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        if (this.field) {
            this.field.className = [(this.field.className || ''),
                'custom-form-field'].join(' ').trim();
            this.field.expressionProperties
            && (this.expressionPropertyObserver() || '').length
            && this.field.expressionProperties.hasOwnProperty(this.expressionPropertyObserver())
            && of(this.field.expressionProperties[this.expressionPropertyObserver()])
                .subscribe(value => this.subscribeExpressionProperty(value));
            this.formControl
            && this.formControl.valueChanges.subscribe(value => this.onValueChanges(value));
            this.formControl
            && this.formControl.statusChanges.subscribe(value => this.onStatusChanges(value));
        }
    }

    ngOnDestroy(): void {
        // this.changeDetectorRef.detach();
        if (this.field && this.field.formControl) {
            delete this._field.formControl['componentRef'];
        }
        if (this.field && this.field.templateOptions) {
            delete this._field.templateOptions['componentRef'];
        }
    }

    /**
     * Triggered `languageChange` event
     * @param event {IEvent} that contains {$event} as LangChangeEvent
     */
    onLangChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.logger.debug('onLangChange', event, '[', this.constructor.name, ']');
    }

    protected onValueChanges(value: any): void {
        this.logger.debug('onValueChanges', value, '[', Reflect.getPrototypeOf(this).constructor.name, ']');
    }

    protected onStatusChanges(value: any): void {
        this.logger.debug('onStatusChanges', value, '[', Reflect.getPrototypeOf(this).constructor.name, ']');
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Subscribe a changes by expression property via {AbstractFieldType#expressionPropertyObserver}
     * @param value to subscribe
     */
    protected subscribeExpressionProperty(value: any): void {
        this.logger.error('Subscribe', value);
    }

    /**
     * Translate the specified value
     * @param value to translate
     * @param interpolateParams parameters
     * @return translated value or itself
     */
    public translate(value?: string, interpolateParams?: Object | null): string {
        if (!(value || '').length || !this.translateService) {
            return value;
        }
        return (interpolateParams ? this.translateService.instant(value, interpolateParams)
            : this.translateService.instant(value));
    }

    /**
     * Formatter function to format the model field value to viewed value
     * @param value model value to format
     */
    protected formatValue(value: any): any {
        const formatter: (value: any) => any = this.valueFormatter;
        return (isNullOrUndefined(formatter) || typeof formatter !== 'function'
            ? value : formatter.apply(this, [value]));
    }

    /**
     * Parser function to parse the specified field viewed value or data instance to the model value
     * @param value to parse
     */
    protected parseValue(value?: any): any {
        let retValue: any;
        retValue = value;
        const parser: (value: any) => any = this.valueParser;
        if ((isNullOrUndefined(parser) || typeof parser !== 'function') && this.field) {
            for (const _parser of (this.field.parsers || [])) {
                retValue = _parser.apply(this, [retValue]);
            }

        } else if (!isNullOrUndefined(parser) && typeof parser === 'function') {
            retValue = parser.apply(this, [retValue]);
        }
        return retValue;
    }

    /**
     * Detect changes
     */
    public detectChanges(): void {
        if (!(<any>this.changeDetectorRef).destroyed) {
            this.changeDetectorRef.detectChanges();
        }
    }
}
