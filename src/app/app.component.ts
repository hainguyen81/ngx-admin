/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, Inject, OnInit} from '@angular/core';
import {AnalyticsService} from './@core/services/analytics.service';
import {SeoService} from './@core/services/seo.service';
import {AppConfig} from './config/app.config';
import {throwError} from 'rxjs';
/* Mock data services */
import {MockUserService} from './@core/mock/users.service';

@Component({
    selector: 'ngx-app',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

    constructor(@Inject(AnalyticsService) private analytics: AnalyticsService,
                @Inject(SeoService) private seoService: SeoService,
                @Inject(MockUserService) private mockUserService: MockUserService) {
        AppConfig.Env.production || mockUserService
        || throwError('Could not inject mock user service to initialize mock data');
    }

    ngOnInit(): void {
        this.analytics.trackPageViews();
        this.seoService.trackCanonicalChanges();

        if (AppConfig.Env.production) {
            return;
        }

        // initialize mock data for development mode
        this.mockUserService.initialize();
    }
}
