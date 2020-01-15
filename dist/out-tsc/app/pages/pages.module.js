import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
// import { DashboardModule } from './dashboard/dashboard.module';
// import { ECommerceModule } from './e-commerce/e-commerce.module';
// import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
let PagesModule = class PagesModule {
};
PagesModule = tslib_1.__decorate([
    NgModule({
        imports: [
            PagesRoutingModule,
            ThemeModule,
            NbMenuModule,
        ],
        declarations: [
            PagesComponent,
        ],
    })
], PagesModule);
export { PagesModule };
//# sourceMappingURL=pages.module.js.map