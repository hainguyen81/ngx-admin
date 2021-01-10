import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {IModel} from '../../../../../@core/data/base';
import {DataSource} from '@app/types/index';
import {
    AppModuleDataFormlySelectExFieldComponent,
} from './app.module.data.formly.select.ex.field.component';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {IDbService, IHttpService} from '../../../../../services/common/interface.service';
import {BaseDataSource} from '../../../../../services/common/datasource.service';
import {Observable, throwError} from 'rxjs';
import ObjectUtils from '../../../../../utils/common/object.utils';

/**
 * Custom module data formly field for selecting special
 */
@Component({
    selector: 'ngx-select-ex-app-module-data-index',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class AppModuleDataIndexSettingsFormlySelectExFieldComponent<
    M extends IModel, D extends BaseDataSource<M, IHttpService<M>, IDbService<M>>>
    extends AppModuleDataFormlySelectExFieldComponent<M, D> {

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
     * Create a new instance of {AppModuleDataIndexSettingsFormlySelectExFieldComponent} class
     * @param dataSource {DataSource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(DataSource) dataSource: D,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected loadData(): Observable<M[] | M> | Promise<M[] | M> | M[] | M {
        const optionBuilder: { [key: string]: (model: M) => string | string[] | M } | null = this.optionBuilder;
        const useFilter: boolean = this.useDataFilter;
        const needToFilter: boolean = ((this.dataIndexName || '').length && ObjectUtils.isNotNou(this.dataIndexKey));
        if (useFilter && !needToFilter) {
            if (ObjectUtils.isNou(this.noneOption)) {
                return undefined;
            } else {
                return [this.noneOption];
            }

        } else if (!useFilter && !needToFilter) {
            if (ObjectUtils.isNotNou(optionBuilder)) {
                return SystemDataUtils.invokeAllModelsAsSelectOptions(
                    this.dataSource, this.translateService, optionBuilder);

            } else {
                return SystemDataUtils.invokeAllModelsAsDefaultSelectOptions(
                    this.dataSource, this.translateService);
            }

        } else if (useFilter && needToFilter) {
            if (ObjectUtils.isNotNou(optionBuilder)) {
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
