import FunctionUtils from '../utils/common/function.utils';
import ObjectUtils from '../utils/common/object.utils';

export const CONTEXT_MENU_ADD: string = 'MENU_ADD';
export const CONTEXT_MENU_EDIT: string = 'MENU_EDIT';
export const CONTEXT_MENU_DELETE: string = 'MENU_DELETE';

/**
 * Invoke the specified {IContextMenu} item
 * @param item to invoke
 * @param property item property to invoke/eval
 * @param args invocation arguments
 * @param defaultValue default value
 */
export function __evalContextMenuItem(
    item?: IContextMenu, property?: string, args?: any | null, defaultValue?: any): any {
    const propertyFunc: Function = ObjectUtils.requireTypedValue<Function>(item, property);
    const propertyValue: any = ObjectUtils.requireTypedValue<any>(item, property);
    return (FunctionUtils.isFunction(propertyFunc) ? propertyFunc.apply(this, [args]) || defaultValue
        : ObjectUtils.isNotNou(propertyValue) ? propertyValue || defaultValue : defaultValue);
}
export interface IContextMenu {
    id?: ((item?: any) => string) | string;
    icon: ((item?: any) => string) | string;
    title: ((item?: any) => string) | string;
    enabled: ((item?: any) => boolean) | boolean;
    visible: ((item?: any) => boolean) | boolean;
    divider: ((item?: any) => boolean) | boolean;
    click?: ((item?: any) => void) | null;
}

/* base context menu items */
export const BaseContextMenu: IContextMenu[] = [{
    id: CONTEXT_MENU_ADD,
    icon: 'plus-square',
    title: 'common.contextMenu.add',
    enabled: true,
    visible: true,
    divider: false,
}, {
    id: CONTEXT_MENU_EDIT,
    icon: 'edit',
    title: 'common.contextMenu.edit',
    enabled: true,
    visible: true,
    divider: false,
}, {
    id: CONTEXT_MENU_DELETE,
    icon: 'minus-square',
    title: 'common.contextMenu.delete',
    enabled: true,
    visible: true,
    divider: false,
}];
