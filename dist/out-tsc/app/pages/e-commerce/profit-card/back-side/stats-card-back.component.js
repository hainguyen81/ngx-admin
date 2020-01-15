import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { StatsBarData } from '../../../../@core/data/stats-bar';
import { takeWhile } from 'rxjs/operators';
let StatsCardBackComponent = class StatsCardBackComponent {
    constructor(statsBarData) {
        this.statsBarData = statsBarData;
        this.alive = true;
        this.statsBarData.getStatsBarData()
            .pipe(takeWhile(() => this.alive))
            .subscribe((data) => {
            this.chartData = data;
        });
    }
    ngOnDestroy() {
        this.alive = false;
    }
};
StatsCardBackComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-stats-card-back',
        styleUrls: ['./stats-card-back.component.scss'],
        templateUrl: './stats-card-back.component.html',
    }),
    tslib_1.__metadata("design:paramtypes", [StatsBarData])
], StatsCardBackComponent);
export { StatsCardBackComponent };
//# sourceMappingURL=stats-card-back.component.js.map