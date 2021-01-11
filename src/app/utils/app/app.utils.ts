import {AppConfig} from '../../config/app.config';
import {ApplicationRef, InjectFlags, Injector, ViewContainerRef} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InjectionConfig } from '../../config/injection.config';

export default class AppUtils {

    /**
     * Get the injectable root {ApplicationRef} instance
     * @return the injectable root {ApplicationRef} instance
     */
    public static getApplicationRef(): ApplicationRef {
        return InjectionConfig.appRef;
    }

    /**
     * Get the injectable root {ToastrService} instance
     * @return the injectable root {ToastrService} instance
     */
    public static getToastrService(): ToastrService {
        return AppUtils.getService(ToastrService);
    }

    /**
     * Get the injectable root {ViewContainerRef} instance
     * @return the injectable root {ViewContainerRef} instance
     */
    public static getRootViewRef(): ViewContainerRef {
        const appRef: ApplicationRef = this.getApplicationRef();
        if (!InjectionConfig.viewRef && appRef && (appRef.components || []).length
            && appRef.components[0].instance && appRef.components[0].instance.viewContainerRef) {
            InjectionConfig.viewRef = appRef.components[0].instance.viewContainerRef;
        }
        return InjectionConfig.viewRef;
    }

    /**
     * Get the injectable service instance by the specified service type
     * @param token to inject
     * @return the injectable service instance
     */
    public static getService<T>(token: any): T {
        return this.getInjectService(InjectionConfig.Injector, token);
    }

    /**
     * Get the injectable service instance by the specified service type
     * @param injector to get injection instance
     * @param token to inject
     * @return the injectable service instance
     */
    public static getInjectService<T>(injector: Injector, token: any): T {
        return (injector ? injector.get(token, undefined, InjectFlags.Optional & InjectFlags.Self & InjectFlags.SkipSelf) : undefined);
    }
}
