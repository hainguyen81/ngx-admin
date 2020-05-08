import {FORMLY_CONFIG, FormlyConfig, FormlyFieldConfig, FormlyFormBuilder} from '@ngx-formly/core';
import {
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    Inject, Injectable, Injector, Type,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {isNullOrUndefined} from 'util';
import {ConfigOption, ValidationMessageOption} from '@ngx-formly/core/lib/services/formly.config';

/**
 * Custom {FormlyFormBuilder} for translating form configuration
 */
export class NgxFormlyFormBuilderRuntime {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {ComponentFactoryResolver} instance
     * @return the {ComponentFactoryResolver} instance
     */
    protected get factoryResolver(): ComponentFactoryResolver {
        if (isNullOrUndefined(this._factoryResolver) && !isNullOrUndefined(this.serviceInjector)) {
            this._factoryResolver = this.serviceInjector.get(ComponentFactoryResolver);
        }
        return this._factoryResolver;
    }

    /**
     * Get the {ViewContainerRef} instance
     * @return the {ViewContainerRef} instance
     */
    protected get viewContainerRef(): ViewContainerRef {
        if (isNullOrUndefined(this._viewContainerRef) && !isNullOrUndefined(this.serviceInjector)) {
            this._viewContainerRef = this.serviceInjector.get(ViewContainerRef);
        }
        return this._viewContainerRef;
    }

    /**
     * Get the {ChangeDetectorRef} instance
     * @return the {ChangeDetectorRef} instance
     */
    protected get changeDetectorRef(): ChangeDetectorRef {
        if (isNullOrUndefined(this._changeDetectorRef) && !isNullOrUndefined(this.serviceInjector)) {
            this._changeDetectorRef = this.serviceInjector.get(ChangeDetectorRef);
        }
        return this._changeDetectorRef;
    }

    /**
     * Get the {ElementRef} instance
     * @return the {ElementRef} instance
     */
    protected get elementRef(): ElementRef {
        if (isNullOrUndefined(this._elementRef) && !isNullOrUndefined(this.serviceInjector)) {
            this._elementRef = this.serviceInjector.get(ElementRef);
        }
        return this._elementRef;
    }

    /**
     * Get the {Injector} instance
     * @return the {Injector} instance
     */
    protected get serviceInjector(): Injector {
        return this._injector;
    }

    /**
     * Get the {TranslateService} instance
     * @return the {TranslateService} instance
     */
    protected get translateService(): TranslateService {
        if (isNullOrUndefined(this._translateService) && !isNullOrUndefined(this.serviceInjector)) {
            this._translateService = this.serviceInjector.get(TranslateService);
        }
        return this._translateService;
    }

    /**
     * Get the {FormlyConfig} instance
     * @return the {FormlyConfig} instance
     */
    get formlyConfig(): FormlyConfig {
        return this._formlyConfig;
    }

    /**
     * Set the {FormlyConfig} instance
     * @param _config to apply
     */
    set formlyConfig(_config: FormlyConfig) {
        this._formlyConfig = this.translateFormConfig(_config);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractComponent} class
     * @param _translateService {TranslateService}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     * @param _injector {Injector}
     * @param _formlyConfig {FormlyConfig}
     */
    constructor(@Inject(TranslateService) private _translateService: TranslateService,
                @Inject(ComponentFactoryResolver) private _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) private _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) private _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) private _elementRef: ElementRef,
                @Inject(FORMLY_CONFIG) private _formlyConfig: FormlyConfig,
                @Inject(Injector) private _injector: Injector) {
        this._formlyConfig = this.translateFormConfig(_formlyConfig);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Translate the specified value
     * @param value to translate
     * @param interpolateParams message parameters
     * @return translated value or itself
     */
    public translate(value?: string, interpolateParams?: Object | null): string {
        if (!(value || '').length || !this.translateService) {
            return value;
        }
        return (interpolateParams
            ? this.translateService.instant(value, interpolateParams)
            : this.translateService.instant(value));
    }

    /**
     * Translate form configuration
     * @param _config {FormlyConfig}
     */
    private translateFormConfig(_config?: FormlyConfig): FormlyConfig {
        if (!isNullOrUndefined(_config)) {
            const _this: NgxFormlyFormBuilderRuntime = this;

            _config['messages:keys'] = {};
            const messages: any = _config.messages;
            if (Object.keys(messages).length) {
                Object.keys(messages).forEach(messageKey => {
                    const message: any = messages[messageKey];
                    messages[messageKey] = this.__translateFormValidationMessage(
                        messageKey, message, _config['messages:keys']);
                });
            }

            const __originalAddValidatorMessage: Function = _config.addValidatorMessage;
            _config.addValidatorMessage =
                (name: string, message: string | ((error: any, field: FormlyFieldConfig) => string)) => {
                    const translatedMessage: string | ((error: any, field: FormlyFieldConfig) => string) =
                        _this.__translateFormValidationMessage(name, message, _config['messages:keys']);
                    __originalAddValidatorMessage.apply(_config, [name, translatedMessage]);
                };

            const __originalGetValidatorMessage: Function = _config.getValidatorMessage;
            _config.getValidatorMessage = (name: string) => {
                return _this.__translateFormValidationMessage(
                    name, __originalGetValidatorMessage.apply(_config, [name]), _config['messages:keys']);
            };

            const __originalAddConfig: Function = _config.addConfig;
            _config.addConfig = (config: ConfigOption) => {
                (config.validationMessages || []).forEach((validationMessage: ValidationMessageOption) => {
                    validationMessage.message = _this.__translateFormValidationMessage(
                        validationMessage.name, validationMessage.message, _config['messages:keys']);
                });
                __originalAddConfig.apply(_config, [config]);
            };
        }
        return _config;
    }

    /**
     * Translate the form field validation message configuration
     * @param validationMessageKey current validation configuration key to cache
     * @param validationMessage form field validation message function or string to translate
     * @param cachedStorage cache storage for translating future
     * @private
     */
    private __translateFormValidationMessage(
        validationMessageKey: string, validationMessage: any, cachedStorage: any):
        string | ((e: any, f: FormlyFieldConfig) => string) {
        cachedStorage = (cachedStorage || {});
        if (typeof validationMessage === 'function') {
            return (e: any, f: FormlyFieldConfig) => {
                const validatedMessage: string = (<Function>validationMessage).apply(f, [e, f]);
                return ((validatedMessage || '').length ? this.translate(validatedMessage) : '');
            };

        } else if (typeof validationMessage === 'string' && (validationMessage || '').length) {
            const validationMessageNewKey: string = [validationMessageKey, 'key'].join(':');
            if (!cachedStorage.hasOwnProperty(validationMessageNewKey)) {
                cachedStorage[validationMessageNewKey] = validationMessage;
            }
            return this.translate(cachedStorage[validationMessageNewKey]);
        }
    }
}
