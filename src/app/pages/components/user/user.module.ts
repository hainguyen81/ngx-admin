import {NgModule} from '@angular/core';
import {UserSmartTableComponent} from './user.component';
import {SmartTableComponent} from '../smart-table.component';

@NgModule({
    imports: [],
    declarations: [
        SmartTableComponent,
        UserSmartTableComponent,
    ],
})
export class UserModule {
}
