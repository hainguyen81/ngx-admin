import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
let ShowcaseDialogComponent = class ShowcaseDialogComponent {
    constructor(ref) {
        this.ref = ref;
    }
    dismiss() {
        this.ref.close();
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], ShowcaseDialogComponent.prototype, "title", void 0);
ShowcaseDialogComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-showcase-dialog',
        templateUrl: 'showcase-dialog.component.html',
        styleUrls: ['showcase-dialog.component.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [NbDialogRef])
], ShowcaseDialogComponent);
export { ShowcaseDialogComponent };
//# sourceMappingURL=showcase-dialog.component.js.map