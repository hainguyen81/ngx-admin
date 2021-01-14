import {Inject, InjectionToken, Injector, ModuleWithProviders, NgModule, Optional, SkipSelf, Type,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MockUserService} from './system/users.service';
import {UserDbService} from '../../services/implementation/system/user/user.service';
import {LoggerModule, NGXLogger} from 'ngx-logger';
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
import {
    CommonProviders,
    CountryProviders,
    CustomerProviders,
    GeneralSettingsProviders,
    InterceptorProviders,
    OrganizationProviders,
    UserProviders,
    WarehouseProviders,
} from '../../config/app.providers';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IMockService} from './mock.service';
import PromiseUtils from '../../utils/common/promise.utils';
import {HttpClientModule} from '@angular/common/http';
import {NgxIndexedDBModule} from 'ngx-indexed-db';
import {BrowserModule} from '@angular/platform-browser';

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

export const MOCK_PROVIDERS = []
    .concat(CommonProviders)
    .concat(InterceptorProviders)
    .concat(GeneralSettingsProviders)
    .concat(OrganizationProviders)
    .concat(UserProviders)
    .concat(CustomerProviders)
    .concat(CountryProviders)
    .concat(WarehouseProviders)
    .concat(MOCK_DATA_PROVIDERS)
    .concat(MOCK_WAREHOUSE_DATA_PROVIDERS);

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),

        /* Database */
        NgxIndexedDBModule.forRoot(AppConfig.Db),
    ],
    exports: [],
    declarations: [],
    bootstrap: [],
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

    static forRoot(): ModuleWithProviders<MockDataModule> {
        return <ModuleWithProviders<MockDataModule>>{
            ngModule: MockDataModule,
            providers: MOCK_PROVIDERS,
        };
    }

    protected getService<T>(token: Type<T> | InjectionToken<T> | any): T {
        this.moduleInjector || throwError('Could not create injector to inject mock services!');
        return this.moduleInjector.get(token);
    }

    protected initialization() {
        if (!AppConfig.Env.mock) {
            return;
        }

        /** Common data providers */
        const promises: Promise<any>[] = [];
        [].concat(MOCK_DATA_PROVIDERS)
            .concat(MOCK_WAREHOUSE_DATA_PROVIDERS)
            .forEach(provider => {
                const mockService: IMockService = this.getService(provider['provide']);
                mockService && promises.push(mockService.initialize());
            });
        PromiseUtils.parallelPromises(
            undefined, undefined, Array.from(promises.values()))
            .then(value => this.logger.debug('SUCCESS: Initialize database successful'),
                reason => this.logger.error('ERROR: Initialize database failed', reason))
            .catch(reason => this.logger.error('ERROR: Initialize database failed', reason));
    }
}
