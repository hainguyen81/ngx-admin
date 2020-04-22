import './prototypes.import';
import {ErrorHandler, InjectionToken, Injector, LOCALE_ID, StaticProvider} from '@angular/core';
import {APP_BASE_HREF, DatePipe, DOCUMENT} from '@angular/common';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    HttpHandler,
} from '@angular/common/http';
import {NGXLogger, NGXLoggerHttpService, NGXMapperService} from 'ngx-logger';
import {AuthGuard} from '../auth/auth.guard.service';
import {NB_AUTH_INTERCEPTOR_HEADER, NbAuthService} from '@nebular/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {EmptyService} from '../services/empty.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NbxOAuth2AuthDbService, NbxOAuth2AuthHttpService} from '../auth/auth.oauth2.service';
import {NbxOAuth2AuthStrategy} from '../auth/auth.oauth2.strategy';
import {environment} from '../../environments/environment';
import {
    NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM,
    NBX_AUTH_INTERCEPTOR_COMPANY_HEADER,
    NbxAuthInterceptor,
} from '../services/interceptors/auth.interceptor';
import {SW_VAPID_PUBLIC_KEY} from '../sw/push.service';
import {MenuService} from '../services/implementation/menu.service';
import {ToastrService} from 'ngx-toastr';
import {COMMON} from './common.config';
import {ModuleService} from '../services/implementation/module.service';
import {UserDbService, UserHttpService} from '../services/implementation/system/user/user.service';
import {UserDataSource} from '../services/implementation/system/user/user.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {LocalDataSource} from 'ng2-smart-table';
import {ConnectionService} from 'ng-connection-service';
import {CustomerDbService, CustomerHttpService} from '../services/implementation/system/customer/customer.service';
import {CustomerDatasource} from '../services/implementation/system/customer/customer.datasource';
import {TranslateLoader, TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {
    OrganizationDbService,
    OrganizationHttpService,
} from '../services/implementation/system/organization/organization.service';
import {OrganizationDataSource} from '../services/implementation/system/organization/organization.datasource';
import {PageHeaderService} from '../services/header.service';
import {PagesGuard} from '../pages/pages.guard.service';
import GlobalErrorsHandler from '../services/implementation/global.errors.handler';
import {
    WarehouseDbService,
    WarehouseHttpService,
} from '../services/implementation/warehouse/warehouse/warehouse.service';
import {WarehouseDatasource} from '../services/implementation/warehouse/warehouse/warehouse.datasource';
import {
    WarehouseOrderDbService,
    WarehouseOrderHttpService,
} from '../services/implementation/warehouse/warehouse.order/warehouse.order.service';
import {
    WarehouseOrderDatasource,
} from '../services/implementation/warehouse/warehouse.order/warehouse.order.datasource';
import {
    WarehouseOrderDetailDbService,
    WarehouseOrderDetailHttpService,
} from '../services/implementation/warehouse/warehouse.order.detail/warehouse.order.detail.service';
import {
    WarehouseOrderDetailDatasource,
} from '../services/implementation/warehouse/warehouse.order.detail/warehouse.order.detail.datasource';
import {
    WarehouseItemDbService,
    WarehouseItemHttpService,
} from '../services/implementation/warehouse/warehouse.item/warehouse.item.service';
import {WarehouseItemDatasource} from '../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {
    WarehouseInventoryDbService,
    WarehouseInventoryHttpService,
} from '../services/implementation/warehouse/warehouse.inventory/warehouse.inventory.service';
import {
    WarehouseInventoryDatasource,
} from '../services/implementation/warehouse/warehouse.inventory/warehouse.inventory.datasource';
import {
    WarehouseInventoryDetailDbService,
    WarehouseInventoryDetailHttpService,
} from '../services/implementation/warehouse/warehouse.inventory.detail/warehouse.inventory.detail.service';
import {
    WarehouseInventoryDetailDatasource,
} from '../services/implementation/warehouse/warehouse.inventory.detail/warehouse.inventory.detail.datasource';
import {
    WarehouseCategoryDbService,
    WarehouseCategoryHttpService,
} from '../services/implementation/warehouse/warehouse.category/warehouse.category.service';
import {
    WarehouseCategoryDatasource,
} from '../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import {
    WarehouseAdjustDbService,
    WarehouseAdjustHttpService,
} from '../services/implementation/warehouse/warehouse.adjust/warehouse.adjust.service';
import {
    WarehouseAdjustDatasource,
} from '../services/implementation/warehouse/warehouse.adjust/warehouse.adjust.datasource';
import {
    WarehouseAdjustDetailDbService,
    WarehouseAdjustDetailHttpService,
} from '../services/implementation/warehouse/warehouse.adjust.detail/warehouse.adjust.detail.service';
import {
    WarehouseAdjustDetailDatasource,
} from '../services/implementation/warehouse/warehouse.adjust.detail/warehouse.adjust.detail.datasource';
import {CountryDbService, CountryHttpService} from '../services/implementation/system/country/country.service';
import {CountryDatasource} from '../services/implementation/system/country/country.datasource';
import {CityDbService, CityHttpService} from '../services/implementation/system/city/city.service';
import {CityDatasource} from '../services/implementation/system/city/city.datasource';
import {ProvinceDbService, ProvinceHttpService} from '../services/implementation/system/province/province.service';
import {ProvinceDatasource} from '../services/implementation/system/province/province.datasource';
import {Meta, Title} from '@angular/platform-browser';
import {UniversalApiDbService, UniversalApiHttpService} from '../services/third.party/universal/universal.api.service';
import {UniversalApiDatasource} from '../services/third.party/universal/universal.api.datasource';
import {HTTP_REQUEST_TIMEOUT, TimeoutInterceptor} from '../services/interceptors/timeout.interceptor';
import {HTTP_REQUEST_HEADERS, RequestHeadersInterceptor} from '../services/interceptors/headers.interceptor';
import {UniversalApiBridgeDbService} from '../services/third.party/universal/universal.api.bridge.service';
import {LocalStorageSerializerService} from '../services/storage.services/serializers/local.storage.serializer.service';
import {
    LocalStorageConfiguration,
    LocalStorageService,
    SecuredLocalStorageEncryptionConfig,
    TOKEN_SECURE_ENCRYPTION_CONFIG,
    TOKEN_STORAGE_CONFIG,
    TOKEN_STORAGE_SERIALIZER,
} from '../services/storage.services/local.storage.services';
import {AppConfig} from './app.config';
import LocalStorageEncryptionService from '../services/storage.services/local.storage.services';

