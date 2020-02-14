/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AnalyticsService, SeoService} from './@core/services';
import {throwError} from 'rxjs';
import {AppConfig} from './config/app.config';
import {NGXLogger} from 'ngx-logger';
import PageHeaderService, {IPageHeaderConfig} from './services/header.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {isArray} from 'util';

@Component({
    selector: 'ngx-app',
    template: `<router-outlet></router-outlet><toaster-container></toaster-container>`,
})
export class AppComponent implements OnInit {

    constructor(@Inject(AnalyticsService) private analytics: AnalyticsService,
                @Inject(SeoService) private seoService: SeoService,
                @Inject(NGXLogger) private logger: NGXLogger,
                @Inject(TranslateService) private translateService: TranslateService,
                @Inject(PageHeaderService) private pageHeaderService: PageHeaderService,
                @Inject(Router) private router: Router,
                @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute) {
        analytics || throwError('Could not inject AnalyticsService');
        seoService || throwError('Could not inject SeoService');
        logger || throwError('Could not inject TranslateService');
        translateService || throwError('Could not inject TranslateService');
        pageHeaderService || throwError('Could not inject PageHeaderService');
        router || throwError('Could not inject Router');
        activatedRoute || throwError('Could not inject ActivatedRoute');
    }

    ngOnInit(): void {
        this.analytics.trackPageViews();
        this.seoService.trackCanonicalChanges();

        this.translateService.setDefaultLang(AppConfig.i18n.defaultLang);
        this.translateService.use(AppConfig.i18n.use);
        this.translateService.addLangs(AppConfig.i18n.languages);
        this.translateService.get('common.search.placeholder')
            .subscribe(value => this.logger.debug(
                'Translated?', 'common.search.placeholder', ' -> ', value));
        this.translateService.get('app')
            .subscribe(value => this.logger.debug(
                'Translated?', 'app', ' -> ', value));

        // apply application header configuration
        this.detectForPageHeaderConfig();
    }

    /**
     * Detect for applying page header configuration
     */
    private detectForPageHeaderConfig() {
        // listen router for applying page header configuration
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => {
                let headerConfig: IPageHeaderConfig;
                const child = this.activatedRoute.firstChild;
                if (child.snapshot.data['headerConfig']) {
                    headerConfig = child.snapshot.data['headerConfig'] as IPageHeaderConfig;
                    if (headerConfig) {
                        let routeTitles: string[];
                        routeTitles = [AppConfig.PageConfig.title];
                        if (isArray(headerConfig.title)) {
                            routeTitles = routeTitles.concat(Array.from(headerConfig.title));
                        } else if ((headerConfig.title || '').length) {
                            routeTitles.push(headerConfig.title as string);
                        }
                        headerConfig.title = routeTitles;
                    }
                }
                return (headerConfig || AppConfig.PageConfig);
            }),
        ).subscribe((headerConfig: IPageHeaderConfig) => {
            // wait for translation service configuration
            headerConfig
            && setTimeout(() => this.pageHeaderService.setConfig(headerConfig), 300);
        });
    }
}
