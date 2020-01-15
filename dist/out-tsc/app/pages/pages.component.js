import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';
let PagesComponent = class PagesComponent {
    constructor() {
        this.menu = MENU_ITEMS;
    }
};
PagesComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-pages',
        styleUrls: ['pages.component.scss'],
        template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
    })
], PagesComponent);
export { PagesComponent };
//# sourceMappingURL=pages.component.js.map