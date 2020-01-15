import * as tslib_1 from "tslib";
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NbWindowService } from '@nebular/theme';
import { WindowFormComponent } from './window-form/window-form.component';
let WindowComponent = class WindowComponent {
    constructor(windowService) {
        this.windowService = windowService;
    }
    openWindow(contentTemplate) {
        this.windowService.open(contentTemplate, {
            title: 'Window content from template',
            context: {
                text: 'some text to pass into template',
            },
        });
    }
    openWindowForm() {
        this.windowService.open(WindowFormComponent, { title: `Window` });
    }
    openWindowWithoutBackdrop() {
        this.windowService.open(this.disabledEscTemplate, {
            title: 'Window without backdrop',
            hasBackdrop: false,
            closeOnEsc: false,
        });
    }
};
tslib_1.__decorate([
    ViewChild('contentTemplate', { static: true }),
    tslib_1.__metadata("design:type", TemplateRef)
], WindowComponent.prototype, "contentTemplate", void 0);
tslib_1.__decorate([
    ViewChild('disabledEsc', { read: TemplateRef, static: true }),
    tslib_1.__metadata("design:type", TemplateRef)
], WindowComponent.prototype, "disabledEscTemplate", void 0);
WindowComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-window',
        templateUrl: 'window.component.html',
        styleUrls: ['window.component.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [NbWindowService])
], WindowComponent);
export { WindowComponent };
//# sourceMappingURL=window.component.js.map