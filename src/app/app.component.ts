/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, Inject, OnInit} from '@angular/core';
import {AnalyticsService} from './@core/services/analytics.service';
import {SeoService} from './@core/services/seo.service';

@Component({
    selector: 'ngx-app',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

    constructor(@Inject(AnalyticsService) private analytics: AnalyticsService,
                @Inject(SeoService) private seoService: SeoService) {
    }

    ngOnInit(): void {
        this.analytics.trackPageViews();
        this.seoService.trackCanonicalChanges();
    }
}
