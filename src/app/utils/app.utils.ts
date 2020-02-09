import {Type} from '@angular/core';
import {AppConfig} from '../config/app.config';

export default class AppUtils {
    /**
     * Get the injectable service instance by the specified service type
     * @param service to inject
     * @return the injectable service instance
     */
    public static getService<T>(service: Type<T>): T {
        return AppConfig.getService(service);
    }
}
