import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source';
import {AbstractComponent, IEvent} from '../abstract.component';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    QueryList,
    Renderer2,
    Type,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ConfigOption, FormlyConfig, FormlyFieldConfig, FormlyForm, FormlyFormOptions} from '@ngx-formly/core';
import {FormGroup} from '@angular/forms';
import ComponentUtils from '../../../utils/common/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {FormlyTemplateOptions} from '@ngx-formly/core/lib/components/formly.field.config';
import {IToolbarActionsConfig} from '../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {ValidationMessageOption} from '@ngx-formly/core/lib/services/formly.config';
import ObjectUtils from '../../../utils/common/object.utils';
import ArrayUtils from '../../../utils/common/array.utils';

/**
 * Abstract formly component base on {FormlyModule}
 */
export abstract class AbstractFormlyComponent<T, D extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(FormlyForm)
    private readonly queryFormlyForm: QueryList<FormlyForm>;
    private formlyForm: FormlyForm;

    /* whole form group */
    private formGroup: FormGroup = new FormGroup({});

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get form model
     * @return form model
     */
    abstract getModel(): T;

    /**
     * Get whole {FormGroup}
     * @return {FormGroup}
     */
    public getFormGroup(): FormGroup {
        return this.formGroup;
    }

    /**
     * Get the form fields configuration
     * @return the form fields configuration
     */
    get fields(): FormlyFieldConfig[] {
        return this._fields || [];
    }

    /**
     * Set the form fields configuration
     * @param fields to apply
     */
    set fields(fields: FormlyFieldConfig[]) {
        this._fields = fields || [];
        // translate form fields
        this.translateFormFields();
    }

    /**
     * Get the form actions configuration
     * @return the form actions configuration
     */
    public getActions(): IToolbarActionsConfig[] {
        return this.actions;
    }

    /**
     * Set the form actions configuration
     * @param actions to apply
     */
    protected setActions(actions: IToolbarActionsConfig[]) {
        this.actions = actions;
    }

    /**
     * Get the form options configuration
     * @return the form options configuration
     */
    public getOptions(): FormlyFormOptions {
        return this.options;
    }

    /**
     * Set the form options configuration
     * @param options to apply
     */
    protected setOptions(options: FormlyFormOptions) {
        this.options = options;
    }

    /**
     * Get the {FormlyForm} instance
     * @return the {FormlyForm} instance
     */
    protected getFormlyForm(): FormlyForm {
        return this.formlyForm;
    }

    set config(_config: any) {
        super.config = this.translateFormConfig(_config);
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
     * @param _config {FormlyConfig}
     * @param _fields {FormlyFieldConfig}
     * @param options {FormlyFormOptions}
     * @param actions {IFormActionsConfig}
     */
    protected constructor(@Inject(DataSource) dataSource: D,
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
                          _config?: FormlyConfig,
                          private _fields?: FormlyFieldConfig[] | [],
                          private options?: FormlyFormOptions,
                          private actions?: IToolbarActionsConfig[] | []) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        this.config = _config;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.formlyForm) {
            this.formlyForm = ComponentUtils.queryComponent(this.queryFormlyForm);
        }
    }

    /**
     * Perform submit action
     * @param event {IEvent} that contains {$event} as submit event and {$data} as model
     */
    onSubmit(event: IEvent): void {
        // TODO Waiting for implementing from children component
        // this.getLogger().debug('onSubmit', event);
    }

    /**
     * Triggered `languageChange` event
     * @param event {IEvent} that contains {$event} as LangChangeEvent
     */
    onLangChange(event: IEvent): void {
        super.onLangChange(event);

        // translate form fields
        this.translateFormFields();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Submit form
     */
    public submit(): boolean {
        this.getFormGroup().updateValueAndValidity({ onlySelf: true, emitEvent: true });
        if (this.getFormGroup().invalid) {
            this.getFormGroup().markAllAsTouched();
            return false;
        }
        return true;
    }

    /**
     * Translate form configuration
     * @param _config {FormlyConfig}
     */
    private translateFormConfig(_config?: FormlyConfig): FormlyConfig {
        if (ObjectUtils.isNotNou(_config)) {
            const _configAny: any = ObjectUtils.any(_config);
            _configAny['messages:keys'] = {};
            const messages: any = _config.messages;
            if (Object.keys(messages).length) {
                Object.keys(messages).forEach(messageKey => {
                    const message: any = messages[messageKey];
                    messages[messageKey] = this.__translateFormValidationMessage(
                        messageKey, message, _configAny['messages:keys']);
                });
            }

            const _this: AbstractFormlyComponent<any, any> = this;
            const __originalAddValidatorMessage: Function = _config.addValidatorMessage;
            _config.addValidatorMessage =
                (name: string, message: string | ((error: any, field: FormlyFieldConfig) => string)) => {
                    const translatedMessage: string | ((error: any, field: FormlyFieldConfig) => string) =
                        _this.__translateFormValidationMessage(name, message, _configAny['messages:keys']);
                    __originalAddValidatorMessage.apply(_config, [name, translatedMessage]);
                };

            const __originalAddConfig: Function = _config.addConfig;
            _config.addConfig = (config: ConfigOption) => {
                (config.validationMessages || []).forEach((validationMessage: ValidationMessageOption) => {
                    validationMessage.message = _this.__translateFormValidationMessage(
                        validationMessage.name, validationMessage.message, _configAny['messages:keys']);
                });
                __originalAddConfig.apply(_config, [config]);
            };
        }
        return _config;
    }

    /**
     * Translate form fields configuration
     */
    private translateFormFields(): void {
        if ((this.fields || []).length) {
            let translate: TranslateService;
            translate = this.getTranslateService();
            this.fields.forEach(field => this.translateFormFieldConfig(translate, field));
        }
    }

    /**
     * Translate the specified {FormlyFieldConfig}
     * @param translate {TranslateService}
     * @param field to translate
     */
    private translateFormFieldConfig(translate?: TranslateService, field?: FormlyFieldConfig) {
        if (!translate || !field) {
            return;
        }

        // create field validation message cache key
        const fieldAny: any = ObjectUtils.any(field);
        fieldAny['validation:messages:keys'] = {};

        // translate template options
        const templOpts: any = field.templateOptions;
        if (templOpts) {
            // backup original field label/placeholder/etc. key for translating
            if (!(<Object>templOpts).hasOwnProperty('original')) {
                templOpts['original'] = {
                    'label': templOpts.label,
                    'placeholder': templOpts.placeholder,
                    'description': templOpts.description,
                };
            }

            // translate field label/placeholder/etc.
            if ((templOpts['original']['label'] || '').length) {
                templOpts.label = translate.instant(templOpts['original']['label']);
            }
            if ((templOpts['original']['placeholder'] || '').length) {
                templOpts.placeholder = translate.instant(templOpts['original']['placeholder']);
            }
            if ((templOpts['original']['description'] || '').length) {
                templOpts.description = translate.instant(templOpts['original']['description']);
            }
            if (ArrayUtils.isArray(templOpts.options)) {
                templOpts.options.forEach(option => {
                    if (option && (option['label'] || '').length) {
                        if (!(<Object>option).hasOwnProperty('original_label')) {
                            option['original_label'] = option['label'];
                        }
                        option['label'] = translate.instant(option['original_label']);
                    }
                });
            }
        }

        // translate validation message key
        const validationMessages: any = (field.validation ? field.validation.messages || {} : {});
        this.__translateFormFieldValidation(field, validationMessages);

        // translate validator message key
        const validators: any = (field.validators ? field.validators || {} : {});
        if (Object.keys(validators).length) {
            if (ArrayUtils.isArray(validators['validation'])) {
                const validationInValidators: any[] = Array.from(validators['validation']);
                for (let i: number = 0; i < validationInValidators.length; i++) {
                    const validator: any = validationInValidators[i];
                    if (typeof validator === 'string' && (validator || '').length) {
                        validationInValidators[i] =
                            this.__translateFormValidationMessage(
                                ['validation', i.toString()].join(':'),
                                validator, fieldAny['validation:messages:keys']);
                    }
                }

            } else {
                Object.keys(validators).forEach(validatorKey => {
                    const validator: any = validators[validatorKey];
                    if (ObjectUtils.isObject(validator)) {
                        const validatorMessage: any = validator['message'];
                        validator['message'] =
                            this.__translateFormValidationMessage(
                                [validatorKey, 'message'].join(':'),
                                validatorMessage, fieldAny['validation:messages:keys']);
                    }
                });
            }
        }

        // translate children fields
        if (ArrayUtils.isArray(field.fieldGroup)) {
            field.fieldGroup.forEach(f => {
                this.translateFormFieldConfig(translate, f);
            });
        }
    }

    /**
     * Translate the form field validation configuration
     * @param field to cache if necessary
     * @param validationMessages form field validation configuration
     * @private
     */
    private __translateFormFieldValidation(field: FormlyFieldConfig, validationMessages: any) {
        if (Object.keys(validationMessages).length) {
            Object.keys(validationMessages).forEach(validationMessageKey => {
                const validationMessage: any = validationMessages[validationMessageKey];
                validationMessages[validationMessageKey] =
                    this.__translateFormValidationMessage(
                        validationMessageKey, validationMessage, field['validation:messages:keys']);
            });
        }
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

    /**
     * Get the field component
     * @param field to parse
     * @param componentType component type
     */
    protected getFormFieldComponent<C>(field: FormlyFieldConfig, componentType: Type<C>): C {
        return (field && field.templateOptions && field.templateOptions['componentRef']
            && field.templateOptions['componentRef'] instanceof componentType
            ? <C>field.templateOptions['componentRef'] : null);
    }
}
