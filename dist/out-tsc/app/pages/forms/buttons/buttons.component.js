import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let ButtonsComponent = class ButtonsComponent {
    constructor() {
        this.statuses = ['primary', 'success', 'info', 'warning', 'danger'];
        this.shapes = ['rectangle', 'semi-round', 'round'];
        this.sizes = ['tiny', 'small', 'medium', 'large', 'giant'];
    }
};
ButtonsComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-buttons',
        styleUrls: ['./buttons.component.scss'],
        templateUrl: './buttons.component.html',
    })
], ButtonsComponent);
export { ButtonsComponent };
//# sourceMappingURL=buttons.component.js.map