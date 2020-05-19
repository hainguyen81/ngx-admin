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
import {Constants as CommonConstants} from '../../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {DefaultNgxSelectOptions, INgxSelectOptions} from '../../../../select/abstract.select.component';
import {
    AppModuleDataIndexSettingsFormlySelectFieldComponent,
} from '../../../components/common/app.module.data.index.formly.select.field.component';
import {IWarehouse} from '../../../../../../@core/data/warehouse/warehouse';
import {WarehouseDatasource} from '../../../../../../services/implementation/warehouse/warehouse.storage/warehouse.datasource';

export const WarehouseStorageNgxSelectOptions: INgxSelectOptions =
    Object.assign({}, DefaultNgxSelectOptions, {
        /**
         * Provide an opportunity to change the name an id property of objects in the items
         * {string}
         */
        bindValue: 'code',
        /**
         * Provide an opportunity to change the name a text property of objects in the items
         * {string}
         */
        bindLabel: 'text',
        /**
         * Specify whether using image for option
         * {boolean}
         */
        enableImage: true,
        /**
         * Object property to use for image.
         * Default `image`
         */
        bindImage: 'image',
        /**
         * Specify whether appending options drop-down to body
         * {boolean}
         */
        appendTo: 'body',
    });

/**
 * Custom module formly field for selecting warehouse items
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_STORAGE,
    selector: 'ngx-select-2-app-module-warehouse-storage',
    templateUrl: '../../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../../formly/formly.select.field.component.scss'],
})
export class WarehouseStorageFormlySelectFieldComponent
    extends AppModuleDataIndexSettingsFormlySelectFieldComponent<IWarehouse, WarehouseDatasource> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get dataIndexName(): string {
        return undefined;
    }

    protected get dataIndexKey(): IDBKeyRange {
        return undefined;
    }

    protected get useDataFilter(): boolean {
        return false;
    }

    protected get optionBuilder():
        { [key: string]: (model: IWarehouse) => (string | string[] | IWarehouse) } | null {
        return {
            'text': (model: IWarehouse) => {
                return (model && model.code.length ? [model.name, ' (', model.code, ')'].join('') : '');
            },
        };
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseStorageFormlySelectFieldComponent} class
     * @param dataSource {WarehouseDatasource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(WarehouseDatasource) dataSource: WarehouseDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef,
            WarehouseStorageNgxSelectOptions);
    }
}