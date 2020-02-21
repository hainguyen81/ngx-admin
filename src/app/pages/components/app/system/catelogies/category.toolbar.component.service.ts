import {BaseComponentService} from '../../../../../services/component.service';
import {ComponentFactoryResolver, Inject, Injectable, ViewContainerRef} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {CategoryToolbarComponent} from './category.toolbar.component';

/**
 * Category toolbar component service support for rendering/loading component dynamically, etc.
 */
@Injectable()
export class CategoryToolbarComponentService
    extends BaseComponentService<CategoryToolbarComponent> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {CategoryToolbarComponentService} class
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param logger {NGXLogger}
     */
    constructor(@Inject(ComponentFactoryResolver) componentFactoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(componentFactoryResolver, viewContainerRef, logger, CategoryToolbarComponent);
    }
}
