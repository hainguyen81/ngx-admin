import {LogConfig} from './log.config';
import {
    CONTEXT_MENU_ADD,
    CONTEXT_MENU_DELETE,
    CONTEXT_MENU_EDIT,
    IContextMenu,
} from '../pages/components/abstract.component';
import {
    ACTION_DELETE,
    ACTION_RESET,
    ACTION_SAVE,
    IFormActionsConfig,
} from '../pages/components/formly/abstract.formly.component';

/* base context menu items */
export const BaseContextMenu: IContextMenu[] = [{
    id: (item?: any) => CONTEXT_MENU_ADD,
    icon: (item?: any) => 'plus-square',
    title: (item?: any) => 'common.contextMenu.add',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
}, {
    id: (item?: any) => CONTEXT_MENU_EDIT,
    icon: (item?: any) => 'edit',
    title: (item?: any) => 'common.contextMenu.edit',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
}, {
    id: (item?: any) => CONTEXT_MENU_DELETE,
    icon: (item?: any) => 'minus-square',
    title: (item?: any) => 'common.contextMenu.delete',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
}];

/* base formly actions */
export const BaseFormlyActions: IFormActionsConfig[] = [{
    id: ACTION_SAVE,
    label: 'common.form.action.save',
    type: 'submit',
    status: 'primary',
    icon: {icon: 'save', pack: 'fa'},
    size: 'medium',
    shape: 'rectangle',
}, {
    id: ACTION_DELETE,
    label: 'common.form.action.delete',
    type: 'button',
    status: 'danger',
    icon: {icon: 'trash-alt', pack: 'fa'},
    size: 'medium',
    shape: 'rectangle',
}, {
    id: ACTION_RESET,
    label: 'common.form.action.reset',
    type: 'reset',
    status: 'warning',
    icon: {icon: 'redo', pack: 'fa'},
    size: 'medium',
    shape: 'rectangle',
}];

export const COMMON = {
    theme: 'dark',
    logConfig: LogConfig,
    sw: {
        vapid_public_key: '',
        base_url: 'http://localhost:8089/api-rest-notification/service',
    },
    itemsPerPage: 10,
    baseMenu: BaseContextMenu,
    baseFormActions: BaseFormlyActions,
};
