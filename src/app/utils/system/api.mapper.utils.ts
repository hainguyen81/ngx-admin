import {API} from '../../config/api.config';
import {isNullOrUndefined, isObject} from 'util';

/**
 * API client link mapper utilities
 */
export default class ApiMapperUtils {
    /**
     * Get the client route link by the specified API code
     * @param apiCode to filter
     * @return the client route link
     */
    public static findClientLink(apiCode?: string): string {
        let clientLink: string;
        clientLink = '';
        if (!(apiCode || '').length) {
            return clientLink;
        }
        for (const api of Object.values(API)) {
            clientLink = this.findClientLinkRecursive(apiCode, api);
            if (!isNullOrUndefined(clientLink)) {
                break;
            }
        }
        return (clientLink || '');
    }
    private static findClientLinkRecursive(code?: string | null, api?: any | null): string {
        if (!(code || '').length || !api || !isObject(api)) {
            return null;
        }

        // parse API code
        let apiCode: string;
        apiCode = '';
        if (api.hasOwnProperty('code')) {
            if (typeof api['code'] === 'function') {
                apiCode = api['code']['call'](undefined) as string;
            } else {
                apiCode = api['code'] as string;
            }
        }

        // parse API client link
        let clientLink: string;
        clientLink = undefined;
        if (api.hasOwnProperty('client')
            && isObject(api['client']) && (<Object>api['client']).hasOwnProperty('url')) {
            if (typeof api['client']['url'] === 'function') {
                clientLink = api['client']['url']['call'](undefined) as string;
            } else {
                clientLink = api['client']['url'] as string;
            }
        }

        if (apiCode === code) {
            return (clientLink || '');
        }

        if (api.hasOwnProperty('children') && isObject(api['children'])) {
            clientLink = undefined;
            for (const [k, v] of Object.entries(<Object>api['children'])) {
                clientLink = this.findClientLinkRecursive(code, v);
                if (!isNullOrUndefined(clientLink)) {
                    break;
                }
            }
        }
        return clientLink;
    }
}
