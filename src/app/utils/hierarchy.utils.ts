import ObjectUtils from './object.utils';
import {Type} from '@angular/core';
import {throwError} from 'rxjs';
import {isArray} from 'util';

export default class HierarchyUtils {

    /**
     * Convert the specified entity instance to the specified built item type
     * @param entity to convert
     * @param builtType the destination built type
     * @param parent the parent item or undefined if root
     * @param parentBuiltPropertyName the property/attribute name to assign parent for new built item if necessary
     * @param childrenBuiltPropertyName the property/attribute name to assign children for new built item if necessary
     * @param entityMapper the mapper function to mapping entity to new item of the specified built type
     * @return the hierarchy item instance or undefined
     */
    private static buildHierarchyItem<M, N>(entity: M, builtType?: Type<N>, parent?: N,
                                            parentBuiltPropertyName?: string, childrenBuiltPropertyName?: string,
                                            entityMapper?: (entity: M, item: N) => N): N {
        if (!entity) {
            return undefined;
        }

        let item: N;
        try {
            item = (builtType ? ObjectUtils.createInstance(builtType) : undefined);
        } catch (e) {
            item = undefined;
        }

        if (entityMapper) {
            item = entityMapper.apply(this, [ entity, item ]);
        }

        if (!item) {
            if (builtType) {
                throwError('Could not create new item by the specified built type {' + builtType.name + '}');
            } else {
                throwError('Could not create new item by the specified built type or via `entityMapper` method');
            }
        }

        if ((parentBuiltPropertyName || '').length && (childrenBuiltPropertyName || '').length) {
            item[childrenBuiltPropertyName] = [];
            if (parent) {
                item[parentBuiltPropertyName] = parent;
                if (!parent[childrenBuiltPropertyName] || !isArray(parent[childrenBuiltPropertyName])) {
                    parent[childrenBuiltPropertyName] = [];
                }
                Array.from(parent[childrenBuiltPropertyName]).push(item);
            }
        }
        return item;
    }

    /**
     * Build the hierarchy tree by the specified entity instances type
     * @param entities to build
     * @param builtType the destination built type
     * @param parent the parent item or undefined if root
     * @param childrenEntityPropertyName the property/attribute name of every specified entity
     * to detect children for building hierarchy items
     * @param parentBuiltPropertyName the property/attribute name to assign parent for new built item if necessary
     * @param childrenBuiltPropertyName the property/attribute name to assign children for new built item if necessary
     * @param entityMapper the mapper function to mapping entity to new item of the specified built type
     * @return the hierarchy instances array or undefined
     */
    public static buildHierarchyTree<M, N>(
        entities: M[], builtType?: Type<N>, parent?: N,
        childrenEntityPropertyName?: string,
        parentBuiltPropertyName?: string, childrenBuiltPropertyName?: string,
        entityMapper?: (entity: M, item: N) => N): N[] {
        (builtType || entityMapper) || throwError('Could not build hierarchy that not specify the built type or `entityMapper` method!');

        let items: N[];
        items = [];
        if (entities && entities.length) {
            entities.forEach((entity: M) => {
                let builtItem: N;
                builtItem = HierarchyUtils.buildHierarchyItem(
                    entity, builtType, null, parentBuiltPropertyName, childrenBuiltPropertyName, entityMapper);
                items.push(builtItem);
                if ((childrenEntityPropertyName || '').length && isArray(entity[childrenEntityPropertyName])
                    && Array.from(entity[childrenEntityPropertyName]).length) {
                    this.buildHierarchyTree(
                        Array.from(entity[childrenEntityPropertyName]),
                        builtType, builtItem, childrenEntityPropertyName,
                        parentBuiltPropertyName, childrenBuiltPropertyName,
                        entityMapper);
                }
            });
        }
        return items;
    }
}
