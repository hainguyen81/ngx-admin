import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, Input,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {Constants as CommonConstants} from '../../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import STATUS = CommonConstants.COMMON.STATUS;
import {$enum} from 'ts-enum-util';
import {DefaultNgxSelectOptions, INgxSelectOptions} from '../../../../select/abstract.select.component';
import {
    AppModuleDataIndexSettingsFormlySelectFieldComponent,
} from '../../../components/common/app.module.data.index.formly.select.field.component';
import {IWarehouseBatchNo} from '../../../../../../@core/data/warehouse/warehouse.batch.no';
import {
    WarehouseBatchNoDatasource,
} from '../../../../../../services/implementation/warehouse/warehouse.batchno/warehouse.batchno.datasource';
import {NgOption} from '@ng-select/ng-select';
import {isNullOrUndefined} from 'util';

export const WarehouseBatchNoNgxSelectOptions: INgxSelectOptions =
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
        enableImage: false,
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
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_BATCH,
    selector: 'ngx-select-2-app-module-warehouse-batch-no',
    templateUrl: '../../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../../formly/formly.select.field.component.scss'],
})
export class WarehouseBatchNoFormlySelectFieldComponent
    extends AppModuleDataIndexSettingsFormlySelectFieldComponent<IWarehouseBatchNo, WarehouseBatchNoDatasource> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _disabledValues: any[];

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
        { [key: string]: (model: IWarehouseBatchNo) => (string | string[] | IWarehouseBatchNo) } | null {
        return {
            'text': (model: IWarehouseBatchNo) => {
                return (model && model.exp_date.length
                    ? [model.exp_date, ' - ', model.name, ' (', model.code, ')'].join('')
                    : model && model.name ? [model.name, ' (', model.code, ')'].join('') : '');
            },
        };
    }

    @Input('disabledValues') get disabledValues(): any[] {
        return this._disabledValues;
    }

    set disabledValues(_disabledValues: any[]) {
        this._disabledValues = _disabledValues;
        this.setDisabledValues(_disabledValues);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseBatchNoFormlySelectFieldComponent} class
     * @param dataSource {WarehouseBatchNoDatasource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(WarehouseBatchNoDatasource) dataSource: WarehouseBatchNoDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef,
            WarehouseBatchNoNgxSelectOptions);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Apply disable items by disabled values
     * @param values to disable
     */
    public setDisabledValues(values: any[]): void {
        if (isNullOrUndefined(this.selectComponent) || !(this.items || []).length) return;
        this.selectComponent.setDisabledItemsByValues(values);
    }
}
