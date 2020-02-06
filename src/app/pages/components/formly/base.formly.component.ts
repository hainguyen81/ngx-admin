import {Component, ComponentFactoryResolver, Inject, Renderer2} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {NgxFormlyComponent} from './formly.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {FormlyConfig, FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';

/**
 * Base form component base on {FormlyModule}
 */
@Component({
    selector: 'ngx-formly-form',
    templateUrl: './formly.component.html',
    styleUrls: ['./formly.component.scss'],
})
export abstract class BaseFormlyComponent<T, D extends DataSource> extends NgxFormlyComponent {

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
    protected constructor(@Inject(DataSource) dataSource: D,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          model: T,
                          config: FormlyConfig,
                          fields: FormlyFieldConfig,
                          options: FormlyFormOptions) {
        super(dataSource, contextMenuService, logger, renderer,
            translateService, factoryResolver, model, config, fields, options);
    }
}