export function BaseHrefProvider(): string {
    let baseElement: HTMLCollectionBase;
    baseElement = <HTMLCollectionBase>document.getElementsByTagName('base');
    let href: string;
    href = (baseElement && baseElement.item(0)
        && baseElement.item(0).hasAttribute('href')
        ? baseElement.item(0).getAttribute('href') : environment.baseHref);
    return (href || '').trimLast('/');
}

export const BASE_HREF: InjectionToken<string> =
    new InjectionToken<string>('Application baseHref injection');

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient, baseHref: string) {
    http || throwError('Not found HttpClient to create TranslateHttpLoader');
    return new TranslateHttpLoader(http, (baseHref || '').concat('/assets/i18n/'));
}

export const CommonProviders: StaticProvider[] = [
    {provide: DOCUMENT, useValue: document},
    {provide: APP_BASE_HREF, useFactory: BaseHrefProvider, deps: []},
    {provide: BASE_HREF, useFactory: BaseHrefProvider, deps: []},
    {provide: SW_VAPID_PUBLIC_KEY, useValue: COMMON.sw.vapid_public_key},
    {provide: LOCALE_ID, useValue: 'vi'},
    {provide: DatePipe, useClass: DatePipe, deps: []},
    {provide: HttpClient, useClass: HttpClient, deps: [HttpHandler]},
    {provide: NGXMapperService, useClass: NGXMapperService, deps: [HttpHandler]},
    {provide: NGXLoggerHttpService, useClass: NGXLoggerHttpService, deps: [HttpHandler]},
    {provide: DataSource, useClass: LocalDataSource, deps: []},
    {provide: ContextMenuService, useClass: ContextMenuService, deps: []},
    {provide: ConnectionService, useClass: ConnectionService, deps: []},
    {provide: Title, useClass: Title, deps: [DOCUMENT]},
    {provide: Meta, useClass: Meta, deps: [DOCUMENT]},
    {
        provide: ErrorHandler, useClass: GlobalErrorsHandler,
        deps: [TranslateService, ToastrService, NGXLogger, Injector],
    },

    // local storage
    {
        provide: TOKEN_STORAGE_CONFIG, useClass: LocalStorageConfiguration,
        deps: [
            AppConfig.Storage.config.prefix,
            AppConfig.Storage.config.allowNull,
        ],
    },
    {
        provide: TOKEN_SECURE_ENCRYPTION_CONFIG, useClass: SecuredLocalStorageEncryptionConfig,
        deps: [
            AppConfig.Storage.secureConfig.isCompression,
            AppConfig.Storage.secureConfig.encodingType,
            AppConfig.Storage.secureConfig.encryptionSecret,
            AppConfig.Storage.secureConfig.encryptionNamespace,
        ],
    },
    {provide: TOKEN_STORAGE_SERIALIZER, useClass: LocalStorageSerializerService, deps: []},
    {
        provide: LocalStorageService, useClass: LocalStorageService,
        deps: [NGXLogger, TOKEN_STORAGE_SERIALIZER, TOKEN_STORAGE_CONFIG],
    },
    {
        provide: LocalStorageEncryptionService, useClass: LocalStorageEncryptionService,
        deps: [NGXLogger, TOKEN_STORAGE_SERIALIZER, TOKEN_STORAGE_CONFIG, TOKEN_SECURE_ENCRYPTION_CONFIG],
    },
];

