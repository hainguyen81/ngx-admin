import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    forwardRef,
    Inject,
    OnInit,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {Constants} from '../../../../../../@core/data/constants/common.constants';
import MODULE_CODES = Constants.COMMON.MODULE_CODES;
import {AbstractCellEditor} from '../../../../smart-table/abstract.cell.editor';
import ComponentUtils from '../../../../../../utils/component.utils';
import {CellComponent} from 'ng2-smart-table/components/cell/cell.component';
import {IEvent} from '../../../../abstract.component';
import {isNullOrUndefined, isNumber} from 'util';
import {
    WarehouseBatchNoFormlySelectFieldComponent,
} from '../batchno/warehouse.batch.select.field.component';
import {IWarehouseBatchNo} from '../../../../../../@core/data/warehouse/warehouse.batch.no';
import {$enum} from 'ts-enum-util';
import STATUS = Constants.COMMON.STATUS;
import {
    IWarehouseInventoryDetailBatch,
} from '../../../../../../@core/data/warehouse/extension/warehouse.inventory.detail.batch';
import {MatInput} from '@angular/material/input';
import {
    WarehouseBatchNoDatasource,
} from '../../../../../../services/implementation/warehouse/warehouse.batchno/warehouse.batchno.datasource';

/**
 * Smart table warehouse batch cell component base on {DefaultEditor}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-smart-table-warehouse-inventory-batch-no-cell',
    templateUrl: './warehouse.inventory.detail.batch.cell.component.html',
    styleUrls: ['./warehouse.inventory.detail.batch.cell.component.scss'],
})
export class WarehouseInventoryDetailBatchNoCellComponent extends AbstractCellEditor
    implements OnInit, AfterViewInit {

    private static DB_BATCH_NO_STATUS_INDEX = 'status';
    private static DB_BATCH_NO_STATUS_KEYRANGE = IDBKeyRange.only($enum(STATUS).getKeyOrThrow(STATUS.ACTIVATED));

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(WarehouseBatchNoFormlySelectFieldComponent)
    private readonly querySelectComponent: QueryList<WarehouseBatchNoFormlySelectFieldComponent>;
    private _selectComponents: WarehouseBatchNoFormlySelectFieldComponent[];
    @ViewChildren(MatInput)
    private readonly queryInputComponent: QueryList<MatInput>;
    private _inputComponents: MatInput[];

    private _warehouseDetailBatches: IWarehouseInventoryDetailBatch[] = [];
    private _warehouseBatches: IWarehouseBatchNo[];

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get selectComponents(): WarehouseBatchNoFormlySelectFieldComponent[] {
        return this._selectComponents;
    }

    protected get inputComponents(): MatInput[] {
        return this._inputComponents;
    }

    get isEditable(): boolean {
        return true;
    }

    get warehouseDetailBatches(): IWarehouseInventoryDetailBatch[] {
        return this._warehouseDetailBatches;
    }

    get newCellValue(): IWarehouseInventoryDetailBatch[] {
        return super.newCellValue as IWarehouseInventoryDetailBatch[];
    }

    set newCellValue(_value: IWarehouseInventoryDetailBatch[]) {
        super.newCellValue = _value;
    }

    get selectedBatchCodes(): string[] {
        const batchCodes: string[] = [];
        (this.newCellValue || []).forEach(batch => {
            (batch.batch_code || '').length && batchCodes.push(batch.batch_code);
        });
        return (batchCodes.length ? batchCodes : undefined);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventoryDetailBatchNoCellComponent} class
     * @param _parentCell {CellComponent}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     * @param warehouseBatchNoDatasource {WarehouseBatchNoDatasource}
     */
    constructor(@Inject(forwardRef(() => CellComponent)) _parentCell: CellComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef,
                @Inject(WarehouseBatchNoDatasource) private warehouseBatchNoDatasource: WarehouseBatchNoDatasource) {
        super(_parentCell, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        if (!(this.newCellValue || []).length) {
            this.newCellValue = [];
        }

        // if need to add at least one row
        if (!this.viewMode && this.newCellValue.length < 1) this.addBatch();

        // observe batch no master
        this.warehouseBatchNoDatasource.getAllByIndex(
            WarehouseInventoryDetailBatchNoCellComponent.DB_BATCH_NO_STATUS_INDEX,
            WarehouseInventoryDetailBatchNoCellComponent.DB_BATCH_NO_STATUS_KEYRANGE)
            .then((batches: IWarehouseBatchNo[]) => {
                if (this.viewMode) {
                    this.__initialViewModeSelectItems(batches);

                } else {
                    this.__initialEditModeSelectItems(batches);
                }
            }, reason => this.logger.error(reason))
            .catch(reason => this.logger.error(reason));
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.viewMode) {
            if (!(this._selectComponents || []).length) {
                this._selectComponents = ComponentUtils.queryComponents(this.querySelectComponent);
            }
            if (!(this._inputComponents || []).length) {
                this._inputComponents = ComponentUtils.queryComponents(this.queryInputComponent);
            }
            this.__initializeEditMode();
        }
    }

    onSelect($event: IEvent, dataIndex: number): void {
        const batches: IWarehouseInventoryDetailBatch[] =
            this.newCellValue as IWarehouseInventoryDetailBatch[];
        const batch: IWarehouseInventoryDetailBatch =
            (0 <= dataIndex && dataIndex < batches.length ? batches[dataIndex] : undefined);
        const selBatch: IWarehouseBatchNo = $event.data as IWarehouseBatchNo;
        batch.batch = selBatch;
        batch.batch_id = (isNullOrUndefined(selBatch) ? undefined : selBatch.id);
        batch.batch_code = (isNullOrUndefined(selBatch) ? undefined : selBatch.code);
        batch.batch_name = (isNullOrUndefined(selBatch) ? undefined : selBatch.name);
        this.fireCellChanged({ data: batch });
    }

    /**
     * Raise when batch quantity amount has been changed
     * @param $event {IEvent} with data as {IWarehouseInventoryDetailBatch}
     */
    onQuantityChanged($event: IEvent): void {
        this.fireCellChanged($event);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Initialize edit mode
     * @private
     */
    private __initializeEditMode(): void {
        if (this.viewMode) return;

        const components: WarehouseBatchNoFormlySelectFieldComponent[] = this.selectComponents;
        const inputComponents: MatInput[] = this.inputComponents;
        for (const component of components) {
            const dataIndex: number = components.indexOf(component);
            const inputComponent: MatInput = inputComponents[dataIndex];
            component.onLoad.subscribe(e => {
                const batches: IWarehouseInventoryDetailBatch[] =
                    this.cellValue as IWarehouseInventoryDetailBatch[];
                const batch: IWarehouseInventoryDetailBatch = batches[dataIndex];
                if (!isNullOrUndefined(batch)) {
                    component.setSelectedValue(batch.batch_code);
                    inputComponent.value =
                        (isNumber(batch.quantity) ? batch.quantity.toString() : undefined);
                }
            });
        }
    }

    /**
     * Initialize select items for edit mode
     * @param batches master data to load
     * @private
     */
    private __initialEditModeSelectItems(batches: IWarehouseBatchNo[]): void {
        (this._warehouseBatches || []).clear();
        if (this.viewMode) return;

        // detect for master items
        this._warehouseBatches = [];
        (batches || []).forEach(batch => {
            batch['text'] = [batch.exp_date, ' - ', batch.name, ' (', batch.code, ')'].join('');
            this._warehouseBatches.push(batch);
        });

        // apply select items
        (this.selectComponents || []).forEach(component => component.items = this._warehouseBatches);
        this.detectChanges();
    }

    /**
     * Initialize select items for view mode
     * @param batches master data to load
     * @private
     */
    private __initialViewModeSelectItems(batches: IWarehouseBatchNo[]): void {
        this._warehouseDetailBatches.clear();
        if (!this.viewMode) return;

        (this.cellValue as IWarehouseInventoryDetailBatch[] || []).forEach(detailBatch => {
            const batch: IWarehouseBatchNo = (batches || []).find(b => {
                return (b.code === detailBatch.batch_code);
            });
            if (!isNullOrUndefined(batch)) {
                detailBatch.batch = batch;
                detailBatch.viewBatch = [detailBatch.batch_name, ' (', detailBatch.batch_code, ')'].join('');
                this._warehouseDetailBatches.push(detailBatch);
            }
        });
        this.detectChanges();
    }

    /**
     * Remove batch at the specified index
     * @param dataIndex to remove
     */
    public removeBatch(dataIndex: number): void {
        const batches: IWarehouseInventoryDetailBatch[] =
            this.newCellValue as IWarehouseInventoryDetailBatch[];
        if (0 <= dataIndex && dataIndex < (batches || []).length) {
            const deletedBatches: IWarehouseInventoryDetailBatch[] = batches.splice(dataIndex, 1);
            this.newCellValue = [].concat(batches);
            this.fireCellChanged({ data: (deletedBatches.length ? deletedBatches[0] : undefined) });
            this.detectChanges();
        }
    }

    /**
     * Add a new batch at the bottom position
     */
    public addBatch(): void {
        const newBatch: IWarehouseInventoryDetailBatch = {
            id: undefined,
            batch_id: undefined,
            batch_code: undefined,
            batch_name: undefined,
            batch: undefined,
            quantity: undefined,
        };
        this.newCellValue.push(newBatch);
        this.fireCellChanged({ data: newBatch });
    }
}
