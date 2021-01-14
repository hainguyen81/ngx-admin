import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnInit, Renderer2, ViewContainerRef,} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {DefaultNgxSelectExOptions} from '../../../../select-ex/abstract.select.ex.component';
import {Constants as CommonConstants} from '../../../../../../@core/data/constants/common.constants';
import {IWarehouseBatchNo} from '../../../../../../@core/data/warehouse/warehouse.batch.no';
import {WarehouseBatchNoDatasource,} from '../../../../../../services/implementation/warehouse/warehouse.batchno/warehouse.batchno.datasource';
import {INgxSelectOptions} from '../../../../select/abstract.select.component';
import {AppModuleDataIndexSettingsFormlySelectFieldComponent,} from '../../../components/common/app.module.data.index.formly.select.field.component';

export const WarehouseSettingsBatchNgxSelectOptions: INgxSelectOptions =
    Object.assign({}, DefaultNgxSelectExOptions, {
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
    });

/**
 * Custom module formly field for selecting warehouse settings batch
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_SETTINGS_BATCH,
    selector: 'ngx-select-2-app-module-warehouse-settings-batch',
    templateUrl: '../../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../../formly/formly.select.field.component.scss'],
})
export class WarehouseSettingsBatchFormlySelectFieldComponent
    extends AppModuleDataIndexSettingsFormlySelectFieldComponent<IWarehouseBatchNo, WarehouseBatchNoDatasource>
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get dataIndexName(): string {
        return '';
    }

    protected get dataIndexKey(): IDBKeyRange {
        return undefined;
    }

    protected get useDataFilter(): boolean {
        return false;
    }

    protected get optionBuilder():
        { [key: string]: (model: IWarehouseBatchNo) => (string | string[] | IWarehouseBatchNo) } | null {
        return {
            'text': (model: IWarehouseBatchNo) => {
                return (model ? [model.code, model.exp_date].join(' - ') : '');
            },
        };
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseSettingsBatchFormlySelectFieldComponent} class
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
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        this.config = WarehouseSettingsBatchNgxSelectOptions;
    }
}
