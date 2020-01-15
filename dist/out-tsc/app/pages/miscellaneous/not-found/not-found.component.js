import * as tslib_1 from "tslib";
import { NbMenuService } from '@nebular/theme';
import { Component } from '@angular/core';
let NotFoundComponent = class NotFoundComponent {
    constructor(menuService) {
        this.menuService = menuService;
    }
    goToHome() {
        this.menuService.navigateHome();
    }
};
NotFoundComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-not-found',
        styleUrls: ['./not-found.component.scss'],
        templateUrl: './not-found.component.html',
    }),
    tslib_1.__metadata("design:paramtypes", [NbMenuService])
], NotFoundComponent);
export { NotFoundComponent };
//# sourceMappingURL=not-found.component.js.map