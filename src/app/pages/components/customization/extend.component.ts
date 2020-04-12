import {Component} from '@angular/core';

export const COMPONENT_ANNOTATIONS_PROPERTY: string = '__annotations__';

/**
 * Support for extending children components
 * that no need to re-declare annotation from parent components
 * @param annotation the annotation of extended components
 * @constructor
 */
export function ExtendedComponent(annotation: any) {
    return function(target: Function) {
        const parentTarget: any = Object.getPrototypeOf(target.prototype).constructor;
        const parentAnnotations: any = (!parentTarget ? null
            : Reflect.get(parentTarget, COMPONENT_ANNOTATIONS_PROPERTY));
        const parentAnnotation: any = (Array.isArray(parentAnnotations) && Array.from(parentAnnotations).length
            ? parentAnnotations[0] : null);
        parentAnnotation && Object.keys(parentAnnotation).forEach(key => {
            if (parentAnnotation[key]) {
                // verify is annotation typeof function
                if (annotation.hasOwnProperty(key) && typeof annotation[key] === 'function') {
                    annotation[key] = annotation[key].call(this, parentAnnotation[key]);

                } else if ((annotation.hasOwnProperty(key) && Array.isArray(annotation[key]))
                    || (parentAnnotation.hasOwnProperty(key) && Array.isArray(parentAnnotation[key]))) {
                    let annValues: any[];
                    annValues = [];
                    if (annotation.hasOwnProperty(key) && Array.isArray(annotation[key])) {
                        annValues = annValues.concat(Array.from(annotation[key]));
                    } else if (annotation.hasOwnProperty(key) && annotation[key]) {
                        annValues.push(annotation[key]);
                    }
                    if (parentAnnotation.hasOwnProperty(key) && Array.isArray(parentAnnotation[key])) {
                        annValues = annValues.concat(Array.from(parentAnnotation[key]));
                    } else if (parentAnnotation.hasOwnProperty(key) && parentAnnotation[key]) {
                        annValues.push(parentAnnotation[key]);
                    }
                    annotation[key] = [].concat(annValues);

                } else if (!annotation.hasOwnProperty(key) || !annotation[key]) {
                    annotation[key] = parentAnnotation[key];
                }
            }
        });
        Reflect.set(target, COMPONENT_ANNOTATIONS_PROPERTY, annotation);
    };
}
