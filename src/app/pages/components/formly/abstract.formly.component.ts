import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent} from '../abstract.component';
import {AfterViewInit, ComponentFactoryResolver, Inject, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {FormlyConfig, FormlyFieldConfig, FormlyForm, FormlyFormOptions} from '@ngx-formly/core';
import {FormGroup} from '@angular/forms';

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
    private readonly formGroup: FormGroup = new FormGroup({});

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
        // apply translate
        if (fields && fields.length) {
            let translate: TranslateService;
            translate = this.getTranslateService();
            fields.forEach(field => {
                if (field.templateOptions) {
                    field.templateOptions.label = translate.instant(field.templateOptions.label);
                    field.templateOptions.placeholder = translate.instant(field.templateOptions.placeholder);
                }
            });
        }
        this.fields = fields;
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
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param config {FormlyConfig}
     * @param fields {FormlyFieldConfig}
     * @param options {FormlyFormOptions}
     */
    protected constructor(@Inject(DataSource) dataSource: D,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          private config?: FormlyConfig,
                          private fields?: FormlyFieldConfig[] | [],
                          private options?: FormlyFormOptions) {
        super(dataSource, contextMenuService, logger, renderer, translateService, factoryResolver);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.queryFormlyForm.map((item) => this.formlyForm = item);
    }

    /**
     * Perform submit action
     * @param event submit event
     */
    onSubmit(event): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSubmit');
    }
}
