import {AbstractComponentService} from '../../../../../services/component.service';
import {CategoriesTreeviewComponent} from './categories.treeview.component';
import {ComponentFactoryResolver, Inject, Injectable, ViewContainerRef} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Categories tree-view component service support for rendering/loading component dynamically, etc.
 */
@Injectable()
export class CategoriesTreeviewComponentService
    extends AbstractComponentService<CategoriesTreeviewComponent> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractComponentService} class
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param logger {NGXLogger}
     */
    constructor(@Inject(ComponentFactoryResolver) componentFactoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(componentFactoryResolver, viewContainerRef, logger, CategoriesTreeviewComponent);
    }
}
