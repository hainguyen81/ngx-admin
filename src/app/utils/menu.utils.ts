import {IRole} from '../@core/data/role';
import {NbMenuItem} from '@nebular/theme';
import {IModule} from '../@core/data/module';
import ObjectUtils, {NoParamConstructor} from './object.utils';
import ApiMapperUtils from './api.mapper.utils';

export default class MenuUtils {
    public static roleToMenuItem<R extends IRole, M extends NbMenuItem>(role: R, mnuCstr: NoParamConstructor<M>): M {
        if (!role || !role.module) {
            return undefined;
        }
        return MenuUtils.moduleToMenuItem(role.module, mnuCstr);
    }

    public static moduleToMenuItem<M extends IModule, N extends NbMenuItem>(
        module: M, mnuCstr: NoParamConstructor<N>, parent?: N): N {
        if (!module) {
            return undefined;
        }
        let mnu: N;
        mnu = ObjectUtils.createInstance(mnuCstr);
        mnu.title = module.name;
        mnu.icon = (module.api || {})['icon'] || '';
        mnu.link = ApiMapperUtils.findClientLink(module.api.code);
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

    public static buildMenu<M extends IModule, N extends NbMenuItem>(
        modules: M[], mnuCstr: NoParamConstructor<N>, parent?: N): N[] {
        let menuItems: N[];
        menuItems = [];
        if (modules && modules.length) {
            modules.forEach((module: IModule) => {
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
