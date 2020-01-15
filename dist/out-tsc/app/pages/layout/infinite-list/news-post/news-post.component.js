import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { NewsPost } from '../../news.service';
let NewsPostComponent = class NewsPostComponent {
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", NewsPost)
], NewsPostComponent.prototype, "post", void 0);
NewsPostComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-news-post',
        templateUrl: 'news-post.component.html',
    })
], NewsPostComponent);
export { NewsPostComponent };
//# sourceMappingURL=news-post.component.js.map