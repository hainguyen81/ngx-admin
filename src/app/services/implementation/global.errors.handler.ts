import {ErrorHandler, Inject, Injectable, Injector} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {throwError} from 'rxjs';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';

@Injectable({ providedIn: 'root' })
export default class GlobalErrorsHandler implements ErrorHandler {

    /**
     * Get the {TranslateService} instance
     * @return the {TranslateService} instance
     */
    protected getTranslateService(): TranslateService {
        return this.translateService;
    }

    /**
     * Get the {ToastrService} instance
     * @return the {ToastrService} instance
     */
    protected getToasterService(): ToastrService {
        return this.toasterService;
    }

    /**
     * Get the {NGXLogger} instance
     * @return the {NGXLogger} instance
     */
    protected getLogger(): NGXLogger {
        return this.logger;
    }

    /**
     * Get the {Injector} instance
     * @return the {Injector} instance
     */
    protected getInjector(): Injector {
        return this.injector;
    }

    /**
     * Create a new instance of {GlobalErrorsHandler} class
     * @param translateService {TranslateService}
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     */
    constructor(@Inject(TranslateService) private translateService: TranslateService,
                @Inject(ToastrService) private toasterService: ToastrService,
                @Inject(NGXLogger) private logger: NGXLogger,
                private injector: Injector) {
        translateService || throwError('Could not inject TranslateService');
        toasterService || throwError('Could not inject ToastrService');
        logger || throwError('Could not inject NGXLogger');
        injector || throwError('Could not inject Injector');
    }

    /**
     * Handle unexpected errors
     * @param error to handle
     */
    handleError(error: any): void {
        // log error
        const location = this.getInjector().get(LocationStrategy);
        const message = (error && error.message ? error.message : error ? error.toString() : 'Unknown ERROR!!!');
        const url = location instanceof PathLocationStrategy ? location.path() : '';

        window.console.error([ 'Global error handler', error ]);

        this.getLogger()
        && this.getLogger().error('Unexpected Error', {message, url, error: error});

        // show notification
        this.getToasterService()
        && this.getToasterService().error(
            this.getTranslateService().instant('common.toast.unknown'),
            this.getTranslateService().instant('app'));
    }
}
