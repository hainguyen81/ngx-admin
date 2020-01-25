import {Inject, ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonProviders, UserProviders} from '../../config/app.providers';
import {MockUserService} from './users.service';
import {UserDbService} from '../../services/implementation/user/user.service';
import {NGXLogger} from 'ngx-logger';
import {throwIfAlreadyLoaded} from '../core.module';
import {AppConfig} from '../../config/app.config';

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

    @Inject(MockUserService) mockUserService: MockUserService;

    constructor(@Optional() @SkipSelf() parentModule: MockDataModule) {
        throwIfAlreadyLoaded(parentModule, 'MockDataModule');
        // initialize mock data if necessary
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

    initialization() {
        if (AppConfig.Env.production) {
            return;
        }

        this.mockUserService.initialize();
    }
}
