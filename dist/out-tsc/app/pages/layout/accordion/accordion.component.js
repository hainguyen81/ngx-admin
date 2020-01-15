import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
let AccordionComponent = class AccordionComponent {
    toggle() {
        this.accordion.toggle();
    }
};
tslib_1.__decorate([
    ViewChild('item', { static: true }),
    tslib_1.__metadata("design:type", Object)
], AccordionComponent.prototype, "accordion", void 0);
AccordionComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-accordion',
        templateUrl: 'accordion.component.html',
        styleUrls: ['accordion.component.scss'],
    })
], AccordionComponent);
export { AccordionComponent };
//# sourceMappingURL=accordion.component.js.map