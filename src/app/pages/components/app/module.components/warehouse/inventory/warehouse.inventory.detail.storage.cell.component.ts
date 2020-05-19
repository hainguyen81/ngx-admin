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
    WarehouseBatchNoDbService,
} from '../../../../../../services/implementation/warehouse/warehouse.batchno/warehouse.batchno.service';
import {IdGenerators} from '../../../../../../config/generator.config';
import {MatInput} from '@angular/material/input';
import {
    WarehouseStorageFormlySelectFieldComponent,
} from '../storage/warehouse.storage.select.field.component';
import {IWarehouse} from '../../../../../../@core/data/warehouse/warehouse';
import {
    IWarehouseInventoryDetailStorage,
} from '../../../../../../@core/data/warehouse/extension/warehouse.inventory.detail.storage';
import {
    WarehouseDatasource,
} from '../../../../../../services/implementation/warehouse/warehouse.storage/warehouse.datasource';
import PromiseUtils from '../../../../../../utils/promise.utils';

/**
 * Smart table warehouse batch cell component base on {DefaultEditor}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_STORAGE,
    selector: 'ngx-smart-table-warehouse-inventory-storage-cell',
    templateUrl: './warehouse.inventory.detail.storage.cell.component.html',
    styleUrls: ['./warehouse.inventory.detail.storage.cell.component.scss'],
})
export class WarehouseInventoryDetailStorageCellComponent extends AbstractCellEditor
    implements OnInit, AfterViewInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(WarehouseStorageFormlySelectFieldComponent)
    private readonly querySelectComponent: QueryList<WarehouseStorageFormlySelectFieldComponent>;
    private _selectComponents: WarehouseStorageFormlySelectFieldComponent[];
    @ViewChildren(MatInput)
    private readonly queryInputComponent: QueryList<MatInput>;
    private _inputComponents: MatInput[];

    private _warehouseStoragesBehavior: BehaviorSubject<any>;
    private _warehouseStorages: IWarehouseInventoryDetailStorage[] = [];

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get selectComponents(): WarehouseStorageFormlySelectFieldComponent[] {
        return this._selectComponents;
    }

    protected get inputComponents(): MatInput[] {
        return this._inputComponents;
    }

    get isEditable(): boolean {
        return true;
    }

    get warehouseStorages(): IWarehouseInventoryDetailStorage[] {
        return this._warehouseStorages;
    }

    get newCellValue(): IWarehouseInventoryDetailStorage[] {
        return super.newCellValue as IWarehouseInventoryDetailStorage[];
    }

    set newCellValue(_value: IWarehouseInventoryDetailStorage[]) {
        super.newCellValue = _value;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventoryDetailStorageCellComponent} class
     * @param _parentCell {CellComponent}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     * @param warehouseDbService {WarehouseBatchNoDbService}
     */
    constructor(@Inject(forwardRef(() => CellComponent)) _parentCell: CellComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef,
                @Inject(WarehouseDatasource) private warehouseDbService: WarehouseDatasource) {
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
        if (!this.viewMode && this.newCellValue.length < 1) this.addStorage();
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
            this._warehouseStoragesBehavior = new BehaviorSubject<any>(this.cellValue);
            this._warehouseStoragesBehavior.subscribe(value => {
                this.__observeCellValue(value);
            });
        }
    }

    ngOnDestroy(): void {
        PromiseUtils.unsubscribe(this._warehouseStoragesBehavior);
        super.ngOnDestroy();
    }

    onSelect($event: IEvent, dataIndex: number): void {
        const storages: IWarehouseInventoryDetailStorage[] =
            this.newCellValue as IWarehouseInventoryDetailStorage[];
        const storage: IWarehouseInventoryDetailStorage =
            (0 <= dataIndex && dataIndex < storages.length ? storages[dataIndex] : undefined);
        const selStorage: IWarehouse = $event.data as IWarehouse;
        storage.storage = selStorage;
        storage.storage_id = (isNullOrUndefined(selStorage) ? undefined : selStorage.id);
        storage.storage_code = (isNullOrUndefined(selStorage) ? undefined : selStorage.code);
        storage.storage_name = (isNullOrUndefined(selStorage) ? undefined : selStorage.name);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Initialize edit mode
     * @private
     */
    private __initializeEditMode(): void {
        const components: WarehouseStorageFormlySelectFieldComponent[] = this.selectComponents;
        const inputComponents: MatInput[] = this.inputComponents;
        const storages: IWarehouseInventoryDetailStorage[] =
            this.cellValue as IWarehouseInventoryDetailStorage[];
        for (const component of components) {
            const dataIndex: number = components.indexOf(component);
            const inputComponent: MatInput = inputComponents[dataIndex];
            component.onLoad.subscribe(e => {
                const storage: IWarehouseInventoryDetailStorage = storages[dataIndex];
                if (!isNullOrUndefined(storage)) {
                    component.setSelectedValue(storage.storage_code);
                    inputComponent.value = (isNumber(storage.quantity) ? storage.quantity.toString() : undefined);
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
        if ((!(this._warehouseStorages || []).length
            || (Array.from(value || []).length !== (this._warehouseStorages || []).length))
            && !isNullOrUndefined(value) && Array.from(value || []).length
            && this.viewMode) {
            const storages: { storage_id: string; storage_code: string; quantity?: number | 0 }[] =
                (Array.from(value || []).length
                    ? Array.from(value) as { storage_id: string; storage_code: string; quantity?: number | 0 }[] : []);
            const storageCodes: string[] = [];
            storages.forEach(storage => storage && (storage.storage_code || '').length
                && storageCodes.push(storage.storage_code));
            this._warehouseStorages.clear();
            storages.length && this.__loadStoragesToView(storages, storageCodes);
        }
    }

    /**
     * Load storages to view
     * @param storages to load
     * @param storageCodes to check
     * @private
     */
    private __loadStoragesToView(storages: { storage_id: string; storage_code: string; quantity?: number | 0 }[],
                                 storageCodes: string[]): void {
        this.warehouseDbService.getAll()
            .then((dataStorages: IWarehouse[]) => {
                (dataStorages || []).forEach(storage => {
                    this.__mapStorageToView(storage, storages, storageCodes);
                });
            }, reason => this.logger.error(reason))
            .catch(reason => this.logger.error(reason));
    }

    /**
     * Map the data storage record to view
     * @param storage {IWarehouse} record
     * @param storages to load
     * @param storageCodes to check
     * @private
     */
    private __mapStorageToView(storage: IWarehouse,
                               storages: { storage_id: string; storage_code: string; quantity?: number | 0 }[],
                               storageCodes: string[]): void {
        if (storageCodes.indexOf(storage.code || '') >= 0) {
            const storageIdx: number = storageCodes.indexOf(storage.code || '');
            this._warehouseStorages.push(
                WarehouseInventoryDetailStorageCellComponent
                    .__buildViewStorage(storage, storages[storageIdx]));
        }
    }

    /**
     * Build {IWarehouseInventoryDetailStorage} to view
     * @param storage to build
     * @param storageDetail to build
     * @private
     */
    private static __buildViewStorage(storage: IWarehouse,
                                      storageDetail: {
        storage_id: string;
        storage_code: string;
        quantity?: number | 0
    }): IWarehouseInventoryDetailStorage {
        return {
            id: IdGenerators.oid.generate(),
            storage: storage,
            storage_id: storage.id,
            storage_code: storage.code,
            storage_name: storage.name,
            viewStorage: [storage.name, ' (', storage.code, ')'].join(''),
            quantity: storageDetail.quantity || 0,
        } as IWarehouseInventoryDetailStorage;
    }

    /**
     * Remove storage at the specified index
     * @param dataIndex to remove
     */
    public removeStorage(dataIndex: number): void {
        const storages: IWarehouseInventoryDetailStorage[] =
            this.newCellValue as IWarehouseInventoryDetailStorage[];
        if (0 <= dataIndex && dataIndex < (storages || []).length) {
            storages.splice(dataIndex, 1);
        }
    }

    /**
     * Add a new storage at the bottom position
     */
    public addStorage(): void {
        this.newCellValue.push({
            id: undefined,
            storage_id: undefined,
            storage_code: undefined,
            storage_name: undefined,
            storage: undefined,
            quantity: undefined,
        });
    }
}
