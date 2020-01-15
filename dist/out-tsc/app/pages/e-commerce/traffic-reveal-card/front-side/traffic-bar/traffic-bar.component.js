import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
let TrafficBarComponent = class TrafficBarComponent {
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TrafficBarComponent.prototype, "barData", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TrafficBarComponent.prototype, "successDelta", void 0);
TrafficBarComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-traffic-bar',
        styleUrls: ['./traffic-bar.component.scss'],
        templateUrl: './traffic-bar.component.html',
    })
], TrafficBarComponent);
export { TrafficBarComponent };
//# sourceMappingURL=traffic-bar.component.js.map