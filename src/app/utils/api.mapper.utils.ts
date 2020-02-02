import {API} from '../config/api.config';

/**
 * API client link mapper utilities
 */
export default class ApiMapperUtils {
    public static findClientLink(apiCode?: string): string {
        if (!apiCode) {
            return '';
        }
        for (const api of Object.values(API)) {
            if (api && api.hasOwnProperty('code') && api['code'] === apiCode) {
                return api['client'] || '';
            }
        }
        return '';
    }
}
