import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
let WindowFormComponent = class WindowFormComponent {
    constructor(windowRef) {
        this.windowRef = windowRef;
    }
    close() {
        this.windowRef.close();
    }
};
WindowFormComponent = tslib_1.__decorate([
    Component({
        template: `
    <form class="form">
      <label for="subject">Subject:</label>
      <input nbInput id="subject" type="text">

      <label class="text-label" for="text">Text:</label>
      <textarea nbInput id="text"></textarea>
    </form>
  `,
        styleUrls: ['window-form.component.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [NbWindowRef])
], WindowFormComponent);
export { WindowFormComponent };
//# sourceMappingURL=window-form.component.js.map