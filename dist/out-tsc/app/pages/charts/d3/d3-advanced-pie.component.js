import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
let D3AdvancedPieComponent = class D3AdvancedPieComponent {
    constructor(theme) {
        this.theme = theme;
        this.single = [
            {
                name: 'Germany',
                value: 8940000,
            },
            {
                name: 'USA',
                value: 5000000,
            },
            {
                name: 'France',
                value: 7200000,
            },
        ];
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors = config.variables;
            this.colorScheme = {
                domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
            };
        });
    }
    ngOnDestroy() {
        this.themeSubscription.unsubscribe();
    }
};
D3AdvancedPieComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-d3-advanced-pie',
        template: `
    <ngx-charts-advanced-pie-chart
      [scheme]="colorScheme"
      [results]="single">
    </ngx-charts-advanced-pie-chart>
  `,
    }),
    tslib_1.__metadata("design:paramtypes", [NbThemeService])
], D3AdvancedPieComponent);
export { D3AdvancedPieComponent };
//# sourceMappingURL=d3-advanced-pie.component.js.map