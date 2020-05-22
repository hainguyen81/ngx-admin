import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef, forwardRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {Constants as CommonConstants} from '../../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import STATUS = CommonConstants.COMMON.STATUS;
import {IWarehouseItem} from '../../../../../../@core/data/warehouse/warehouse.item';
import {
    WarehouseItemDatasource,
} from '../../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {$enum} from 'ts-enum-util';
import {DefaultNgxSelectOptions, INgxSelectOptions} from '../../../../select/abstract.select.component';
import {
    AppModuleDataIndexSettingsFormlySelectFieldComponent,
} from '../../../components/common/app.module.data.index.formly.select.field.component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {WarehouseItemCellComponent} from './warehouse.item.cell.component';

export const WarehouseItemNgxSelectOptions: INgxSelectOptions =
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
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-select-2-app-module-warehouse-item',
    templateUrl: '../../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../../formly/formly.select.field.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => WarehouseItemCellComponent),
        multi: true,
    }],
})
export class WarehouseItemFormlySelectFieldComponent
    extends AppModuleDataIndexSettingsFormlySelectFieldComponent<IWarehouseItem, WarehouseItemDatasource> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get dataIndexName(): string {
        return 'status';
    }

    protected get dataIndexKey(): IDBKeyRange {
        return IDBKeyRange.only($enum(STATUS).getKeyOrThrow(STATUS.ACTIVATED));
    }

    protected get useDataFilter(): boolean {
        return true;
    }

    protected get optionBuilder():
        { [key: string]: (model: IWarehouseItem) => (string | string[] | IWarehouseItem) } | null {
        return {
            'text': (model: IWarehouseItem) => {
                return (model && model.code.length ? [model.name, ' (', model.code, ')'].join('') : '');
            },
        };
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemFormlySelectFieldComponent} class
     * @param dataSource {WarehouseItemDatasource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(WarehouseItemDatasource) dataSource: WarehouseItemDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef,
            WarehouseItemNgxSelectOptions);
    }
}
