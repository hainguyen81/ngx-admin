import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { MiscellaneousComponent } from './miscellaneous.component';
import { NotFoundComponent } from './not-found/not-found.component';
let MiscellaneousModule = class MiscellaneousModule {
};
MiscellaneousModule = tslib_1.__decorate([
    NgModule({
        imports: [
            ThemeModule,
            NbCardModule,
            NbButtonModule,
            MiscellaneousRoutingModule,
        ],
        declarations: [
            MiscellaneousComponent,
            NotFoundComponent,
        ],
    })
], MiscellaneousModule);
export { MiscellaneousModule };
//# sourceMappingURL=miscellaneous.module.js.map