import {
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Inject,
    Injectable,
    Type,
    ViewContainerRef,
} from '@angular/core';
import {IComponentService} from './interface.service';
import {throwError} from 'rxjs';
import {NGXLogger} from 'ngx-logger';

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
    getFactoryResolver(): ComponentFactoryResolver {
        return this.componentFactoryResolver;
    }

    /**
     * Get the {ViewContainerRef} instance
     * @return the {ViewContainerRef} instance
     */
    getViewContainerRef(): ViewContainerRef {
        return this.viewContainerRef;
    }

    /**
     * Get the component type
     * @return the component type
     */
    getComponentType(): Type<T> {
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
        componentFactoryResolver || throwError('Could not inject ComponentFactoryResolver');
        viewContainerRef || throwError('Could not inject ViewContainerRef');
        logger || throwError('Could not inject NGXLogger');
        componentType || throwError('Could not inject component type');
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Resolve (create) and add component to {ViewContainerRef}
     */
    resolve(): void {
        const componentFactory: ComponentFactory<T> =
            this.getFactoryResolver().resolveComponentFactory(this.getComponentType());
        const componentRef: ComponentRef<T> = componentFactory.create(this.getViewContainerRef().injector);
        this.getViewContainerRef().insert(componentRef.hostView);
    }
}
