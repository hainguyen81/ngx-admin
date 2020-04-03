import {ErrorHandler, Injector, LOCALE_ID, StaticProvider} from '@angular/core';
import {APP_BASE_HREF, DatePipe} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpBackend, HttpClient, HttpXhrBackend} from '@angular/common/http';
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
} from '../auth/auth.interceptor';
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
import {Meta, Title} from '@angular/platform-browser';
import PageHeaderService from '../services/header.service';
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

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    http || throwError('Not found HttpClient to create TranslateHttpLoader');
    return new TranslateHttpLoader(http);
}

export const CommonProviders: StaticProvider[] = [
    {provide: APP_BASE_HREF, useValue: environment.baseHref},
    {provide: SW_VAPID_PUBLIC_KEY, useValue: COMMON.sw.vapid_public_key},
    {provide: LOCALE_ID, useValue: 'vi'},
    {provide: DatePipe, useClass: DatePipe, deps: []},
    {provide: HttpBackend, useExisting: HttpXhrBackend, deps: []},
    {provide: NGXMapperService, useClass: NGXMapperService, deps: [HttpBackend]},
    {provide: NGXLoggerHttpService, useClass: NGXLoggerHttpService, deps: [HttpBackend]},
    {provide: HttpClient, useClass: HttpClient, deps: [HttpBackend]},
    {provide: DataSource, useClass: LocalDataSource, deps: []},
    {provide: ContextMenuService, useClass: ContextMenuService, deps: []},
    {provide: ConnectionService, useClass: ConnectionService, deps: []},
    {
        provide: ErrorHandler, useClass: GlobalErrorsHandler,
        deps: [TranslateService, ToastrService, NGXLogger, Injector],
    },
];

export const I18NProviders: StaticProvider[] = [
    {
        provide: TranslateLoader, useFactory: HttpLoaderFactory,
        deps: [HttpClient],
    },
    {
        provide: PageHeaderService, useClass: PageHeaderService,
        deps: [Title, Meta, NGXLogger, TranslateService],
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

export const InterceptorProviders = [
    {provide: NB_AUTH_INTERCEPTOR_HEADER, useValue: 'Authorization'},
    {provide: NBX_AUTH_INTERCEPTOR_COMPANY_HEADER, useValue: 'Company'},
    {provide: NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM, useValue: 'access_token'},
    {
        provide: HTTP_INTERCEPTORS, useClass: NbxAuthInterceptor, multi: true,
        deps: [Injector, NB_AUTH_INTERCEPTOR_HEADER,
            NBX_AUTH_INTERCEPTOR_COMPANY_HEADER,
            NBX_AUTH_INTERCEPTOR_ACCESS_TOKEN_PARAM],
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
    .concat(I18NProviders)
    .concat(OrganizationProviders)
    .concat(UserProviders)
    .concat(CustomerProviders)
    .concat(WarehouseProviders)
    .concat(InterceptorProviders)
    .concat(AuthenticationProviders)
    .concat(MenuProviders)
    .concat(ExampleProviders);
