import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { MapsRoutingModule, routedComponents } from './maps-routing.module';
let MapsModule = class MapsModule {
};
MapsModule = tslib_1.__decorate([
    NgModule({
        imports: [
            ThemeModule,
            AgmCoreModule.forRoot({
                apiKey: 'AIzaSyCpVhQiwAllg1RAFaxMWSpQruuGARy0Y1k',
                libraries: ['places'],
            }),
            LeafletModule.forRoot(),
            MapsRoutingModule,
            NgxEchartsModule,
            NbCardModule,
        ],
        exports: [],
        declarations: [
            ...routedComponents,
        ],
    })
], MapsModule);
export { MapsModule };
//# sourceMappingURL=maps.module.js.map