import {LogConfig} from './log.config';
import {RC_DEFAULT_HEADERS} from './request.config';
import {BaseContextMenu} from './context.menu.conf';
import {BaseToolbarActions} from './toolbar.actions.conf';
import {environment} from '../../environments/environment';

export const IMAGE_FILE_EXTENSIONS: string[] = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];

export const COMMON = {
    mock: environment.mock,
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
