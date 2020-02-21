import {NgModule} from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbIconModule,
    NbInputModule, NbLayoutModule,
    NbSelectModule, NbThemeModule,
} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ContextMenuModule} from 'ngx-contextmenu';
import {CommonModule} from '@angular/common';
import {LoggerModule, NGXLogger} from 'ngx-logger';
import {AppConfig} from '../../../../../config/app.config';
import {TranslateModule} from '@ngx-translate/core';
import {TreeviewModule} from 'ngx-treeview';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AngularSplitModule} from 'angular-split';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {AngularResizedEventModule} from 'angular-resize-event';
import {AppMaterialModule} from '../../../../../app.material.module';
import { CategoriesTreeviewComponent } from './categories.treeview.component';
import { CategoriesFormlyComponent } from './categories.formly.component';
import { CategoriesDataSource } from '../../../../../services/implementation/categories/categories.datasource';
import { CategoriesHttpService, CategoriesDbService } from '../../../../../services/implementation/categories/categories.service';
import { CategoriesSplitPanelComponent } from './categories.component';
import {CategoryToolbarComponent} from './category.toolbar.component';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NbThemeModule,
        NbIconModule,
        NbCardModule,
        NbInputModule,
        NbCheckboxModule,
        NbSelectModule,
        NbButtonModule,
        NbLayoutModule,
        Ng2SmartTableModule,
        FormsModule,

        /* Angular material modules */
        AppMaterialModule,

        // Specify AngularResizedEventModule library as an import
        AngularResizedEventModule,

        /* i18n */
        TranslateModule,

        /* Context Menu */
        NbContextMenuModule,
        ContextMenuModule.forRoot({
            autoFocus: true,
            useBootstrap4: true,
        }),

        /* SplitPane */
        AngularSplitModule.forRoot(),

        /* Tree-view */
        TreeviewModule.forRoot(),

        /* Formly for form builder */
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        /**
         * - Bootstrap:    FormlyBootstrapModule
         * - Material2:    FormlyMaterialModule
         * - Ionic:        FormlyIonicModule
         * - PrimeNG:      FormlyPrimeNGModule
         * - Kendo:        FormlyKendoModule
         * - NativeScript: FormlyNativescriptModule
         */
        /*FormlyBootstrapModule,*/
        FormlyMaterialModule,

        /* Logger */
        LoggerModule.forRoot(AppConfig.COMMON.logConfig),
    ],
    entryComponents: [
        CategoriesTreeviewComponent,
        CategoriesFormlyComponent,
        CategoryToolbarComponent,
    ],
    declarations: [
        CategoriesTreeviewComponent,
        CategoriesFormlyComponent,
        CategoryToolbarComponent,
        CategoriesSplitPanelComponent,
    ],
    providers: [
        {
            provide: CategoriesDataSource, useClass: CategoriesDataSource,
            deps: [CategoriesHttpService, CategoriesDbService, NGXLogger],
        },
    ],
})
export class CategoriesModule {
}
