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
    IToolbarActionsConfig,
} from '../pages/components/toolbar/abstract.toolbar.component';
import {RC_DEFAULT_HEADERS} from './request.config';
import {environment} from '../../environments/environment';

export function BaseHrefProvider(): string {
    let baseElement: HTMLCollectionBase;
    baseElement = <HTMLCollectionBase>document.getElementsByTagName('base');
    let href: string;
    href = (baseElement && baseElement.item(0)
    && baseElement.item(0).hasAttribute('href')
        ? baseElement.item(0).getAttribute('href') : environment.baseHref);
    return (href || '').trimLast('/');
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

/* base toolbar actions */
export const BaseToolbarActions: IToolbarActionsConfig[] = [{
    id: ACTION_SAVE,
    label: 'common.form.action.save',
    type: 'button',
    status: 'primary',
    icon: {icon: 'save', pack: 'fa'},
    size: 'small',
    shape: 'rectangle',
}, {
    id: ACTION_DELETE,
    label: 'common.form.action.delete',
    type: 'button',
    status: 'danger',
    icon: {icon: 'trash-alt', pack: 'fa'},
    size: 'small',
    shape: 'rectangle',
}, {
    id: ACTION_RESET,
    label: 'common.form.action.reset',
    type: 'button',
    status: 'warning',
    icon: {icon: 'redo', pack: 'fa'},
    size: 'small',
    shape: 'rectangle',
}];

export const IMAGE_FILE_EXTENSIONS: string[] = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];

export const COMMON = {
    theme: 'default',
    logConfig: LogConfig,
    sw: {
        vapid_public_key: '',
        base_url: 'http://localhost:8089/api-rest-notification/service',
    },
    /* default HTTP request */
    request: {
        headers: RC_DEFAULT_HEADERS,
        // number (in milliseconds) | date
        timeout: 300000,
    },
    itemsPerPage: 15,
    baseMenu: BaseContextMenu,
    baseToolbarActions: BaseToolbarActions,
    imageFileExtensions: IMAGE_FILE_EXTENSIONS,
};
