import {AppConfig} from './config/app.config';
import {ModuleWithProviders, NgModule} from '@angular/core';

@NgModule({})
export class ServicesInjectionModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ServicesInjectionModule,
            providers: AppConfig.Providers.All,
        };
    }
}
