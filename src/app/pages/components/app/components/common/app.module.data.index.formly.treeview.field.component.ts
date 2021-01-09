import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {IModel} from '../../../../../@core/data/base';
import {AppTreeviewI18n, TOKEN_APP_TREEVIEW_SHOW_ALL} from '../app.treeview.i18n';
import {TreeviewI18n} from 'ngx-treeview';
import {TranslateService} from '@ngx-translate/core';
import {BaseDataSource} from '../../../../../services/common/datasource.service';
import {IDbService, IHttpService} from '../../../../../services/common/interface.service';
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source';
import {NGXLogger} from 'ngx-logger';
import {Observable, throwError} from 'rxjs';
import {
    AppModuleDataFormlyTreeviewFieldComponent,
} from './app.module.data.formly.treeview.field.component';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import ObjectUtils from '../../../../../utils/common/object.utils';

/**
 * Custom formly field for selecting tree
 */
@Component({
    selector: 'ngx-formly-treeview-dropdown-app-module-data-index',
    templateUrl: '../../../formly/formly.treeview.dropdown.field.component.html',
    styleUrls: ['../../../formly/formly.treeview.dropdown.field.component.scss'],
    providers: [
        {
            provide: TOKEN_APP_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: AppTreeviewI18n,
            deps: [TranslateService, TOKEN_APP_TREEVIEW_SHOW_ALL],
        },
    ],
})
export class AppModuleDataIndexFormlyTreeviewFieldComponent<
    M extends IModel, D extends BaseDataSource<M, IHttpService<M>, IDbService<M>>>
    extends AppModuleDataFormlyTreeviewFieldComponent<M, D> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Define the database index name to query settings
     * TODO Children classes should override this property for filtering data
     * @return the database index name
     */
    protected get dataIndexName(): string {
        return null;
    }

    /**
     * Define the database index key to query settings
     * TODO Children classes should override this property for filtering data
     * @return the database index key
     */
    protected get dataIndexKey(): IDBKeyRange {
        return null;
    }

    /**
     * Specify whether using data index to filter
     * @return true for using index to filter if index valid; else false for selecting all if invalid index
     */
    protected get useDataFilter(): boolean {
        return true;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppModuleDataIndexFormlyTreeviewFieldComponent} class
     * @param _dataSource {DataSource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(DataSource) _dataSource: D,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    protected loadData(): Observable<M[] | M> | Promise<M[] | M> | M[] | M {
        const useFilter: boolean = this.useDataFilter;
        const needToFilter: boolean = ((this.dataIndexName || '').length && ObjectUtils.isNotNou(this.dataIndexKey));
        if (useFilter && !needToFilter) {
            return [];

        } else if (!useFilter && !needToFilter) {
            return SystemDataUtils.invokeAllModelsAsDefaultSelectOptions(this.dataSource, this.translateService);

        } else if (useFilter && needToFilter) {
            return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsDefaultSelectOptions(
                this.dataSource, this.dataIndexName, this.dataIndexKey, this.translateService);

        } else {
            throwError('Must define index to filter or define useDataFilter as false');
        }
    }
}
