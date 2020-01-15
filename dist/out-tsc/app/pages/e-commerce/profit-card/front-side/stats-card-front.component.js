import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ProfitBarAnimationChartData } from '../../../../@core/data/profit-bar-animation-chart';
import { takeWhile } from 'rxjs/operators';
let StatsCardFrontComponent = class StatsCardFrontComponent {
    constructor(profitBarAnimationChartService) {
        this.profitBarAnimationChartService = profitBarAnimationChartService;
        this.alive = true;
        this.profitBarAnimationChartService.getChartData()
            .pipe(takeWhile(() => this.alive))
            .subscribe((linesData) => {
            this.linesData = linesData;
        });
    }
};
StatsCardFrontComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-stats-card-front',
        styleUrls: ['./stats-card-front.component.scss'],
        templateUrl: './stats-card-front.component.html',
    }),
    tslib_1.__metadata("design:paramtypes", [ProfitBarAnimationChartData])
], StatsCardFrontComponent);
export { StatsCardFrontComponent };
//# sourceMappingURL=stats-card-front.component.js.map