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
import {
    AppModuleDataIndexSettingsFormlySelectExFieldComponent,
} from '../../../components/common/app.module.data.index.formly.select.ex.field.component';
import {DefaultNgxSelectOptions, INgxSelectExOptions} from '../../../../select-ex/abstract.select.ex.component';
import {Constants, Constants as CommonConstants} from '../../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {IWarehouseItem} from '../../../../../../@core/data/warehouse/warehouse.item';
import {
    WarehouseItemDatasource,
} from '../../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {$enum} from 'ts-enum-util';
import STATUS = Constants.COMMON.STATUS;

export const WarehouseItemSelectOptions: INgxSelectExOptions =
    Object.assign({}, DefaultNgxSelectOptions, {
        /**
         * Provide an opportunity to change the name an id property of objects in the items
         * {string}
         */
        optionValueField: 'code',
        /**
         * Provide an opportunity to change the name a text property of objects in the items
         * {string}
         */
        optionTextField: 'text',
        /**
         * Specify whether using image for option
         * {boolean}
         */
        enableOptionImage: true,
        /**
         * Specify whether appending options drop-down to body
         * {boolean}
         */
        appendToBody: true,
    });

/**
 * Custom module formly field for selecting warehouse items
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_BATCH,
    selector: 'ngx-select-ex-app-module-warehouse-item',
    templateUrl: '../../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../../formly/formly.select.ex.field.component.scss'],
})
export class WarehouseItemFormlySelectExFieldComponent
    extends AppModuleDataIndexSettingsFormlySelectExFieldComponent<IWarehouseItem, WarehouseItemDatasource>
    implements OnInit {

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
     * Create a new instance of {WarehouseItemFormlySelectExFieldComponent} class
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
            WarehouseItemSelectOptions);
    }
}
