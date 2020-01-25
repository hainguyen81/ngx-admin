import {InjectionToken, Injector, ModuleWithProviders, NgModule, Optional, SkipSelf, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonProviders, UserProviders} from '../../config/app.providers';
import {MockUserService} from './users.service';
import {UserDbService} from '../../services/implementation/user/user.service';
import {NGXLogger} from 'ngx-logger';
import {throwIfAlreadyLoaded} from '../core.module';
import {AppConfig} from '../../config/app.config';
import {throwError} from 'rxjs';

export const MOCK_PROVIDERS = CommonProviders
    .concat(UserProviders)
    .concat([
        {
            provide: MockUserService, useClass: MockUserService,
            deps: [UserDbService, NGXLogger],
        },
    ]);

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [],
    declarations: [],
})
export class MockDataModule {

    private moduleInjector: Injector;

    constructor(@Optional() @SkipSelf() parentModule: MockDataModule,
                injector: Injector) {
        throwIfAlreadyLoaded(parentModule, 'MockDataModule');
        // initialize mock data if necessary
        this.moduleInjector = Injector.create({providers: MOCK_PROVIDERS, parent: injector});
        this.initialization();
    }

    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: MockDataModule,
            providers: [
                ...MOCK_PROVIDERS,
            ],
        };
    }

    protected getService<T>(token: Type<T> | InjectionToken<T>): T {
        this.moduleInjector || throwError('Could not create injector to inject mock services!');
        return this.moduleInjector.get(token);
    }

    protected initialization() {
        if (AppConfig.Env.production) {
            return;
        }

        this.getService(MockUserService).initialize();
    }
}
