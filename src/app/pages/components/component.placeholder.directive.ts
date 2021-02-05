import {ComponentFactoryResolver, Directive, Inject, Type, ViewContainerRef} from '@angular/core';
import {IComponentService} from '../../services/common/interface.service';
import {AbstractComponentService, BaseComponentService} from '../../services/common/component.service';
import ComponentUtils from '../../utils/common/component.utils';
import {NGXLogger} from 'ngx-logger';
import AssertUtils from '@app/utils/common/assert.utils';

@Directive({selector: '[ngxComponentPlaceholder]', exportAs: 'ngxComponentPlaceholder'})
export class ComponentPlaceholderDirective {

    /**
     * Get the {ComponentFactoryResolver} instance
     * @return the {ComponentFactoryResolver} instance
     */
    protected getFactoryResolver(): ComponentFactoryResolver {
        return this.factoryResolver;
    }

    /**
     * Get the {ViewContainerRef} instance
     * @return the {ViewContainerRef} instance
     */
    protected getViewContainerRef(): ViewContainerRef {
        return this.viewContainerRef;
    }

    /**
     * Get the {NGXLogger} instance for logging
     * @return the {NGXLogger} instance
     */
    protected getLogger(): NGXLogger {
        return this.logger;
    }

    /**
     * Create a new instance of {ComponentPlaceholderDirective} class
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param logger {NGXLogger}
     */
    constructor(@Inject(ComponentFactoryResolver) private factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
                @Inject(NGXLogger) private logger: NGXLogger) {
        AssertUtils.isValueNotNou(factoryResolver, 'Could not inject ComponentFactoryResolver');
        AssertUtils.isValueNotNou(viewContainerRef, 'Could not inject ViewContainerRef');
        AssertUtils.isValueNotNou(logger, 'Could not inject NGXLogger');
    }

    /**
     * Create the front component dynamically
     * @param componentType front component type
     * @return created component
     */
    public placeComponent(componentType: Type<any>): any {
        let compServ: IComponentService<any>;
        compServ = new BaseComponentService(this.getFactoryResolver(),
            this.getViewContainerRef(), this.getLogger(), componentType);
        return ComponentUtils.createComponent((compServ as AbstractComponentService<any>),
            this.getViewContainerRef(), true);
    }
}
