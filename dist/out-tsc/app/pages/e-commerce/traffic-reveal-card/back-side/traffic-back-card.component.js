import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
let TrafficBackCardComponent = class TrafficBackCardComponent {
    constructor(themeService) {
        this.themeService = themeService;
        this.alive = true;
        this.themeService.getJsTheme()
            .pipe(takeWhile(() => this.alive))
            .subscribe(theme => {
            this.currentTheme = theme.name;
        });
    }
    ngOnDestroy() {
        this.alive = false;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TrafficBackCardComponent.prototype, "trafficBarData", void 0);
TrafficBackCardComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-traffic-back-card',
        styleUrls: ['./traffic-back-card.component.scss'],
        templateUrl: './traffic-back-card.component.html',
    }),
    tslib_1.__metadata("design:paramtypes", [NbThemeService])
], TrafficBackCardComponent);
export { TrafficBackCardComponent };
//# sourceMappingURL=traffic-back-card.component.js.map