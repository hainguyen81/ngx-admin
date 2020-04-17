import {AppConfig} from '../config/app.config';

export default class AppUtils {
    /**
     * Get the injectable service instance by the specified service type
     * @param token to inject
     * @return the injectable service instance
     */
    public static getService<T>(token: any): T {
        return AppConfig.Injector['get'].apply(this, token);
    }
}
