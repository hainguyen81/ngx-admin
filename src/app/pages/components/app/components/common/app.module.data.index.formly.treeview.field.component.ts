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
import {BaseDataSource} from '../../../../../services/datasource.service';
import {IDbService, IHttpService} from '../../../../../services/interface.service';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';
import {isNullOrUndefined} from 'util';
import {
    AppModuleDataFormlyTreeviewFieldComponent,
} from './app.module.data.formly.treeview.field.component';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';

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
export abstract class AppModuleDataIndexFormlyTreeviewFieldComponent<
    M extends IModel, D extends BaseDataSource<M, IHttpService<M>, IDbService<M>>>
    extends AppModuleDataFormlyTreeviewFieldComponent<M, D> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Define the database index name to query settings
     * @return the database index name
     */
    protected abstract get dataIndexName(): string
    /**
     * Define the database index key to query settings
     * @return the database index key
     */
    protected abstract get dataIndexKey(): IDBKeyRange;

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
    protected constructor(@Inject(DataSource) _dataSource: D,
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
        if (!(this.dataIndexName || '').length || isNullOrUndefined(this.dataIndexKey)) {
            return [];

        } else {
            return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsDefaultSelectOptions(
                this.dataSource, this.dataIndexName, this.dataIndexKey, this.translateService);
        }
    }
}
