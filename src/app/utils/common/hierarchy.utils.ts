import ObjectUtils from './object.utils';
import {Type} from '@angular/core';
import {TreeviewItem} from 'ngx-treeview';
import {IModel} from '../../@core/data/base';
import ArrayUtils from './array.utils';
import AssertUtils from '@app/utils/common/assert.utils';

export default class HierarchyUtils {

    /**
     * Convert the specified entity instance to the specified built item type
     * @param entity to convert
     * @param builtType the destination built type
     * @param parentBuilt the parent item or undefined if root
     * @param childrenBuiltPropertyName the property/attribute name to assign children for new built item if necessary
     * @param entityMapper the mapper function to mapping entity to new item of the specified built type
     * @return the hierarchy item instance or undefined
     */
    private static buildFlatHierarchyItem<M, N>(entity: M, builtType?: Type<N>,
                                            parentBuilt?: N, childrenBuiltPropertyName?: string,
                                            entityMapper?: (entity: M, item: N) => N): N {
        if (!entity) return undefined;

        let item: N;
        try {
            item = (builtType ? ObjectUtils.createInstance(builtType) : undefined);
        } catch (e) {
            item = undefined;
        }

        if (entityMapper) {
            item = entityMapper.apply(this, [ entity, item ]);
        }

        AssertUtils.isValueNotNou(item,
            (builtType ? 'Could not create new item by the specified built type {' + builtType.name + '}'
                : 'Could not create new item by the specified built type or via `entityMapper` method'));

        if (parentBuilt && (childrenBuiltPropertyName || '').length) {
            // check for building children via temporary variable
            // because some type require children property must be not empty such as TreeviewItem type
            let childrenOfParent: N[];
            childrenOfParent = (!ObjectUtils.any(parentBuilt)[childrenBuiltPropertyName]
                || !ArrayUtils.isArray(ObjectUtils.any(parentBuilt)[childrenBuiltPropertyName])
                ? [] : Array.from(ObjectUtils.any(parentBuilt)[childrenBuiltPropertyName]));
            childrenOfParent.push(item);
            if (childrenOfParent && childrenOfParent.length) {
                ObjectUtils.any(parentBuilt)[childrenBuiltPropertyName] = childrenOfParent;
            }
        }
        return item;
    }

    /**
     * Build the hierarchy tree by the specified entity instances type
     * @param entities to build
     * @param entityIdPropertyName the entity identity to detect hierarchy (required)
     * @param entityParentIdPropertyName the entity parent identity to detect hierarchy (required)
     * @param parent the entity parent if searching its entity children
     * @param builtType the destination built type
     * @param parentBuilt the parent item or undefined if root
     * @param childrenBuiltPropertyName the property/attribute name to assign children for new built item if necessary
     * @param entityMapper the mapper function to mapping entity to new item of the specified built type
     * @return the hierarchy instances array or undefined
     */
    public static buildFlatToHierarchyTree<M, N>(
        entities: M[], entityIdPropertyName: string, entityParentIdPropertyName: string, parent?: M,
        builtType?: Type<N>, parentBuilt?: N, childrenBuiltPropertyName?: string,
        entityMapper?: (entity: M, item: N) => N): N[] {
        AssertUtils.isTrueValue(
            ((entityIdPropertyName || '').length > 0 && (entityParentIdPropertyName || '').length > 0),
            'Could not build hierarchy that not specify property names to detect child/parent!');
        AssertUtils.isValueNotNou((builtType || entityMapper),
            'Could not build hierarchy that not specify the built type or `entityMapper` method!');

        let parentId: any;
        parentId = (parent ? ObjectUtils.any(parent)[entityIdPropertyName] : undefined);
        let items: N[];
        items = [];
        parentBuilt && items.push(parentBuilt);
        (entities || []).forEach((entity: M) => {
            let builtItem: N;
            if ((ObjectUtils.any(entity)[entityParentIdPropertyName] || '') === (parentId || '')
                && (ObjectUtils.any(entity)[entityIdPropertyName] || '') !== (parentId || '')) {
                builtItem = HierarchyUtils.buildFlatHierarchyItem(
                    entity, builtType, parentBuilt, childrenBuiltPropertyName, entityMapper);
                !parentBuilt && items.push(builtItem);
                this.buildFlatToHierarchyTree(
                    entities, entityIdPropertyName, entityParentIdPropertyName, entity,
                    builtType, builtItem, childrenBuiltPropertyName, entityMapper);
            }
        });
        return items;
    }

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
        if (!entity) return undefined;

