import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
let ECommerceLegendChartComponent = class ECommerceLegendChartComponent {
    constructor() {
        /**
         * Take an array of legend items
         * Available iconColor: 'green', 'purple', 'light-purple', 'blue', 'yellow'
         * @type {{iconColor: string; title: string}[]}
         */
        this.legendItems = [];
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], ECommerceLegendChartComponent.prototype, "legendItems", void 0);
ECommerceLegendChartComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-legend-chart',
        styleUrls: ['./legend-chart.component.scss'],
        templateUrl: './legend-chart.component.html',
    })
], ECommerceLegendChartComponent);
export { ECommerceLegendChartComponent };
//# sourceMappingURL=legend-chart.component.js.map