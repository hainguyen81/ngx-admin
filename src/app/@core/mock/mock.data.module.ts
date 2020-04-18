import {
    InjectionToken,
    Injector,
    ModuleWithProviders,
    NgModule,
    Optional, Provider,
    SkipSelf,
    Type,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonProviders, CustomerProviders, OrganizationProviders, UserProviders} from '../../config/app.providers';
import {MockUserService} from './system/users.service';
import {UserDbService} from '../../services/implementation/system/user/user.service';
import {NGXLogger} from 'ngx-logger';
import {throwIfAlreadyLoaded} from '../core.module';
import {AppConfig} from '../../config/app.config';
import {throwError} from 'rxjs';
import {MockCustomerService} from './system/customers.service';
import {CustomerDbService} from '../../services/implementation/system/customer/customer.service';
import {MockOrganizationService} from './system/organization.service';
import {OrganizationDbService} from '../../services/implementation/system/organization/organization.service';
import {MockWarehouseCategoryService} from './warehouse/category.service';
import {WarehouseCategoryDbService} from '../../services/implementation/warehouse/warehouse.category/warehouse.category.service';
import {MockWarehouseStorageService} from './warehouse/warehouse.service';
import {WarehouseDbService} from '../../services/implementation/warehouse/warehouse/warehouse.service';
import {MockCountryService} from './system/country.service';
import {CountryDbService} from '../../services/implementation/system/country/country.service';

export const MOCK_DATA_PROVIDERS = [
    {
        provide: MockUserService, useClass: MockUserService,
        deps: [UserDbService, NGXLogger],
    },
    {
        provide: MockCustomerService, useClass: MockCustomerService,
        deps: [CustomerDbService, NGXLogger],
    },
    {
        provide: MockOrganizationService, useClass: MockOrganizationService,
        deps: [OrganizationDbService, NGXLogger],
    },
    {
        provide: MockCountryService, useClass: MockCountryService,
        deps: [CountryDbService, NGXLogger],
    },
];

export const MOCK_WAREHOUSE_DATA_PROVIDERS = [
    {
        provide: MockWarehouseStorageService, useClass: MockWarehouseStorageService,
        deps: [WarehouseDbService, NGXLogger],
    },
    {
        provide: MockWarehouseCategoryService, useClass: MockWarehouseCategoryService,
        deps: [WarehouseCategoryDbService, NGXLogger],
    },
];

export const MOCK_PROVIDERS = CommonProviders
    .concat(OrganizationProviders)
    .concat(UserProviders)
    .concat(CustomerProviders)
    .concat(MOCK_DATA_PROVIDERS)
    .concat(MOCK_WAREHOUSE_DATA_PROVIDERS);

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [],
    declarations: [],
})
export class MockDataModule {

    private readonly moduleInjector: Injector;

    constructor(@Optional() @SkipSelf() parentModule: MockDataModule,
                injector: Injector) {
        throwIfAlreadyLoaded(parentModule, 'MockDataModule');
        // initialize mock data if necessary
        this.moduleInjector = Injector.create({providers: MOCK_PROVIDERS, parent: injector});
        this.initialization();
    }

    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: MockDataModule,
            providers: MOCK_PROVIDERS,
        };
    }

    protected getService<T>(token: Type<T> | InjectionToken<T> | any): T {
        this.moduleInjector || throwError('Could not create injector to inject mock services!');
        return this.moduleInjector.get(token);
    }

    protected initialization() {
        if (!AppConfig.Env.offline) {
            return;
        }

        /** Common data providers */
        [].concat(MOCK_DATA_PROVIDERS)
            .concat(MOCK_WAREHOUSE_DATA_PROVIDERS)
            .forEach(provider => {
            const mockService: any = this.getService(provider['provide']);
            mockService && typeof mockService['initialize'] === 'function'
            && mockService['initialize']['apply'](mockService);
        });
    }
}
