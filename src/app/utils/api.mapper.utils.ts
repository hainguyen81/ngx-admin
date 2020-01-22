import {API} from '../config/api.config';

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
