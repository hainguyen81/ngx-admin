import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbAuthModule} from '@nebular/auth';
import {NbSecurityModule, NbRoleProvider} from '@nebular/security';
import {of as observableOf} from 'rxjs';
import {
    AnalyticsService,
    LayoutService,
    SeoService,
    StateService,
} from './services';

export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
    if (parentModule) {
        throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
    }
}

export class NbSimpleRoleProvider extends NbRoleProvider {
    getRole() {
        // here you could provide any role based on any auth flow
        return observableOf('guest');
    }
}

export const NB_CORE_PROVIDERS = [
    NbSecurityModule.forRoot({
        accessControl: {
            guest: {
                view: '*',
            },
            user: {
                parent: 'guest',
                create: '*',
                edit: '*',
                remove: '*',
            },
        },
    }).providers,

    {
        provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
    },
    AnalyticsService,
    LayoutService,
    SeoService,
    StateService,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        NbAuthModule,
    ],
    declarations: [],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }

    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: CoreModule,
            providers: [
                ...NB_CORE_PROVIDERS,
            ],
        };
    }
}
