import {AbstractComponentService} from '../../../../../services/component.service';
import {ComponentFactoryResolver, Inject, Injectable, ViewContainerRef} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {OrganizationToolbarComponent} from './organization.toolbar.component';

/**
 * Organization toolbar component service support for rendering/loading component dynamically, etc.
 */
@Injectable()
export class OrganizationToolbarComponentService
    extends AbstractComponentService<OrganizationToolbarComponent> {

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
        super(componentFactoryResolver, viewContainerRef, logger, OrganizationToolbarComponent);
    }
}
