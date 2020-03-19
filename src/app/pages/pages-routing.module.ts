import { CategoriesSplitPanelComponent } from './components/app/system/catelogies/categories.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PagesComponent} from './pages.component';
import {NotFoundComponent} from './components/not-found.component';
import {CustomerSmartTableComponent} from './components/app/system/customer/customer.component';
import {UserSmartTableComponent} from './components/app/system/user/user.component';
import {OrganizationSplitPaneComponent} from './components/app/system/organization/organization.component';
import {PagesGuard} from './pages.guard.service';
import {WarehouseItemFlipcardComponent} from './components/app/system/warehouse-item/warehouse-item.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { ECommerceComponent } from './e-commerce/e-commerce.component';
// import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    canActivateChild: [PagesGuard],
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
            path: 'categories',
            component: CategoriesSplitPanelComponent,
        },
        {
            path: 'warehouse-item',
            component: WarehouseItemFlipcardComponent,
        },
        // {
        //   path: 'layout',
        //   loadChildren: () => import('./layout/layout.module')
        //     .then(m => m.LayoutModule),
        // },
        // {
        //   path: 'forms',
        //   loadChildren: () => import('./forms/forms.module')
        //     .then(m => m.FormsModule),
        // },
        // {
        //   path: 'ui-features',
        //   loadChildren: () => import('./ui-features/ui-features.module')
        //     .then(m => m.UiFeaturesModule),
        // },
        // {
        //   path: 'modal-overlays',
        //   loadChildren: () => import('./modal-overlays/modal-overlays.module')
        //     .then(m => m.ModalOverlaysModule),
        // },
        // {
        //   path: 'extra-components',
        //   loadChildren: () => import('./extra-components/extra-components.module')
        //     .then(m => m.ExtraComponentsModule),
        // },
        // {
        //   path: 'maps',
        //   loadChildren: () => import('./maps/maps.module')
        //     .then(m => m.MapsModule),
        // },
        // {
        //   path: 'charts',
        //   loadChildren: () => import('./charts/charts.module')
        //     .then(m => m.ChartsModule),
        // },
        // {
        //   path: 'editors',
        //   loadChildren: () => import('./editors/editors.module')
        //     .then(m => m.EditorsModule),
        // },
        // {
        //   path: 'tables',
        //   loadChildren: () => import('./tables/tables.module')
        //     .then(m => m.TablesModule),
        // },
        // {
        //   path: 'miscellaneous',
        //   loadChildren: () => import('./miscellaneous/miscellaneous.module')
        //     .then(m => m.MiscellaneousModule),
        // },
        {
            path: '',
            redirectTo: 'organization',
            pathMatch: 'full',
        },
        {
            path: '**',
            component: NotFoundComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}
