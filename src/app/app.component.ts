/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, Inject, OnInit} from '@angular/core';
import {TranslateLoader, TranslateService} from '@ngx-translate/core';
import {AnalyticsService, SeoService} from './@core/services';
import {throwError} from 'rxjs';
import {AppConfig} from './config/app.config';
import {NGXLogger} from 'ngx-logger';

@Component({
    selector: 'ngx-app',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

    constructor(@Inject(AnalyticsService) private analytics: AnalyticsService,
                @Inject(SeoService) private seoService: SeoService,
                @Inject(NGXLogger) private logger: NGXLogger,
                @Inject(TranslateService) private translateService: TranslateService) {
        analytics || throwError('Could not inject AnalyticsService');
        seoService || throwError('Could not inject SeoService');
        logger || throwError('Could not inject TranslateService');
        translateService || throwError('Could not inject TranslateService');
    }

    ngOnInit(): void {
        this.analytics.trackPageViews();
        this.seoService.trackCanonicalChanges();

        this.translateService.setDefaultLang(AppConfig.i18n.defaultLang);
        this.translateService.use(AppConfig.i18n.use);
        this.translateService.addLangs(AppConfig.i18n.languages);
    }
}
