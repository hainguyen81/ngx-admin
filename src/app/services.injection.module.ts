import {AppConfig} from './config/app.config';
import {Injector, ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {throwIfAlreadyLoaded} from './@core/core.module';

@NgModule({})
export class ServicesInjectionModule {

    private readonly moduleInjector: Injector;

    constructor(@Optional() @SkipSelf() parentModule: ServicesInjectionModule,
                injector: Injector) {
        throwIfAlreadyLoaded(parentModule, 'ServicesInjectionModule');
        // initialize mock data if necessary
        this.moduleInjector = Injector.create({ providers: AppConfig.Providers.All, parent: injector, name: 'ServicesModuleInjector' });
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ServicesInjectionModule,
            providers: AppConfig.Providers.All,
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: ServicesInjectionModule,
            providers: AppConfig.Providers.All,
        };
    }
}
