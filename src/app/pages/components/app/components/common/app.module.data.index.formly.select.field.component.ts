import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {IModel} from '../../../../../@core/data/base';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {IDbService, IHttpService} from '../../../../../services/interface.service';
import {BaseDataSource} from '../../../../../services/datasource.service';
import {Observable, throwError} from 'rxjs';
import {isNullOrUndefined} from 'util';
import {INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {AppModuleDataFormlySelectFieldComponent} from './app.module.data.formly.select.field.component';
import {INgxSelectOptions} from '../../../select/abstract.select.component';

/**
 * Custom module data formly field for selecting special
 */
@Component({
    selector: 'ngx-select-2-app-module-data-index',
    templateUrl: '../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../formly/formly.select.field.component.scss'],
})
export abstract class AppModuleDataIndexSettingsFormlySelectFieldComponent<
    M extends IModel, D extends BaseDataSource<M, IHttpService<M>, IDbService<M>>>
    extends AppModuleDataFormlySelectFieldComponent<M, D>
    implements OnInit {

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

    /**
     * Specify whether using data index to filter
     * @return true for using index to filter if index valid; else false for selecting all if invalid index
     */
    protected get useDataFilter(): boolean {
        return true;
    }

    /**
     * Define the function to build more option properties/keys if necessary
     * @return null or undefined to ignore
     */
    protected get optionBuilder(): { [key: string]: (model: M) => string | string[] | M } | null {
        return undefined;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppModuleDataIndexSettingsFormlySelectFieldComponent} class
     * @param dataSource {DataSource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     * @param _config {INgxSelectExOptions}
     */
    protected constructor(@Inject(DataSource) dataSource: D,
                          @Inject(TranslateService) _translateService: TranslateService,
                          @Inject(Renderer2) _renderer: Renderer2,
                          @Inject(NGXLogger) _logger: NGXLogger,
                          @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                          @Inject(ElementRef) _elementRef: ElementRef,
                          _config?: INgxSelectOptions | null) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef, _config);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected loadData(): Observable<M[] | M> | Promise<M[] | M> | M[] | M {
        const optionBuilder: { [key: string]: (model: M) => string | string[] | M } | null = this.optionBuilder;
        const useFilter: boolean = this.useDataFilter;
        const needToFilter: boolean = ((this.dataIndexName || '').length && !isNullOrUndefined(this.dataIndexKey));
        if (useFilter && !needToFilter) {
            if (isNullOrUndefined(this.noneOption)) {
                return undefined;
            } else {
                return [this.noneOption];
            }

        } else if (!useFilter && !needToFilter) {
            if (!isNullOrUndefined(optionBuilder)) {
                return SystemDataUtils.invokeAllModelsAsSelectOptions(
                    this.dataSource, this.translateService, optionBuilder);

            } else {
                return SystemDataUtils.invokeAllModelsAsDefaultSelectOptions(
                    this.dataSource, this.translateService);
            }

        } else if (useFilter && needToFilter) {
            if (!isNullOrUndefined(optionBuilder)) {
                return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsSelectOptions(
                    this.dataSource,
                    this.dataIndexName, this.dataIndexKey,
                    this.translateService, optionBuilder);

            } else {
                return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsDefaultSelectOptions(
                    this.dataSource,
                    this.dataIndexName, this.dataIndexKey,
                    this.translateService);
            }

        } else {
            throwError('Must define index to filter or define useDataFilter as false');
        }
    }
}