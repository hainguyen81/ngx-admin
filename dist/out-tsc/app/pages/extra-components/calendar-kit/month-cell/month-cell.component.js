import * as tslib_1 from "tslib";
import { Component, EventEmitter } from '@angular/core';
import { NbCalendarDayPickerComponent, NbCalendarMonthModelService, NbDateService, } from '@nebular/theme';
import { TranslationWidth } from '@angular/common';
let CalendarKitMonthCellComponent = class CalendarKitMonthCellComponent extends NbCalendarDayPickerComponent {
    constructor(dateService, monthModel) {
        super(monthModel);
        this.dateService = dateService;
        this.select = new EventEmitter();
    }
    get title() {
        return this.dateService.getMonthName(this.date, TranslationWidth.Wide);
    }
};
CalendarKitMonthCellComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-calendar-kit-month-cell',
        styleUrls: ['month-cell.component.scss'],
        templateUrl: 'month-cell.component.html',
    }),
    tslib_1.__metadata("design:paramtypes", [NbDateService, NbCalendarMonthModelService])
], CalendarKitMonthCellComponent);
export { CalendarKitMonthCellComponent };
//# sourceMappingURL=month-cell.component.js.map