export const InterceptorProviders = [
    /* Request authentication */
    {provide: NB_AUTH_INTERCEPTOR_HEADER, useValue: 'Authorization'},
    {provide: NBX_AUTH_INTERCEPTOR_COMPANY_HEADER, useValue: 'Company'},
    {provide: NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM, useValue: 'access_token'},
    {
        provide: HTTP_INTERCEPTORS, useClass: NbxAuthInterceptor,
        deps: [
            Injector, NGXLogger,
            NB_AUTH_INTERCEPTOR_HEADER,
            NBX_AUTH_INTERCEPTOR_COMPANY_HEADER,
            NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM,
        ],
        multi: true,
    },

    /* Request timeout */
    {provide: HTTP_REQUEST_TIMEOUT, useValue: COMMON.request.timeout},
    {
        provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor,
        deps: [Injector, NGXLogger, HTTP_REQUEST_TIMEOUT],
        multi: true,
    },

    /* Request headers */
    {provide: HTTP_REQUEST_HEADERS, useValue: COMMON.request.headers},
    {
        provide: HTTP_INTERCEPTORS, useClass: RequestHeadersInterceptor,
        deps: [Injector, NGXLogger, HTTP_REQUEST_HEADERS],
        multi: true,
    },
];

export const AuthenticationProviders: StaticProvider[] = [
    {provide: AuthGuard, useClass: AuthGuard, deps: [NbAuthService, Router]},
    {
        provide: ModuleService, useClass: ModuleService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: NbxOAuth2AuthDbService, useClass: NbxOAuth2AuthDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: NbxOAuth2AuthHttpService, useClass: NbxOAuth2AuthHttpService,
        deps: [HttpClient, NGXLogger, UserDbService],
    },
    {
        provide: NbxOAuth2AuthStrategy, useClass: NbxOAuth2AuthStrategy,
        deps: [HttpClient, ActivatedRoute, NbxOAuth2AuthHttpService,
            NbxOAuth2AuthDbService, ModuleService, NGXLogger],
    },
];

export const ThirdPartyApiProviders: StaticProvider[] = [
    // https://www.universal-tutorial.com/api
    {
        provide: UniversalApiDbService, useClass: UniversalApiDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: UniversalApiHttpService, useClass: UniversalApiHttpService,
        deps: [HttpClient, NGXLogger, UniversalApiDbService, LocalStorageEncryptionService],
    },
    {
        provide: UniversalApiDatasource, useClass: UniversalApiDatasource,
        deps: [UniversalApiHttpService, UniversalApiDbService, NGXLogger],
    },
    {
        provide: UniversalApiBridgeDbService, useClass: UniversalApiBridgeDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService, UniversalApiDatasource],
    },
];

