import * as tslib_1 from "tslib";
import { Component, HostBinding } from '@angular/core';
let NewsPostPlaceholderComponent = class NewsPostPlaceholderComponent {
    constructor() {
        this.label = 'Loading';
    }
};
tslib_1.__decorate([
    HostBinding('attr.aria-label'),
    tslib_1.__metadata("design:type", Object)
], NewsPostPlaceholderComponent.prototype, "label", void 0);
NewsPostPlaceholderComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-news-post-placeholder',
        templateUrl: 'news-post-placeholder.component.html',
        styleUrls: ['news-post-placeholder.component.scss'],
    })
], NewsPostPlaceholderComponent);
export { NewsPostPlaceholderComponent };
//# sourceMappingURL=news-post-placeholder.component.js.map