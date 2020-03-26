import {NbMenuItem} from '@nebular/theme';
import {IModule} from '../../@core/data/system/module';
import ApiMapperUtils from './api.mapper.utils';
import {Type} from '@angular/core';
import HierarchyUtils from '../hierarchy.utils';

/**
 * Menu utilities
 */
export default class MenuUtils {

    /**
     * Build the menu tree by the specified Module instances type
     * @param modules to build
     * @param mnuType the destination menu type
     * @param parent the parent menu item or undefined if root
     * @return the menu instances array or undefined
     */
    public static buildMenu<M extends IModule, N extends NbMenuItem>(
        modules: M[], mnuType: Type<N>, parent?: N): N[] {
        let menuMapper: (entity: M, item: N) => N;
        menuMapper = (module: M, item: N) => {
            if (module && item) {
                item.title = module.name;
                item.icon = (module.api || {})['icon'] || module.icon || '';
                item.link = ApiMapperUtils.findClientLink((module.api || {})['code']);
                item.data = module;
                item.expanded = false;
                item.selected = false;
            }
            return item;
        };
        return HierarchyUtils.buildHierarchyTree(
            modules, mnuType, parent, 'children',
            'parent', 'children', menuMapper);
    }
}
