import {ComponentFactory, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Type, ViewContainerRef} from '@angular/core';
import {IComponentService} from './interface.service';
import {NGXLogger} from 'ngx-logger';
import {InjectionConfig} from '../../config/injection.config';
import ObjectUtils from '@app/utils/common/object.utils';
import AssertUtils from '@app/utils/common/assert.utils';

/**
 * Abstract component service support for rendering/loading component dynamically, etc.
 * @param <T> component type
 */
@Injectable()
export abstract class AbstractComponentService<T> implements IComponentService<T> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {ComponentFactoryResolver} instance
     * @return the {ComponentFactoryResolver} instance
     */
    public getFactoryResolver(): ComponentFactoryResolver {
        return this.componentFactoryResolver;
    }

    /**
     * Get the {ViewContainerRef} instance
     * @return the {ViewContainerRef} instance
     */
    public getViewContainerRef(): ViewContainerRef {
        return this.viewContainerRef;
    }

    /**
     * Get the {NGXLogger} instance
     * @return the {NGXLogger} instance
     */
    protected getLogger(): NGXLogger {
        return this.logger;
    }

    /**
     * Set the {ViewContainerRef} instance
     * @param viewContainerRef to apply
     */
    public setViewContainerRef(viewContainerRef: ViewContainerRef): void {
        AssertUtils.isValueNotNou(viewContainerRef, 'Could not inject ViewContainerRef');
        this.viewContainerRef = viewContainerRef;
    }

    /**
     * Get the component type
     * @return the component type
     */
    public getComponentType(): Type<T> {
        return this.componentType;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractComponentService} class
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param logger {NGXLogger}
     * @param componentType component type
     */
    protected constructor(@Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
                          @Inject(NGXLogger) private logger: NGXLogger,
                          private componentType: Type<T>) {
        AssertUtils.isValueNotNou(componentFactoryResolver, 'Could not inject ComponentFactoryResolver');
        AssertUtils.isValueNotNou(viewContainerRef, 'Could not inject ViewContainerRef');
        AssertUtils.isValueNotNou(logger, 'Could not inject NGXLogger');
        AssertUtils.isValueNotNou(componentType, 'Could not inject component type');
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Resolve (create) and add component to {ViewContainerRef}
     */
    public resolve(clearView?: boolean | false): ComponentRef<T> {
        const viewContainerRef = this.getViewContainerRef();
        if (ObjectUtils.isNou(viewContainerRef)) {
            return undefined;
        }

        const componentFactory: ComponentFactory<T> =
            this.getFactoryResolver().resolveComponentFactory(this.getComponentType());
        const componentRef: ComponentRef<T> = componentFactory.create(InjectionConfig.Injector);
        clearView && viewContainerRef.clear();
        componentRef.hostView.detectChanges();
        viewContainerRef.insert(componentRef.hostView);
        return componentRef;
    }
}

/**
 * Abstract component service support for rendering/loading component dynamically, etc.
 * @param <T> component type
 */
@Injectable()
export class BaseComponentService<T> extends AbstractComponentService<T> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractComponentService} class
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param logger {NGXLogger}
     * @param componentType component type
     */
    constructor(@Inject(ComponentFactoryResolver) componentFactoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(NGXLogger) logger: NGXLogger,
                componentType: Type<T>) {
        super(componentFactoryResolver, viewContainerRef, logger, componentType);
    }
}
