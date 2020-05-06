import {AfterViewInit, Inject, Input, OnDestroy, Renderer2} from '@angular/core';
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
    @Input('config') private _config: any;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the component configuration
     * @return the component configuration
     */
    get config(): any {
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
     * Get the configuration value of the specified configuration property key
     * @param propertyKey configuration key
     * @param defaultValue default value if not found or undefined
     */
    protected getConfigValue(propertyKey: string, defaultValue?: any | null): any {
        const value: any = this.config[propertyKey];
        return (isNullOrUndefined(value) ? defaultValue : value);
    }

    /**
     * Set the configuration value of the specified configuration property key
     * @param propertyKey configuration key
     * @param configValue configuration value
     */
    protected setConfigValue(propertyKey: string, configValue?: any | null): void {
        this.config[propertyKey] = configValue;
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
        }
    }

    /**
     * Get the application base href
     * @return the application base href
     */
    public get baseHref(): string {
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

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractFieldType} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param logger {NGXLogger}
     */
    protected constructor(@Inject(TranslateService) private _translateService: TranslateService,
                          @Inject(Renderer2) private _renderer: Renderer2,
                          @Inject(NGXLogger) private _logger: NGXLogger) {
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
        }
        this.field && this.field.expressionProperties
        && (this.expressionPropertyObserver() || '').length
        && this.field.expressionProperties.hasOwnProperty(this.expressionPropertyObserver())
        && of(this.field.expressionProperties[this.expressionPropertyObserver()])
            .subscribe(value => this.subscribeExpressionProperty(value));
        this.formControl
        && this.formControl.valueChanges.subscribe(value => this.onValueChanges(value));
        this.formControl
        && this.formControl.statusChanges.subscribe(value => this.onStatusChanges(value));
    }

    ngOnDestroy(): void {
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
    protected valueFormatter(value: any): any {
        return value;
    }

    /**
     * Parser function to parse the specified field viewed value or data instance to the model value
     * @param value to parse
     */
    protected valueParser(value?: any): any {
        let retValue: any;
        retValue = value;
        if (this.field) {
            for (const parser of (this.field.parsers || [])) {
                retValue = parser.apply(this, [retValue]);
            }
        }
        return retValue;
    }
}
