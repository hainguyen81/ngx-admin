import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
let CountryOrdersMapService = class CountryOrdersMapService {
    constructor(http) {
        this.http = http;
    }
    getCords() {
        return this.http.get('assets/leaflet-countries/countries.geo.json');
    }
};
CountryOrdersMapService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], CountryOrdersMapService);
export { CountryOrdersMapService };
//# sourceMappingURL=country-orders-map.service.js.map