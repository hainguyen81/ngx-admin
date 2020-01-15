import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
let ChartjsPieComponent = class ChartjsPieComponent {
    constructor(theme) {
        this.theme = theme;
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors = config.variables;
            const chartjs = config.variables.chartjs;
            this.data = {
                labels: ['Download Sales', 'In-Store Sales', 'Mail Sales'],
                datasets: [{
                        data: [300, 500, 100],
                        backgroundColor: [colors.primaryLight, colors.infoLight, colors.successLight],
                    }],
            };
            this.options = {
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    xAxes: [
                        {
                            display: false,
                        },
                    ],
                    yAxes: [
                        {
                            display: false,
                        },
                    ],
                },
                legend: {
                    labels: {
                        fontColor: chartjs.textColor,
                    },
                },
            };
        });
    }
    ngOnDestroy() {
        this.themeSubscription.unsubscribe();
    }
};
ChartjsPieComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-chartjs-pie',
        template: `
    <chart type="pie" [data]="data" [options]="options"></chart>
  `,
    }),
    tslib_1.__metadata("design:paramtypes", [NbThemeService])
], ChartjsPieComponent);
export { ChartjsPieComponent };
//# sourceMappingURL=chartjs-pie.component.js.map