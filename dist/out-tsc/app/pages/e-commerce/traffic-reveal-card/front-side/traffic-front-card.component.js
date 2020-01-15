import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
let TrafficFrontCardComponent = class TrafficFrontCardComponent {
    constructor(themeService) {
        this.themeService = themeService;
        this.alive = true;
        this.themeService.getJsTheme()
            .pipe(takeWhile(() => this.alive))
            .subscribe(theme => {
            this.currentTheme = theme.name;
        });
    }
    trackByDate(_, item) {
        return item.date;
    }
    ngOnDestroy() {
        this.alive = false;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TrafficFrontCardComponent.prototype, "frontCardData", void 0);
TrafficFrontCardComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-traffic-front-card',
        styleUrls: ['./traffic-front-card.component.scss'],
        templateUrl: './traffic-front-card.component.html',
    }),
    tslib_1.__metadata("design:paramtypes", [NbThemeService])
], TrafficFrontCardComponent);
export { TrafficFrontCardComponent };
//# sourceMappingURL=traffic-front-card.component.js.map