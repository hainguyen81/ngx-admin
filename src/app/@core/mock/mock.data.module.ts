import {
    Inject,
    InjectionToken,
    Injector,
    ModuleWithProviders,
    NgModule,
    Optional,
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
import {WarehouseDbService} from '../../services/implementation/warehouse/warehouse.storage/warehouse.service';
import {MockCountryService} from './system/country.service';
import {CountryDbService} from '../../services/implementation/system/country/country.service';
import {MockGeneralSettingsService} from './system/general.settings.service';
import {GeneralSettingsDbService} from '../../services/implementation/system/general.settings/general.settings.service';
import {IMockService} from './mock.service';
import {isNullOrUndefined} from 'util';
import PromiseUtils from '../../utils/promise.utils';

export const MOCK_DATA_PROVIDERS = [
    {
        provide: MockGeneralSettingsService, useClass: MockGeneralSettingsService,
        deps: [GeneralSettingsDbService, NGXLogger],
    },
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
                injector: Injector,
                @Inject(NGXLogger) private logger: NGXLogger) {
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
        const promises: Promise<any>[] = [];
        [].concat(MOCK_DATA_PROVIDERS)
            .concat(MOCK_WAREHOUSE_DATA_PROVIDERS)
            .forEach(provider => {
                const mockService: IMockService = this.getService(provider['provide']);
                const serviceName: string = (isNullOrUndefined(mockService) ? 'NULL'
                    : Reflect.getPrototypeOf(mockService).constructor.name);
                mockService && promises.push(mockService.initialize());
            });
        PromiseUtils.parallelPromises(
            undefined, undefined, Array.from(promises.values()))
            .then(value => this.logger.debug('SUCCESS: Initialize database successful'),
                reason => this.logger.error('ERROR: Initialize database failed', reason))
            .catch(reason => this.logger.error('ERROR: Initialize database failed', reason));
    }
}