        let item: N;
        try {
            item = (builtType ? ObjectUtils.createInstance(builtType) : undefined);
        } catch (e) {
            item = undefined;
        }

        if (entityMapper) {
            item = entityMapper.apply(this, [ entity, item ]);
        }

        AssertUtils.isValueNotNou(item,
            (builtType ? 'Could not create new item by the specified built type {' + builtType.name + '}'
                : 'Could not create new item by the specified built type or via `entityMapper` method'));

        if (parent) {
            if ((parentBuiltPropertyName || '').length) {
                ObjectUtils.any(item)[parentBuiltPropertyName] = parent;
            }

            if ((childrenBuiltPropertyName || '').length) {
                // check for building children via temporary variable
                // because some type require children property must be not empty such as TreeviewItem type
                let childrenOfParent: N[];
                childrenOfParent = (!ObjectUtils.any(parent)[childrenBuiltPropertyName]
                    || !ArrayUtils.isArray(ObjectUtils.any(parent)[childrenBuiltPropertyName])
                    ? [] : Array.from(ObjectUtils.any(parent)[childrenBuiltPropertyName]));
                childrenOfParent.push(item);
                if (childrenOfParent && childrenOfParent.length) {
                    ObjectUtils.any(parent)[childrenBuiltPropertyName] = childrenOfParent;
                }
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
        AssertUtils.isValueNotNou((builtType || entityMapper),
            'Could not build hierarchy that not specify the built type or `entityMapper` method!');

        let items: N[];
        items = [];
        if (entities && entities.length) {
            entities.forEach((entity: M) => {
                let builtItem: N;
                builtItem = HierarchyUtils.buildHierarchyItem(
                    entity, builtType, parent,
                    parentBuiltPropertyName, childrenBuiltPropertyName, entityMapper);
                items.push(builtItem);
                if ((childrenEntityPropertyName || '').length
                    && ArrayUtils.isArray(ObjectUtils.any(entity)[childrenEntityPropertyName])
                    && Array.from(ObjectUtils.any(entity)[childrenEntityPropertyName]).length) {
                    this.buildHierarchyTree(
                        Array.from(ObjectUtils.any(entity)[childrenEntityPropertyName]),
                        builtType, builtItem,
                        childrenEntityPropertyName,
                        parentBuiltPropertyName, childrenBuiltPropertyName, entityMapper);
                }
            });
        }
        return items;
    }

    /**
     * Build the tree items by the specified model instances type
     * @param models to build
     * @param modelTextProperty the property name of model to show as {TreeviewItem} text
     * @param parent the parent treeview item or undefined if root
     * @return the tree item instances array or undefined
     */
    public static buildModelTreeview<M extends IModel>(
        models: M[], modelTextProperty: string, parent?: TreeviewItem): TreeviewItem[] {
        let modelToTreeItemMapper: (model: M, item: TreeviewItem) => TreeviewItem;
        modelToTreeItemMapper = (model: M, item: TreeviewItem) => {
            if (!item) {
                item = new TreeviewItem({
                    checked: false,
                    collapsed: true,
                    disabled: false,
                    text: ObjectUtils.any(model)[modelTextProperty] || '-',
                    value: model,
                });

            } else if (model) {
                item.text = ObjectUtils.any(model)[modelTextProperty] || '';
                item.value = model;
            }
            return item;
        };
        let items: TreeviewItem[];
        items = HierarchyUtils.buildFlatToHierarchyTree(
            models, 'id', 'parentId', undefined,
            undefined, undefined, 'children', modelToTreeItemMapper);
        (items || []).sort((it1, it2) => {
            return (it1.text < it2.text ? -1 : it1.text === it2.text ? 0 : 1);
        });
        return items;
    }
}
