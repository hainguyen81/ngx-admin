import 'reflect-metadata';
import {Component} from '@angular/core';
import PromiseUtils from '../../../utils/common/promise.utils';
import ObjectUtils from '../../../utils/common/object.utils';
import FunctionUtils from '../../../utils/common/function.utils';

export const COMPONENT_ANNOTATIONS_PROPERTY: string = '__annotations__';
export const COMPONENT_PARAMETERS_PROPERTY: string = '__paramaters__';
export const COMPONENT_PROP_METADATA_PROPERTY: string = '__prop__metadata__';
export const COMPONENT_ANNOTATIONS_METADATA: string = 'annotations';
export const COMPONENT_METADATA: string = '__metadata__';

/**
 * Try to extract metadata from the specified target
 * @param target to extract
 * @param metaKey metadata property key
 * @private
 */
function __extractMetadata(target: any, metaKey: string): any {
    let metadata: any = (!target ? null : Reflect.hasMetadata(metaKey, target)
        ? Reflect.getMetadata(metaKey, target) : null);
    metadata = (metadata ? metadata : target && Reflect.hasOwnMetadata(metaKey, target)
        ? Reflect.getOwnMetadata(metaKey, target) : null);
    metadata = (metadata ? metadata : target && Reflect.has(target, metaKey)
        ? Reflect.get(target, metaKey) : null);
    metadata = (metadata ? metadata : target && target.hasOwnProperty(metaKey) ? target[metaKey] : null);
    return (Array.isArray(metadata) && Array.from(metadata).length ? metadata[0] : metadata);
}

/**
 * Try to extract metadata from the specified target
 * @param target to extract
 * @param metaKey metadata property key
 * @private
 */
function __defineMetadata(target: any, metaKey: string, metaValue: any): void {
    target && (metaKey || '').length
    && Reflect.defineMetadata(metaKey, metaValue, target);
    target && (metaKey || '').length
    && Reflect.set(target, metaKey, metaValue);
    target && (metaKey || '').length
    && Reflect.defineProperty(target, metaKey,
        { configurable: true, writable: true, value: metaValue });
}

/**
 * Decorate to un-subscribe all observable properties of component
 * @param obs$ need to ub-subscribe more
 * @constructor
 */
export function makeAutoUnsubscribeDecorator(obs$?: any[]): Function {
    return function(target: any) {
        let unsubTarget: any;
        unsubTarget = target;
        while (unsubTarget !== Object) {
            const originalNgDestroy = unsubTarget.prototype.ngOnDestroy;
            obs$ = (obs$ || []);
            const overrideNgDestroy = function () {
                const _this: any = this;
                for (const propertyKey of Object.keys(_this)) {
                    const property: any = ObjectUtils.get(_this, propertyKey);
                    const propertyAny: any = ObjectUtils.any(property);
                    const propertyUnsubFunc: Function = ObjectUtils.requireTypedValue<Function>(propertyAny, 'unsubscribe');
                    if (FunctionUtils.isFunction(propertyUnsubFunc) && !obs$.includes(propertyAny)) {
                        obs$.push(propertyAny);
                    }
                }
                for (const ob$ of obs$) {
                    PromiseUtils.unsubscribe(ob$);
                }
                originalNgDestroy.apply();
            };
            unsubTarget.prototype.ngOnDestroy = overrideNgDestroy;
            unsubTarget = Object.getPrototypeOf(unsubTarget.prototype).constructor;
        }
    };
}

/**
 * Support for extending children components
 * that no need to re-declare annotation from parent components
 * @param annotation the annotation of extended components
 * @constructor
 */
export function makeExtendedComponentDecorator(annotation: any): Function {
    return function(target: Function) {
        let targetAnnotations: any;
        targetAnnotations = Object.assign({}, annotation);
        let parentTarget: any = target;
        while (parentTarget !== Object) {
            parentTarget = parentTarget.prototype.constructor;
            let parentAnnotation: any;
            parentAnnotation = __extractMetadata(parentTarget, COMPONENT_ANNOTATIONS_METADATA);
            parentAnnotation = (parentAnnotation ? parentAnnotation
                : __extractMetadata(parentTarget, COMPONENT_ANNOTATIONS_PROPERTY));
            parentAnnotation && Object.keys(parentAnnotation).forEach(key => {
                if (parentAnnotation[key]) {
                    // verify is annotation typeof function
                    if (targetAnnotations.hasOwnProperty(key) && typeof targetAnnotations[key] === 'function') {
                        targetAnnotations[key] = targetAnnotations[key]['apply'](
                            parentTarget, [parentAnnotation[key]]);
                    }

                    // check for merge metadata
                    if ((targetAnnotations.hasOwnProperty(key) && Array.isArray(targetAnnotations[key]))
                        || (parentAnnotation.hasOwnProperty(key) && Array.isArray(parentAnnotation[key]))) {
                        let annValues: any[];
                        annValues = [];

                        // merge parent annotation values first to override by children component
                        if (parentAnnotation.hasOwnProperty(key) && Array.isArray(parentAnnotation[key])) {
                            annValues = annValues.concat(Array.from(parentAnnotation[key]));
                        } else if (parentAnnotation.hasOwnProperty(key) && parentAnnotation[key]) {
                            annValues.push(parentAnnotation[key]);
                        }

                        // override annotation values by children component
                        if (targetAnnotations.hasOwnProperty(key) && Array.isArray(targetAnnotations[key])) {
                            annValues = annValues.concat(Array.from(targetAnnotations[key]));
                        } else if (targetAnnotations.hasOwnProperty(key) && targetAnnotations[key]) {
                            annValues.push(targetAnnotations[key]);
                        }

                        // apply merged annotation values to children component
                        targetAnnotations[key] = [].concat(annValues);

                    } else if (!targetAnnotations.hasOwnProperty(key) || !targetAnnotations[key]) {
                        targetAnnotations[key] = parentAnnotation[key];
                    }
                }
            });
            parentTarget = Object.getPrototypeOf(parentTarget.prototype).constructor;
        }

        // return component decorator
        const metadata: any = new Component(targetAnnotations);
        __defineMetadata(target, COMPONENT_METADATA, targetAnnotations);
        __defineMetadata(target, COMPONENT_ANNOTATIONS_METADATA, [metadata]);
        __defineMetadata(target, COMPONENT_ANNOTATIONS_PROPERTY, [metadata]);
        return Component(targetAnnotations)(target);
    };
}

/**
 * ExtendedComponent decorator
 */
export const ExtendedComponent: (annotation: any) => Function = makeExtendedComponentDecorator;

/**
 * AutoUnsubscribe decorator
 */
export const AutoUnsubscribe: (obs$?: any[]) => Function = makeAutoUnsubscribeDecorator;
