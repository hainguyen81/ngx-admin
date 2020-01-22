import {NgModule} from '@angular/core';
import {UserSmartTableComponent} from './user.component';
import {NbCardModule} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';

@NgModule({
    imports: [
        NbCardModule,
        Ng2SmartTableModule,
    ],
    declarations: [
        UserSmartTableComponent,
    ],
})
export class UserModule {
}
