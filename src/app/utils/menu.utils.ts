import {Role} from '../@core/data/role';
import {NbMenuItem} from '@nebular/theme';
import {Module} from '../@core/data/module';
import ObjectUtils, {NoParamConstructor} from './object.utils';

export default class MenuUtils {
    public static roleToMenuItem<R extends Role, M extends NbMenuItem>(role: R, mnuCstr: NoParamConstructor<M>): M {
        if (!role || !role.module) {
            return undefined;
        }
        return MenuUtils.moduleToMenuItem(role.module, mnuCstr);
    }

    public static moduleToMenuItem<M extends Module, N extends NbMenuItem>(
        module: M, mnuCstr: NoParamConstructor<N>, parent?: N): N {
        if (!module) {
            return undefined;
        }
        let mnu: N;
        mnu = ObjectUtils.createInstance(mnuCstr);
        mnu.title = module.name;
        mnu.data = module;
        mnu.expanded = false;
        mnu.selected = false;
        mnu.children = [];
        if (parent) {
            mnu.parent = parent;
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(mnu);
        }
        return mnu;
    }

    public static buildMenu<M extends Module, N extends NbMenuItem>(
        modules: M[], mnuCstr: NoParamConstructor<N>, parent?: N): N[] {
        let menuItems: N[];
        menuItems = [];
        if (modules && modules.length) {
            modules.forEach((module: Module) => {
                let mnu: N;
                mnu = MenuUtils.moduleToMenuItem(module, mnuCstr, parent);
                menuItems.push(mnu);
                if (module.children && module.children.length) {
                    this.buildMenu(module.children, mnuCstr, mnu);
                }
            });
        }
        return menuItems;
    }
}
