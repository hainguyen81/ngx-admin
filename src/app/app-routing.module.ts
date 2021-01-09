import {ExtraOptions, PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {Inject, Injector, ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
/* Authentication */
import {AuthGuard} from './auth/auth.guard.service';
import {
    NbAuthComponent,
    NbLoginComponent,
    NbLogoutComponent,
    NbRegisterComponent,
    NbRequestPasswordComponent,
    NbResetPasswordComponent,
} from '@nebular/auth';
import {NbIconLibraries} from '@nebular/theme';
import {NGXLogger} from 'ngx-logger';
import {throwIfAlreadyLoaded} from './@core/core.module';
import {AppConfig} from './config/app.config';

const routes: Routes = [
    {
        path: 'dashboard',
        // here we tell Angular to check the access with our AuthGuard
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    },
    {
        path: 'auth',
        component: NbAuthComponent,
        data: {headerConfig: {title: 'common.login.title'}},
        children: [
            {
                path: '',
                component: NbLoginComponent,
                data: {headerConfig: {title: 'common.login.title'}},
            },
            {
                path: 'login',
                component: NbLoginComponent,
                data: {headerConfig: {title: 'common.login.title'}},
            },
            {
                path: 'register',
                component: NbRegisterComponent,
            },
            {
                path: 'logout',
                component: NbLogoutComponent,
            },
            {
                path: 'request-password',
                component: NbRequestPasswordComponent,
            },
            {
                path: 'reset-password',
                component: NbResetPasswordComponent,
            },
        ],
    },
    {path: '', redirectTo: 'auth', pathMatch: 'full'},
    {path: '**', redirectTo: 'dashboard'},
];

const config: ExtraOptions = {
    useHash: false,
    preloadingStrategy: PreloadAllModules,
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
})
export class AppRoutingModule {

    private readonly moduleInjector: Injector;

    constructor(@Optional() @SkipSelf() parentModule: AppRoutingModule,
                injector: Injector,
                iconLibraries: NbIconLibraries,
                @Inject(NGXLogger) logger: NGXLogger) {
        // @ts-ignore
        throwIfAlreadyLoaded(parentModule, 'AppRoutingModule');
        this.moduleInjector = Injector.create({providers: AppConfig.Providers.All, parent: injector, name: 'AppRoutingModuleInjector'});
    }

    static forRoot(): ModuleWithProviders<AppRoutingModule> {
        return {
            ngModule: AppRoutingModule,
            providers: AppConfig.Providers.All,
        };
    }

    static forChild(): ModuleWithProviders<AppRoutingModule> {
        return {
            ngModule: AppRoutingModule,
            providers: AppConfig.Providers.All,
        };
    }
}