export const I18NProviders: StaticProvider[] = [
    {
        provide: TranslateLoader, useFactory: HttpLoaderFactory,
        deps: [HttpClient, APP_BASE_HREF],
    },
    {
        provide: PageHeaderService, useClass: PageHeaderService,
        deps: [TranslateService, NGXLogger],
    },
];

export const UserProviders: StaticProvider[] = [
    {
        provide: UserDbService, useClass: UserDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: UserHttpService, useClass: UserHttpService,
        deps: [HttpClient, NGXLogger, UserDbService],
    },
    {
        provide: UserDataSource, useClass: UserDataSource,
        deps: [UserHttpService, UserDbService, NGXLogger],
    },
];

export const CustomerProviders: StaticProvider[] = [
    {
        provide: CustomerDbService, useClass: CustomerDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: CustomerHttpService, useClass: CustomerHttpService,
        deps: [HttpClient, NGXLogger, UserDbService],
    },
    {
        provide: CustomerDatasource, useClass: CustomerDatasource,
        deps: [CustomerHttpService, CustomerDbService, NGXLogger],
    },
];

export const OrganizationProviders: StaticProvider[] = [
    {
        provide: OrganizationDbService, useClass: OrganizationDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: OrganizationHttpService, useClass: OrganizationHttpService,
        deps: [HttpClient, NGXLogger, OrganizationDbService],
    },
    {
        provide: OrganizationDataSource, useClass: OrganizationDataSource,
        deps: [OrganizationHttpService, OrganizationDbService, NGXLogger],
    },
];

export const CountryProviders: StaticProvider[] = [
    // Country
    {
        provide: CountryDbService, useClass: CountryDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: CountryHttpService, useClass: CountryHttpService,
        deps: [HttpClient, NGXLogger, CountryDbService],
    },
    {
        provide: CountryDatasource, useClass: CountryDatasource,
        deps: [CountryHttpService, CountryDbService, NGXLogger],
    },

    // Province
    {
        provide: ProvinceDbService, useClass: ProvinceDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService, UniversalApiBridgeDbService],
    },
    {
        provide: ProvinceHttpService, useClass: ProvinceHttpService,
        deps: [HttpClient, NGXLogger, ProvinceDbService],
    },
    {
        provide: ProvinceDatasource, useClass: ProvinceDatasource,
        deps: [ProvinceHttpService, ProvinceDbService, NGXLogger],
    },

    // City
    {
        provide: CityDbService, useClass: CityDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService, UniversalApiBridgeDbService],
    },
    {
        provide: CityHttpService, useClass: CityHttpService,
        deps: [HttpClient, NGXLogger, CityDbService],
    },
    {
        provide: CityDatasource, useClass: CityDatasource,
        deps: [CityHttpService, CityDbService, NGXLogger],
    },
];

