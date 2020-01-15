import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let GmapsComponent = class GmapsComponent {
    constructor() {
        this.lat = 51.678418;
        this.lng = 7.809007;
    }
};
GmapsComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-gmaps',
        styleUrls: ['./gmaps.component.scss'],
        template: `
    <nb-card>
      <nb-card-header>Google Maps</nb-card-header>
      <nb-card-body>
        <agm-map [latitude]="lat" [longitude]="lng">
          <agm-marker [latitude]="lat" [longitude]="lng"></agm-marker>
        </agm-map>
      </nb-card-body>
    </nb-card>
  `,
    })
], GmapsComponent);
export { GmapsComponent };
//# sourceMappingURL=gmaps.component.js.map