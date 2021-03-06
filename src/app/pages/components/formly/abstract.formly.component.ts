import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent, IEvent} from '../abstract.component';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    QueryList,
    Renderer2,
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
import {IToolbarActionsConfig} from '../toolbar/abstract.toolbar.component';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {DeepCloner} from '../../../utils/object.utils';
import {Lightbox} from 'ngx-lightbox';

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
    private renderForm?: boolean | true;
    protected translatedFields: FormlyFieldConfig[];

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
     * Get the form configuration
     * @return the form configuration
     */
    public getConfig(): FormlyConfig {
        return this.config;
    }

    /**
     * Set the form configuration
     * @param config to apply
     */
    protected setConfig(config: FormlyConfig) {
        this.config = config;
    }

    /**
     * Get the form fields configuration
     * @return the form fields configuration
     */
    public getFields(): FormlyFieldConfig[] {
        return this.fields;
    }

    /**
     * Set the form fields configuration
     * @param fields to apply
     */
    protected setFields(fields: FormlyFieldConfig[]) {
        this.fields = fields;
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
                          private config?: FormlyConfig,
                          private fields?: FormlyFieldConfig[] | [],
                          private options?: FormlyFormOptions,
                          private actions?: IToolbarActionsConfig[] | []) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
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
     * Translate form fields configuration
     */
    private translateFormFields(): void {
        this.translatedFields = DeepCloner(this.fields);
        if (this.translatedFields && this.translatedFields.length) {
            let translate: TranslateService;
            translate = this.getTranslateService();
            this.translatedFields.forEach(field => this.translateFormFieldConfig(translate, field));
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

        if (field.templateOptions) {
            if ((field.templateOptions.label || '').length) {
                field.templateOptions.label = translate.instant(field.templateOptions.label);
            }
            if ((field.templateOptions.placeholder || '').length) {
                field.templateOptions.placeholder = translate.instant(field.templateOptions.placeholder);
            }
            if ((field.templateOptions.description || '').length) {
                field.templateOptions.description = translate.instant(field.templateOptions.description);
            }
            if (isArray(field.templateOptions.options)) {
                field.templateOptions.options.forEach(option => {
                    if (option && (option['label'] || '').length) {
                        option['label'] = translate.instant(option['label']);
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
}
