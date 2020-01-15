import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NbDateService } from '@nebular/theme';
let DatepickerComponent = class DatepickerComponent {
    constructor(dateService) {
        this.dateService = dateService;
        this.min = this.dateService.addDay(this.dateService.today(), -5);
        this.max = this.dateService.addDay(this.dateService.today(), 5);
    }
};
DatepickerComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-datepicker',
        templateUrl: 'datepicker.component.html',
        styleUrls: ['datepicker.component.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [NbDateService])
], DatepickerComponent);
export { DatepickerComponent };
//# sourceMappingURL=datepicker.component.js.map