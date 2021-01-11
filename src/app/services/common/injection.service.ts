import {
    ApplicationRef,
    ChangeDetectorRef,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    Injectable,
    Injector, Type,
} from '@angular/core';
import ObjectUtils from '../../utils/common/object.utils';

/**
 * Injection service is a helper to append components
 * dynamically to a known location in the DOM, most
 * noteably for dialogs/tooltips appending to body.
 *
 * @export
 * @class InjectionService
 */
@Injectable()
export class InjectionService {
    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _container: ComponentRef<any>;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {ComponentRef} instance
     * @return the {ComponentRef} instance
     */
    protected get container(): ComponentRef<any> {
        return this._container;
    }

    /**
     * Get the {ApplicationRef} instance
     * @return the {ApplicationRef} instance
     */
    protected get applicationRef(): ApplicationRef {
        return this._applicationRef;
    }

    /**
     * Get the {ComponentFactoryResolver} instance
     * @return the {ComponentFactoryResolver} instance
     */
    protected get componentFactoryResolver(): ComponentFactoryResolver {
        return this._componentFactoryResolver;
    }

    /**
     * Get the {Injector} instance
     * @return the {Injector} instance
     */
    protected get injector(): Injector {
        return this._injector;
    }

    /**
     * Gets the root view container to inject the component to.
     * @returns {ComponentRef<any>}
     * @memberOf InjectionService
     */
    get rootViewContainer(): ComponentRef<any> {
        if (this.container) return this.container;
        const rootComponents = ObjectUtils.as<any>(this.applicationRef)['_rootComponents'];
        if (rootComponents.length) return rootComponents[0];
        throw new Error('View Container not found! ngUpgrade needs to manually set this via setRootViewContainer.');
    }

    /**
     * Overrides the default root view container. This is useful for
     * things like ngUpgrade that doesn't have a ApplicationRef root.
     * @param {any} _container
     * @memberOf InjectionService
     */
    set rootViewContainer(_container: ComponentRef<any>) {
        this._container = _container;
    }

    /**
     * Gets the root component container html element.
     * @returns {HTMLElement}
     * @memberOf InjectionService
     */
    get rootViewContainerNode(): HTMLElement {
        return this.getComponentRootNode(this.rootViewContainer);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    constructor(
        private _applicationRef: ApplicationRef,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _injector: Injector) {
    }

    /**
     * Gets the html element for a component ref.
     * @param {ComponentRef<any>} componentRef
     * @returns {HTMLElement}
     * @memberOf InjectionService
     */
    public getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }

    /**
     * Projects the inputs onto the component
     * @param {ComponentRef<any>} component
     * @param {*} options
     * @returns {ComponentRef<any>}
     * @memberOf InjectionService
     */
    protected projectComponentInputs(component: ComponentRef<any>, options: any): ComponentRef<any> {
        if (options) {
            const props = Object.getOwnPropertyNames(options);
            for (const prop of props) {
                component.instance[prop] = options[prop];
            }
        }
        return component;
    }

    /**
     * Appends a component to a adjacent location
     * @template T
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param {Type<T>} componentClass
     * @param {*} [options={}]
     * @param {Element} [location=this.getRootViewContainerNode()]
     * @returns {ComponentRef<any>}
     *
     * @memberOf InjectionService
     */
    public appendComponentByFactory<T>(componentFactoryResolver: ComponentFactoryResolver,
                                       componentClass: Type<T>,
                                       options: any = {},
                                       location: Element = this.rootViewContainerNode): ComponentRef<any> {
        const factoryResolver: ComponentFactoryResolver = (ObjectUtils.isNou(componentFactoryResolver)
            ? this.componentFactoryResolver : componentFactoryResolver);
        const componentFactory: ComponentFactory<any> =
            factoryResolver.resolveComponentFactory(componentClass);
        const componentRef: ComponentRef<any> = componentFactory.create(this.injector);
        const appRef: ApplicationRef = this.applicationRef;
        const componentRootNode: HTMLElement = this.getComponentRootNode(componentRef);

        // project the options passed to the component instance
        this.projectComponentInputs(componentRef, options);

        // ApplicationRef's attachView and detachView methods are in Angular ^2.2.1 but not before.
        // The `else` clause here can be removed once 2.2.1 is released.
        if (appRef['attachView']) {
            appRef.attachView(componentRef.hostView);
            componentRef.onDestroy(() => {
                appRef.detachView(componentRef.hostView);
            });

        } else {
            // When creating a component outside of a ViewContainer, we need to manually register
            // its ChangeDetector with the application. This API is unfortunately not published
            // in Angular <= 2.2.0. The change detector must also be deregistered when the component
            // is destroyed to prevent memory leaks.
            const changeDetectorRef: ChangeDetectorRef = componentRef.changeDetectorRef;
            const appRefAny: any = ObjectUtils.as<any>(appRef);
            if (typeof appRefAny['registerChangeDetector'] === 'function'
                && typeof appRefAny['unregisterChangeDetector'] === 'function') {
                appRefAny['registerChangeDetector']['apply'](appRef, [changeDetectorRef]);
                componentRef.onDestroy(() => {
                    appRefAny['unregisterChangeDetector']['apply'](appRef, [changeDetectorRef]);

                    // Normally the ViewContainer will remove the component's nodes from the DOM.
                    // Without a ViewContainer, we need to manually remove the nodes.
                    if (componentRootNode.parentNode) {
                        componentRootNode.parentNode.removeChild(componentRootNode);
                    }
                });
            }
        }
        location.appendChild(componentRootNode);
        return componentRef;
    }

    /**
     * Appends a component to a adjacent location
     * @template T
     * @param {Type<T>} componentClass
     * @param {*} [options={}]
     * @param {Element} [location=this.getRootViewContainerNode()]
     * @returns {ComponentRef<any>}
     *
     * @memberOf InjectionService
     */
    public appendComponent<T>(componentClass: Type<T>,
                              options: any = {},
                              location: Element = this.rootViewContainerNode): ComponentRef<any> {
        return this.appendComponentByFactory(null, componentClass, options, location);
    }
}
