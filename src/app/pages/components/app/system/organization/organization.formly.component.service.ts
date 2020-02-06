import {AbstractComponentService} from '../../../../../services/component.service';
import {ComponentFactoryResolver, Inject, Injectable, ViewContainerRef} from '@angular/core';
import {OrganizationFormlyComponent} from './organization.formly.component';
import {NGXLogger} from 'ngx-logger';

/**
 * Organization tree-view component service support for rendering/loading component dynamically, etc.
 */
@Injectable()
export class OrganizationFormlyComponentService
    extends AbstractComponentService<OrganizationFormlyComponent> {

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
        super(componentFactoryResolver, viewContainerRef, logger, OrganizationFormlyComponent);
    }
}
