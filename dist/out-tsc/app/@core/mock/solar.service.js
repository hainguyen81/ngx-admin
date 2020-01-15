import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { SolarData } from '../data/solar';
let SolarService = class SolarService extends SolarData {
    constructor() {
        super(...arguments);
        this.value = 42;
    }
    getSolarData() {
        return observableOf(this.value);
    }
};
SolarService = tslib_1.__decorate([
    Injectable()
], SolarService);
export { SolarService };
//# sourceMappingURL=solar.service.js.map