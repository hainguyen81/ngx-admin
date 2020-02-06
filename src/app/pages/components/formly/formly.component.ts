import {AbstractFormlyComponent} from './abstract.formly.component';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {Component, ComponentFactoryResolver, Inject, Renderer2} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';

/**
 * Form component base on {FormlyModule}
 */
@Component({
    selector: 'ngx-formly-form',
    templateUrl: './formly.component.html',
    styleUrls: ['./formly.component.scss'],
})
export class NgxFormlyComponent extends AbstractFormlyComponent<any, DataSource> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private model: any;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the form data model
     * @return the form data model
     */
    getModel(): any {
        return this.model;
    }

    /**
     * Set the form data model
     * @param model to apply
     */
    protected setModel(model: any) {
        this.model = model || {};
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
     */
    constructor(@Inject(DataSource) dataSource: DataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver) {
        super(dataSource, contextMenuService, logger, renderer, translateService, factoryResolver);
    }
}
