import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { CalendarKitMonthCellComponent } from './month-cell/month-cell.component';
let CalendarKitFullCalendarShowcaseComponent = class CalendarKitFullCalendarShowcaseComponent {
    constructor() {
        this.month = new Date();
        this.monthCellComponent = CalendarKitMonthCellComponent;
    }
};
CalendarKitFullCalendarShowcaseComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-calendar-kit',
        templateUrl: 'calendar-kit.component.html',
        styleUrls: ['calendar-kit.component.scss'],
        entryComponents: [CalendarKitMonthCellComponent],
    })
], CalendarKitFullCalendarShowcaseComponent);
export { CalendarKitFullCalendarShowcaseComponent };
//# sourceMappingURL=calendar-kit.component.js.map