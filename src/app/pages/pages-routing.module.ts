import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PagesComponent} from './pages.component';
import {NotFoundComponent} from './components/not-found.component';
import {CustomerSmartTableComponent} from './components/app/system/customer/customer.component';
import {UserSmartTableComponent} from './components/app/system/user/user.component';
import {OrganizationSplitPaneComponent} from './components/app/system/organization/organization.component';
import {PagesGuard} from './pages.guard.service';
import {WarehouseItemFlipcardComponent} from './components/app/warehouse/item/warehouse.item.flipcard.component';
import {WarehouseCategorySplitPaneComponent} from './components/app/warehouse/category/warehouse.category.component';
import {WarehouseStorageSplitPaneComponent} from './components/app/warehouse/storage/warehouse.storage.component';
import {WarehouseSettingsSmartTableComponent} from './components/app/warehouse/settings/warehouse.settings.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { ECommerceComponent } from './e-commerce/e-commerce.component';
// import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    canActivateChild: [PagesGuard],
    children: [{
        path: 'system',
        children: [
            {
                path: 'organization',
                component: OrganizationSplitPaneComponent,
            },
            {
                path: 'user',
                component: UserSmartTableComponent,
            },
            {
                path: 'customer',
                component: CustomerSmartTableComponent,
            },
            {
                path: '',
                redirectTo: 'organization',
                pathMatch: 'full',
            },
        ],
    }, {
        path: 'warehouse',
        children: [
            {
                path: 'settings',
                children: [
                    {
                        path: 'general',
                        component: WarehouseSettingsSmartTableComponent,
                    },
                    {
                        path: 'category',
                        component: WarehouseCategorySplitPaneComponent,
                    },
                    {
                        path: 'storage',
                        component: WarehouseStorageSplitPaneComponent,
                    },
                    {
                        path: '',
                        redirectTo: 'general',
                        pathMatch: 'full',
                    },
                ],
            },
            {
                path: 'features',
                children: [
                    {
                        path: 'item',
                        component: WarehouseItemFlipcardComponent,
                    },
                    {
                        path: '',
                        redirectTo: 'item',
                        pathMatch: 'full',
                    },
                ],
            },
        ],
    }, {
        path: '',
        redirectTo: 'system',
        pathMatch: 'full',
    }, {
        path: '**',
        component: NotFoundComponent,
    }],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}
