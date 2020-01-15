import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, NgZone, Output, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Location } from '../entity/Location';
let SearchComponent = class SearchComponent {
    constructor(mapsAPILoader, ngZone) {
        this.mapsAPILoader = mapsAPILoader;
        this.ngZone = ngZone;
        this.positionChanged = new EventEmitter();
    }
    ngOnInit() {
        // load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address'],
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    // get the place result
                    const place = autocomplete.getPlace();
                    // verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    this.positionChanged.emit(new Location(place.geometry.location.lat(), place.geometry.location.lng()));
                });
            });
        });
    }
};
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], SearchComponent.prototype, "positionChanged", void 0);
tslib_1.__decorate([
    ViewChild('search', { static: true }),
    tslib_1.__metadata("design:type", ElementRef)
], SearchComponent.prototype, "searchElementRef", void 0);
SearchComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-search',
        templateUrl: './search.component.html',
    }),
    tslib_1.__metadata("design:paramtypes", [MapsAPILoader,
        NgZone])
], SearchComponent);
export { SearchComponent };
//# sourceMappingURL=search.component.js.map