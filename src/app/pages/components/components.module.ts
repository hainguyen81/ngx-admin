import {NgModule} from '@angular/core';
import {SmartTableComponent} from './smart-table.component';
import {NbCardModule} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {NotFoundComponent} from './not-found.component';

@NgModule({
    imports: [
        NbCardModule,
        Ng2SmartTableModule,
    ],
    declarations: [
        SmartTableComponent,
        NotFoundComponent,
    ],
})
export class ComponentsModule {
}
