import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { EarningData } from '../../../../@core/data/earning';
import { takeWhile } from 'rxjs/operators';
let EarningCardBackComponent = class EarningCardBackComponent {
    constructor(earningService) {
        this.earningService = earningService;
        this.alive = true;
        this.defaultSelectedCurrency = 'Bitcoin';
        this.earningService.getEarningPieChartData()
            .pipe(takeWhile(() => this.alive))
            .subscribe((earningPieChartData) => {
            this.earningPieChartData = earningPieChartData;
        });
    }
    changeChartInfo(pieData) {
        this.value = pieData.value;
        this.name = pieData.name;
        this.color = pieData.color;
    }
    ngOnDestroy() {
        this.alive = false;
    }
};
EarningCardBackComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-earning-card-back',
        styleUrls: ['./earning-card-back.component.scss'],
        templateUrl: './earning-card-back.component.html',
    }),
    tslib_1.__metadata("design:paramtypes", [EarningData])
], EarningCardBackComponent);
export { EarningCardBackComponent };
//# sourceMappingURL=earning-card-back.component.js.map