import 'reflect-metadata';
import {Component} from '@angular/core';

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
function makeAutoUnsubscribeDecorator(obs$ = []): Function {
    return function(target: any) {
        let unsubTarget: any;
        unsubTarget = target;
        while (unsubTarget !== Object) {
            const originalNgDestroy = unsubTarget.prototype.ngOnDestroy;
            obs$ = (obs$ || []);
            const overrideNgDestroy = function () {
                this.forEach(function (property) {
                    if (typeof property.unsubscribe === 'function' && !obs$.includes(property)) {
                        obs$.push(property);
                    }
                });
                for (const ob$ of obs$) {
                    ob$.unsubscribe();
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
function makeExtendedComponentDecorator(annotation: any): Function {
    return function(target: Function) {
        let targetAnnotations: any;
        targetAnnotations = Object.assign({}, annotation);
        let parentTarget: any = target;
        let metaFnMap: any;
        metaFnMap = {};
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
                        if (!metaFnMap.hasOwnProperty(key)) {
                            metaFnMap[key] = {
                                'start': targetAnnotations[key],
                                'parents': [parentAnnotation[key]],
                            };
                        } else {
                            metaFnMap[key]['parents'].push(parentAnnotation[key]);
                        }
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

        // re-calculate metadata if they're function
        for (const key of Object.keys(metaFnMap)) {
            let result: any;
            result = null;
            Array.from(metaFnMap[key]['parents']).reverse().forEach(metaFn => {
                result = (typeof metaFn !== 'function' ? metaFn : metaFn['apply'](this, [result]));
            });
            targetAnnotations[key] = metaFnMap[key]['start']['apply'](this, result ? [result] : []);
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
