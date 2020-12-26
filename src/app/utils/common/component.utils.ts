import {ComponentRef, QueryList, ViewContainerRef} from '@angular/core';
import {AbstractComponentService} from '../../services/common/component.service';

/**
 * Component utilities
 */
export default class ComponentUtils {
    /**
     * Query components by the specified {QueryList}
     * @param queryList to query
     * @param callback callback function to call when querying component
     * @return the components list
     */
    public static queryComponents<T>(queryList: QueryList<T>, callback?: (component: T) => void): T[] {
        let components: T[];
        components = [];
        if (queryList) {
            queryList.forEach(component => {
                components.push(component);
                callback && callback.apply(this, [component]);
            });
        }
        return components;
    }
    /**
     * Query the first occurred component by the specified {QueryList}
     * @param queryList to query
     * @param callback callback function to call when querying component
     * @return the first occurred component or undefined
     */
    public static queryComponent<T>(queryList: QueryList<T>, callback?: (component: T) => void): T {
        let component: T;
        component = undefined;
        if (queryList) {
            queryList.map(comp => {
                component = comp;
                callback && callback.apply(this, [component]);
            });
        }
        return component;
    }

    /**
     * Create component {ComponentRef}
     * @param componentService {AbstractComponentService}
     * @param viewContainerRef {ViewContainerRef}
     * @param clearView specify whether clearing view container before creating
     * @return new component
     */
    public static createComponentRef<T>(
        componentService: AbstractComponentService<T>,
        viewContainerRef?: ViewContainerRef,
        clearView?: boolean | false): ComponentRef<T> {
        componentService && viewContainerRef && componentService.setViewContainerRef(viewContainerRef);
        clearView && viewContainerRef.clear();
        return (componentService ? componentService.resolve() : undefined);
    }

    /**
     * Create component {ComponentRef}
     * @param componentService {AbstractComponentService}
     * @param viewContainerRef {ViewContainerRef}
     * @param clearView specify whether clearing view container before creating
     * @return new component
     */
    public static createComponent<T>(
        componentService: AbstractComponentService<T>,
        viewContainerRef?: ViewContainerRef,
        clearView?: boolean | false): T {
        let componentRef: ComponentRef<T>;
        componentRef = this.createComponentRef(componentService, viewContainerRef, clearView);
        return (componentRef ? componentRef.instance : undefined);
    }
}
