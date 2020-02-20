import {BaseComponentService} from '../../../../../services/component.service';
import {OrganizationTreeviewComponent} from './organization.treeview.component';
import {ComponentFactoryResolver, Inject, Injectable, ViewContainerRef} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Organization tree-view component service support for rendering/loading component dynamically, etc.
 */
@Injectable()
export class OrganizationTreeviewComponentService
    extends BaseComponentService<OrganizationTreeviewComponent> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {OrganizationTreeviewComponentService} class
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param logger {NGXLogger}
     */
    constructor(@Inject(ComponentFactoryResolver) componentFactoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(componentFactoryResolver, viewContainerRef, logger, OrganizationTreeviewComponent);
    }
}
