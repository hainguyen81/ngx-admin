/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {ApplicationRef, Component, Inject, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {AnalyticsService, SeoService} from './@core/services';
import {AppConfig} from './config/app.config';
import {NGXLogger} from 'ngx-logger';
import {IPageHeaderConfig, PageHeaderService} from './services/common/header.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {Meta, Title} from '@angular/platform-browser';
import HtmlUtils from './utils/common/html.utils';
import * as moment from 'moment';
import AppUtils from './utils/app/app.utils';
import ArrayUtils from './utils/common/array.utils';
import {InjectionConfig} from './config/injection.config';
import FunctionUtils from './utils/common/function.utils';
import ObjectUtils from './utils/common/object.utils';
import PromiseUtils from './utils/common/promise.utils';

@Component({
    selector: 'ngx-app',
    template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private __routerPageHeaderSubscription: Subscription;

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    constructor(@Inject(AnalyticsService) private analytics: AnalyticsService,
                @Inject(SeoService) private seoService: SeoService,
                @Inject(NGXLogger) private logger: NGXLogger,
                @Inject(TranslateService) private translateService: TranslateService,
                @Inject(Router) private router: Router,
                @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute,
                @Inject(ApplicationRef) private applicationRef: ApplicationRef,
                @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
                @Inject(PageHeaderService) private pageHeaderService?: PageHeaderService,
                @Inject(Title) _titleService?: Title,
                @Inject(Meta) _metaService?: Meta) {
        analytics || throwError('Could not inject AnalyticsService');
        seoService || throwError('Could not inject SeoService');
        logger || throwError('Could not inject TranslateService');
        translateService || throwError('Could not inject TranslateService');
        router || throwError('Could not inject Router');
        activatedRoute || throwError('Could not inject ActivatedRoute');
        applicationRef || throwError('Could not inject ApplicationRef');
        viewContainerRef || throwError('Could not inject ViewContainerRef');

        // check for ensuring Title/Meta service in page header
        pageHeaderService = pageHeaderService || AppUtils.getService(PageHeaderService);
        pageHeaderService = pageHeaderService
            || new PageHeaderService(translateService, logger, _titleService, _metaService);
        pageHeaderService || throwError('Could not inject PageHeaderService');
        if (!pageHeaderService.titleService && _titleService) {
            pageHeaderService.titleService = _titleService;
        }
        if (!pageHeaderService.metaService && _metaService) {
            pageHeaderService.metaService = _metaService;
        }

        InjectionConfig.appRef = this.applicationRef;
        InjectionConfig.viewRef = this.viewContainerRef;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        try {
            this.analytics.trackPageViews();
            this.seoService.trackCanonicalChanges();

            // detect browser language and supported languages
            let language: string = HtmlUtils.detectBrowserLanguage();
            if (!language.length || AppConfig.i18n.languages.indexOf(language) < 0) {
                language = AppConfig.i18n.defaultLang;

            } else if (AppConfig.i18n.defaultLang !== language) {
                AppConfig.i18n.defaultLang = language;
            }

            this.logger.warn('Default application language', language);
            this.translateService.setDefaultLang(language);
            this.translateService.use(AppConfig.i18n.use);
            this.translateService.addLangs(AppConfig.i18n.languages);
            this.translateService.get('common.search.placeholder')
                .subscribe(value => this.logger.debug(
                    'Translated?', 'common.search.placeholder', ' -> ', value))
                .unsubscribe();
            this.translateService.get('app')
                .subscribe(value => this.logger.debug(
                    'Translated?', 'app', ' -> ', value))
                .unsubscribe();

            // apply moment locale for date/time
            moment.locale(AppConfig.i18n.use);

            // apply application header configuration
            this.detectForPageHeaderConfig();
        } catch (e) {
            this.logger.error('Error on AppComponent::ngOnInit', e);
        }
    }

    ngOnDestroy() {
        PromiseUtils.unsubscribe(this.__routerPageHeaderSubscription);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Detect for applying page header configuration
     */
    private detectForPageHeaderConfig() {
        if (ObjectUtils.isNotNou(this.__routerPageHeaderSubscription)) {
            return;
        }

        try {
            // listen router for applying page header configuration
            this.__routerPageHeaderSubscription = this.router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => {
                    let headerConfig: IPageHeaderConfig;
                    try {
                        const child = this.activatedRoute.firstChild;
                        if (child.snapshot.data['headerConfig']) {
                            headerConfig = child.snapshot.data['headerConfig'] as IPageHeaderConfig;
                            if (headerConfig) {
                                let routeTitles: string[];
                                routeTitles = [AppConfig.PageConfig.title];
                                if (ArrayUtils.isArray(headerConfig.title)) {
                                    routeTitles = routeTitles.concat(Array.from(headerConfig.title));
                                } else if ((headerConfig.title || '').length) {
                                    routeTitles.push(headerConfig.title as string);
                                }
                                headerConfig.title = routeTitles;
                            }
                        }
                    } catch (e) {
                        this.logger.error('Error on AppComponent::detectForPageHeaderConfig', e);
                    }
                    return (headerConfig || AppConfig.PageConfig);
                }),
            ).subscribe((headerConfig: IPageHeaderConfig) => {
                // wait for translation service configuration
                // if (headerConfig) {
                //     TimerUtils.timeout(() => {
                //         try {
                //             this.pageHeaderService.setConfig(headerConfig);
                //         } catch (e) {
                //             this.logger.error('Error on AppComponent::detectForPageHeaderConfig', e);
                //         }
                //     }, 300, this);
                // }

                FunctionUtils.invokeTrue(
                    ObjectUtils.isNotNou(headerConfig),
                    () => {
                        try {
                            this.pageHeaderService.setConfig(headerConfig);
                        } catch (e) {
                            this.logger.error('Error on AppComponent::detectForPageHeaderConfig', e);
                        }
                    }, this);
            });
        } catch (e) {
            this.logger.error('Error on AppComponent::detectForPageHeaderConfig', e);
        }
    }
}
