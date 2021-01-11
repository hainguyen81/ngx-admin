import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {ModuleService} from '../services/implementation/module.service';
import {Observable, throwError} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import AppUtils from '../utils/app/app.utils';

@Injectable()
export class PagesGuard implements CanActivateChild {

    protected getModuleService(): ModuleService {
        return this.moduleService;
    }

    protected getRouter(): Router {
        return this.router;
    }

    protected getToasterService(): ToastrService {
        // TODO Could not inject this ToastrService as normally from constructor. Because of [ERROR Cannot instantiate cyclic dependency! ApplicationRef]
        // see https://github.com/scttcper/ngx-toastr/issues/179#issuecomment-325724269
        const toastrService: ToastrService = AppUtils.getService(ToastrService);
        toastrService || throwError('Could not inject ToastrService');
        return toastrService;
    }

    protected getTranslateService(): TranslateService {
        return this.translateService;
    }

    protected getLogger(): NGXLogger {
        return this.logger;
    }

    constructor(@Inject(ModuleService) private readonly moduleService: ModuleService,
                private readonly router: Router,
                @Inject(TranslateService) private translateService: TranslateService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        moduleService || throwError('Could not inject ModuleService');
        router || throwError('Could not inject Router');
        translateService || throwError('Could not inject TranslateService');
        logger || throwError('Could not inject NGXLogger');
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.getModuleService().count().then(
            modulesCount => {
                if (!modulesCount || modulesCount <= 0) {
                    this.getToasterService().error(
                        this.getTranslateService().instant('common.toast.unknown'),
                        this.getTranslateService().instant('app'));
                }
                return (modulesCount && modulesCount > 0);
            }, (errors) => {
                this.getLogger().error('ERROR - Check child route activate', state, errors);
                return false;
            }).catch((errors) => {
                this.getLogger().error('ERROR - Check child route activate', state, errors);
                return false;
            });
    }
}
