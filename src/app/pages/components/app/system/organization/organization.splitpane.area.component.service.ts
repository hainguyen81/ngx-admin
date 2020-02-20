import {BaseComponentService} from '../../../../../services/component.service';
import {ComponentFactoryResolver, Inject, Injectable, ViewContainerRef} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {SplitAreaDirective} from 'angular-split';

/**
 * Organization split-pane area component service support for rendering/loading component dynamically, etc.
 */
@Injectable()
export class OrganizationSplitPaneAreaComponentService
    extends BaseComponentService<SplitAreaDirective> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {OrganizationSplitPaneAreaComponentService} class
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param logger {NGXLogger}
     */
    constructor(@Inject(ComponentFactoryResolver) componentFactoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(componentFactoryResolver, viewContainerRef, logger, SplitAreaDirective);
    }
}
