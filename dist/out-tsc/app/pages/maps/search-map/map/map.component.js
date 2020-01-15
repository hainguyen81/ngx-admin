import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Location } from '../entity/Location';
let MapComponent = class MapComponent {
    set searchedLocation(searchedLocation) {
        this.latitude = searchedLocation.latitude;
        this.longitude = searchedLocation.longitude;
        this.zoom = 12;
    }
    ngOnInit() {
        // set up current location
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.searchedLocation = new Location(position.coords.latitude, position.coords.longitude);
            });
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Location),
    tslib_1.__metadata("design:paramtypes", [Location])
], MapComponent.prototype, "searchedLocation", null);
MapComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-map',
        templateUrl: './map.component.html',
        styleUrls: ['./map.component.scss'],
    })
], MapComponent);
export { MapComponent };
//# sourceMappingURL=map.component.js.map