export const WarehouseProviders: StaticProvider[] = [
    // Warehouse
    {
        provide: WarehouseDbService, useClass: WarehouseDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: WarehouseHttpService, useClass: WarehouseHttpService,
        deps: [HttpClient, NGXLogger, WarehouseDbService],
    },
    {
        provide: WarehouseDatasource, useClass: WarehouseDatasource,
        deps: [WarehouseHttpService, WarehouseDbService, NGXLogger],
    },

    // Warehouse Order
    {
        provide: WarehouseOrderDbService, useClass: WarehouseOrderDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: WarehouseOrderHttpService, useClass: WarehouseOrderHttpService,
        deps: [HttpClient, NGXLogger, WarehouseDbService],
    },
    {
        provide: WarehouseOrderDatasource, useClass: WarehouseOrderDatasource,
        deps: [WarehouseOrderHttpService, WarehouseOrderDbService, NGXLogger],
    },

    // Warehouse Order Detail
    {
        provide: WarehouseOrderDetailDbService, useClass: WarehouseOrderDetailDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: WarehouseOrderDetailHttpService, useClass: WarehouseOrderDetailHttpService,
        deps: [HttpClient, NGXLogger, WarehouseDbService],
    },
    {
        provide: WarehouseOrderDetailDatasource, useClass: WarehouseOrderDetailDatasource,
        deps: [WarehouseOrderDetailHttpService, WarehouseOrderDetailDbService, NGXLogger],
    },

    // Warehouse Item
    {
        provide: WarehouseItemDbService, useClass: WarehouseItemDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: WarehouseItemHttpService, useClass: WarehouseItemHttpService,
        deps: [HttpClient, NGXLogger, WarehouseDbService],
    },
    {
        provide: WarehouseItemDatasource, useClass: WarehouseItemDatasource,
        deps: [WarehouseItemHttpService, WarehouseItemDbService, NGXLogger],
    },

    // Warehouse Inventory
    {
        provide: WarehouseInventoryDbService, useClass: WarehouseInventoryDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: WarehouseInventoryHttpService, useClass: WarehouseInventoryHttpService,
        deps: [HttpClient, NGXLogger, WarehouseDbService],
    },
    {
        provide: WarehouseInventoryDatasource, useClass: WarehouseInventoryDatasource,
        deps: [WarehouseInventoryHttpService, WarehouseInventoryDbService, NGXLogger],
    },

    // Warehouse Inventory Detail
    {
        provide: WarehouseInventoryDetailDbService, useClass: WarehouseInventoryDetailDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: WarehouseInventoryDetailHttpService, useClass: WarehouseInventoryDetailHttpService,
        deps: [HttpClient, NGXLogger, WarehouseDbService],
    },
    {
        provide: WarehouseInventoryDetailDatasource, useClass: WarehouseInventoryDetailDatasource,
        deps: [WarehouseInventoryDetailHttpService, WarehouseInventoryDetailDbService, NGXLogger],
    },

    // Warehouse Category
    {
        provide: WarehouseCategoryDbService, useClass: WarehouseCategoryDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: WarehouseCategoryHttpService, useClass: WarehouseCategoryHttpService,
        deps: [HttpClient, NGXLogger, WarehouseDbService],
    },
    {
        provide: WarehouseCategoryDatasource, useClass: WarehouseCategoryDatasource,
        deps: [WarehouseCategoryHttpService, WarehouseCategoryDbService, NGXLogger],
    },

    // Warehouse Adjust
    {
        provide: WarehouseAdjustDbService, useClass: WarehouseAdjustDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: WarehouseAdjustHttpService, useClass: WarehouseAdjustHttpService,
        deps: [HttpClient, NGXLogger, WarehouseDbService],
    },
    {
        provide: WarehouseAdjustDatasource, useClass: WarehouseAdjustDatasource,
        deps: [WarehouseAdjustHttpService, WarehouseAdjustDbService, NGXLogger],
    },

    // Warehouse Adjust Detail
    {
        provide: WarehouseAdjustDetailDbService, useClass: WarehouseAdjustDetailDbService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: WarehouseAdjustDetailHttpService, useClass: WarehouseAdjustDetailHttpService,
        deps: [HttpClient, NGXLogger, WarehouseDbService],
    },
    {
        provide: WarehouseAdjustDetailDatasource, useClass: WarehouseAdjustDetailDatasource,
        deps: [WarehouseAdjustDetailHttpService, WarehouseAdjustDetailDbService, NGXLogger],
    },
];

export const MenuProviders: StaticProvider[] = [
    {
        provide: MenuService, useClass: MenuService,
        deps: [NgxIndexedDBService, NGXLogger, ConnectionService],
    },
    {
        provide: PagesGuard, useClass: PagesGuard,
        deps: [ModuleService, Router, ToastrService, TranslateService, NGXLogger],
    },
];

export const ExampleProviders: StaticProvider[] = [
    {provide: EmptyService, useClass: EmptyService, deps: [NgxIndexedDBService, NGXLogger, ConnectionService]},
];

export const Providers: StaticProvider[] = CommonProviders
    .concat(InterceptorProviders)
    .concat(ThirdPartyApiProviders)
    .concat(AuthenticationProviders)
    .concat(I18NProviders)
    .concat(OrganizationProviders)
    .concat(UserProviders)
    .concat(CustomerProviders)
    .concat(CountryProviders)
    .concat(WarehouseProviders)
    .concat(MenuProviders)
    .concat(ExampleProviders);
