import {ComponentRef, QueryList, ViewContainerRef} from '@angular/core';
import {AbstractComponentService} from '../../services/common/component.service';
import ObjectUtils from './object.utils';

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
    public static queryComponents<T>(queryList: QueryList<T>, callback?: (component: T) => void): T[] | null | undefined {
        const components: T[] = [];
        if (queryList) {
            queryList.filter(component => ObjectUtils.isNotNou(component))
            .forEach(component => {
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
    public static queryComponent<T>(queryList: QueryList<T>, callback?: (component: T) => void): T | null | undefined {
        let component: T;
        if (queryList) {
            queryList.filter(comp => ObjectUtils.isNotNou(comp))
            .map(comp => {
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
        clearView?: boolean | false): ComponentRef<T> | null | undefined {
        componentService && viewContainerRef && componentService.setViewContainerRef(viewContainerRef);
        return (componentService ? componentService.resolve(clearView) : undefined);
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
        clearView?: boolean | false): T | null | undefined {
        const componentRef: ComponentRef<T> = this.createComponentRef(componentService, viewContainerRef, clearView);
        return (componentRef ? componentRef.instance : undefined);
    }
}
