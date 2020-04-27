import {AppConfig} from '../config/app.config';
import {Injector} from '@angular/core';

export default class AppUtils {

    /**
     * Get the injectable service instance by the specified service type
     * @param token to inject
     * @return the injectable service instance
     */
    public static getService<T>(token: any): T {
        return this.getInjectService(AppConfig.Injector, token);
    }

    /**
     * Get the injectable service instance by the specified service type
     * @param injector to get injection instance
     * @param token to inject
     * @return the injectable service instance
     */
    public static getInjectService<T>(injector: Injector, token: any): T {
        return (injector ? injector.get(token) : undefined);
    }
}
