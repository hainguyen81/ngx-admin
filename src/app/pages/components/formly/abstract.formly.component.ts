import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent, IEvent} from '../abstract.component';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    QueryList,
    Renderer2, Type,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {FormlyConfig, FormlyFieldConfig, FormlyForm, FormlyFormOptions} from '@ngx-formly/core';
import {FormGroup} from '@angular/forms';
import {isArray} from 'util';
import ComponentUtils from '../../../utils/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {FormlyTemplateOptions} from '@ngx-formly/core/lib/components/formly.field.config';
import {IToolbarActionsConfig} from '../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';

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
     * @param config {FormlyConfig}
     * @param fields {FormlyFieldConfig}
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
        this.getLogger().debug('onSubmit', event);
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

        let templOpts: FormlyTemplateOptions;
        templOpts = field.templateOptions;
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
            if (isArray(templOpts.options)) {
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
        if (isArray(field.fieldGroup)) {
            field.fieldGroup.forEach(f => {
                this.translateFormFieldConfig(translate, f);
            });
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
