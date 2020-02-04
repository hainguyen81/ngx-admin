import {IRole} from '../@core/data/role';
import {NbMenuItem} from '@nebular/theme';
import {IModule} from '../@core/data/module';
import ObjectUtils, {NoParamConstructor} from './object.utils';
import ApiMapperUtils from './api.mapper.utils';

/**
 * Menu utilities
 */
export default class MenuUtils {
    /**
     * Convert the specified Role instance to the specified menu item type
     * @param role to convert
     * @param mnuType the destination menu type
     * @return the menu instance or undefined
     */
    public static roleToMenuItem<R extends IRole, M extends NbMenuItem>(role: R, mnuType: NoParamConstructor<M>): M {
        if (!role || !role.module) {
            return undefined;
        }
        return MenuUtils.moduleToMenuItem(role.module, mnuType, null);
    }

    /**
     * Convert the specified Module instance to the specified menu item type
     * @param module to convert
     * @param mnuType the destination menu type
     * @param parent the parent menu item or undefined if root
     * @return the menu instance or undefined
     */
    public static moduleToMenuItem<M extends IModule, N extends NbMenuItem>(
        module: M, mnuType: NoParamConstructor<N>, parent?: N): N {
        if (!module) {
            return undefined;
        }
        let mnu: N;
        mnu = ObjectUtils.createInstance(mnuType);
        mnu.title = module.name;
        mnu.icon = (module.api || {})['icon'] || module.icon || '';
        mnu.link = ApiMapperUtils.findClientLink((module.api || {})['code']);
        mnu.data = module;
        mnu.expanded = false;
        mnu.selected = false;
        mnu.children = (module.children && module.children.length ? [] : null);
        if (parent) {
            mnu.parent = parent;
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(mnu);
        }
        return mnu;
    }

    /**
     * Build the menu tree by the specified Module instances type
     * @param modules to build
     * @param mnuType the destination menu type
     * @param parent the parent menu item or undefined if root
     * @return the menu instances array or undefined
     */
    public static buildMenu<M extends IModule, N extends NbMenuItem>(
        modules: M[], mnuType: NoParamConstructor<N>, parent?: N): N[] {
        let menuItems: N[];
        menuItems = [];
        if (modules && modules.length) {
            modules.forEach((module: IModule) => {
                let mnu: N;
                mnu = MenuUtils.moduleToMenuItem(module, mnuType, parent);
                menuItems.push(mnu);
                if (module.children && module.children.length) {
                    this.buildMenu(module.children, mnuType, mnu);
                }
            });
        }
        return menuItems;
    }
}
