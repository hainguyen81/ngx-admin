import {AbstractFormlyComponent} from './abstract.formly.component';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {Component, ComponentFactoryResolver, Inject, Renderer2} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {FormlyConfig, FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';

/**
 * Form component base on {FormlyModule}
 */
@Component({
    selector: 'ngx-formly-form',
    templateUrl: './formly.component.html',
    styleUrls: ['./formly.component.scss'],
})
export class FormlyComponent extends AbstractFormlyComponent<any, DataSource> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    getModel(): any {
        return this.model;
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
     * @param model form data model
     * @param config {FormlyConfig}
     * @param fields {FormlyFieldConfig}
     * @param options {FormlyFormOptions}
     */
    constructor(@Inject(DataSource) dataSource: DataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                private model: any,
                config: FormlyConfig,
                fields: FormlyFieldConfig,
                options: FormlyFormOptions) {
        super(dataSource, contextMenuService, logger, renderer,
            translateService, factoryResolver, config, fields, options);
    }
}
