import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    forwardRef,
    Inject,
    OnDestroy,
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
import {BehaviorSubject} from 'rxjs';
import {
    WarehouseBatchNoFormlySelectFieldComponent,
} from '../batchno/warehouse.batch.select.field.component';
import {IWarehouseBatchNo} from '../../../../../../@core/data/warehouse/warehouse.batch.no';
import {
    WarehouseBatchNoDbService,
} from '../../../../../../services/implementation/warehouse/warehouse.batchno/warehouse.batchno.service';
import {$enum} from 'ts-enum-util';
import STATUS = Constants.COMMON.STATUS;
import {
    IWarehouseInventoryDetailBatch,
} from '../../../../../../@core/data/warehouse/extension/warehouse.inventory.detail.batch';
import {IdGenerators} from '../../../../../../config/generator.config';
import {MatInput} from '@angular/material/input';

/**
 * Smart table warehouse item cell component base on {DefaultEditor}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-smart-table-warehouse-inventory-batch-no-cell',
    templateUrl: './warehouse.inventory.detail.batch.cell.component.html',
    styleUrls: ['./warehouse.inventory.detail.batch.cell.component.scss'],
})
export class WarehouseInventoryDetailBatchNoCellComponent extends AbstractCellEditor
    implements OnInit, AfterViewInit, OnDestroy {

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

    private _warehouseBatchesBehavior: BehaviorSubject<any>;
    private _warehouseBatches: IWarehouseInventoryDetailBatch[] = [];

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

    get warehouseBatches(): IWarehouseInventoryDetailBatch[] {
        return this._warehouseBatches;
    }

    get newCellValue(): IWarehouseInventoryDetailBatch[] {
        return super.newCellValue as IWarehouseInventoryDetailBatch[];
    }

    set newCellValue(_value: IWarehouseInventoryDetailBatch[]) {
        super.newCellValue = _value;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {DatePickerCellComponent} class
     * @param _parentCell {CellComponent}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     * @param warehouseBatchNoDbService {WarehouseBatchNoDbService}
     */
    constructor(@Inject(forwardRef(() => CellComponent)) _parentCell: CellComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef,
                @Inject(WarehouseBatchNoDbService) private warehouseBatchNoDbService: WarehouseBatchNoDbService) {
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
    }

    ngAfterViewInit(): void {
        if (!(this._selectComponents || []).length && !this.viewMode) {
            this._selectComponents = ComponentUtils.queryComponents(this.querySelectComponent);
        }
        if (!(this._inputComponents || []).length && !this.viewMode) {
            this._inputComponents = ComponentUtils.queryComponents(this.queryInputComponent);
        }
        if (!this.viewMode) {
            this.__initializeEditMode();
        }

        if (this.viewMode) {
            this._warehouseBatchesBehavior = new BehaviorSubject<any>(this.cellValue);
            this._warehouseBatchesBehavior.subscribe(value => {
                this.__observeCellValue(value);
            });
        }
    }

    ngOnDestroy(): void {
        this._warehouseBatchesBehavior
        && this._warehouseBatchesBehavior.unsubscribe();
        super.ngOnDestroy();
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
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Initialize edit mode
     * @private
     */
    private __initializeEditMode(): void {
        const components: WarehouseBatchNoFormlySelectFieldComponent[] = this.selectComponents;
        const inputComponents: MatInput[] = this.inputComponents;
        const batches: IWarehouseInventoryDetailBatch[] =
            this.cellValue as IWarehouseInventoryDetailBatch[];
        for (const component of components) {
            const dataIndex: number = components.indexOf(component);
            const inputComponent: MatInput = inputComponents[dataIndex];
            component.onLoad.subscribe(e => {
                const batch: IWarehouseInventoryDetailBatch = batches[dataIndex];
                if (!isNullOrUndefined(batch)) {
                    component.setSelectedValue(batch.batch_code);
                    inputComponent.value =
                        (isNumber(batch.quantity) ? batch.quantity.toString() : undefined);
                }
            });
            component.refresh();
        }
    }

    /**
     * Observe cell value to view
     * @param value to observe
     * @private
     */
    private __observeCellValue(value: any): void {
        if ((!(this._warehouseBatches || []).length
            || (Array.from(value || []).length !== (this._warehouseBatches || []).length))
            && !isNullOrUndefined(value) && Array.from(value || []).length
            && this.viewMode) {
            const batches: { batch_id: string; batch_code: string; quantity?: number | 0 }[] =
                (Array.from(value || []).length
                    ? Array.from(value) as { batch_id: string; batch_code: string; quantity?: number | 0 }[] : []);
            const batchCodes: string[] = [];
            batches.forEach(batch => batch && (batch.batch_code || '').length && batchCodes.push(batch.batch_code));
            this._warehouseBatches.clear();
            batches.length && this.__loadBatchesToView(batches, batchCodes);
        }
    }

    /**
     * Load batches to view
     * @param batches to load
     * @param batchCodes to check
     * @private
     */
    private __loadBatchesToView(batches: {
        batch_id: string;
        batch_code: string;
        quantity?: number | 0
    }[], batchCodes: string[]): void {
        this.warehouseBatchNoDbService.openCursorByIndex(
            WarehouseInventoryDetailBatchNoCellComponent.DB_BATCH_NO_STATUS_INDEX,
            WarehouseInventoryDetailBatchNoCellComponent.DB_BATCH_NO_STATUS_KEYRANGE,
            (event: Event) => {
                const cursor = (<any>event.target).result;
                if (cursor) {
                    const batch: IWarehouseBatchNo = cursor.value as IWarehouseBatchNo;
                    this.__mapBatchToView(batch, batches, batchCodes);
                    cursor.continue();
                }
            }).then(() => this.changeDetectorRef.detectChanges(),
            reason => this.logger.error(reason))
            .catch(reason => this.logger.error(reason));
    }

    /**
     * Map the data batch record to view
     * @param batch {IWarehouseBatchNo} record
     * @param batches to load
     * @param batchCodes to check
     * @private
     */
    private __mapBatchToView(batch: IWarehouseBatchNo,
                             batches: { batch_id: string; batch_code: string; quantity?: number | 0 }[],
                             batchCodes: string[]): void {
        if (batchCodes.indexOf(batch.code || '') >= 0) {
            const batchIdx: number = batchCodes.indexOf(batch.code || '');
            this._warehouseBatches.push(
                WarehouseInventoryDetailBatchNoCellComponent
                    .__buildViewBatch(batch, batches[batchIdx]));
        }
    }

    /**
     * Build {IWarehouseInventoryDetailBatch} to view
     * @param batch to build
     * @param batchDetail to build
     * @private
     */
    private static __buildViewBatch(batch: IWarehouseBatchNo,
                                    batchDetail: { batch_id: string; batch_code: string; quantity?: number | 0 }):
        IWarehouseInventoryDetailBatch {
        return {
            id: IdGenerators.oid.generate(),
            batch: batch,
            batch_id: batch.id,
            batch_code: batch.code,
            batch_name: batch.name,
            viewBatch: [batch.name, ' (', batch.code, ')'].join(''),
            quantity: batchDetail.quantity || 0,
        } as IWarehouseInventoryDetailBatch;
    }

    /**
     * Remove batch at the specified index
     * @param dataIndex to remove
     */
    public removeBatch(dataIndex: number): void {
        const batches: IWarehouseInventoryDetailBatch[] =
            this.newCellValue as IWarehouseInventoryDetailBatch[];
        if (0 <= dataIndex && dataIndex < (batches || []).length) {
            batches.splice(dataIndex, 1);
        }
    }

    /**
     * Add a new batch at the bottom position
     */
    public addBatch(): void {
        this.newCellValue.push({
            id: undefined,
            batch_id: undefined,
            batch_code: undefined,
            batch_name: undefined,
            batch: undefined,
            quantity: undefined,
        });
    }
}
