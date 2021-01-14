import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {CustomerDatasource} from '../../../../../services/implementation/system/customer/customer.datasource';
import {CustomerDbService, CustomerHttpService} from '../../../../../services/implementation/system/customer/customer.service';
import {CustomerSmartTableComponent} from './customer.table.component';
import {CustomerToolbarComponent} from './customer.toolbar.component';
import {CustomerFormlyComponent} from './customer.formly.component';
import {CustomerComponent} from './customer.component';
import {ComponentsModule} from '../../../components.module';
import {AppComponentsModule} from '../../components/app.components.module';
import {AppCommonComponentsModule} from '../../components/common/app.common.components.module';
import {FeaturesComponentsModule} from '../../module.components/features.components.module';

@NgModule({
    imports: [
        /* Application components module */
        ComponentsModule,
        AppComponentsModule,
        AppCommonComponentsModule,
        FeaturesComponentsModule,
    ],
    declarations: [
        CustomerSmartTableComponent,
        CustomerToolbarComponent,
        CustomerFormlyComponent,
        CustomerComponent,
    ],
    entryComponents: [
        CustomerSmartTableComponent,
        CustomerToolbarComponent,
        CustomerFormlyComponent,
        CustomerComponent,
    ],
    providers: [
        {
            provide: CustomerDatasource, useClass: CustomerDatasource,
            deps: [CustomerHttpService, CustomerDbService, NGXLogger],
        },
    ],
    exports: [
        CustomerSmartTableComponent,
        CustomerToolbarComponent,
        CustomerFormlyComponent,
        CustomerComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
    ],
})
export class CustomerModule {
}
