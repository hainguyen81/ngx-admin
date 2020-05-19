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

/**
 * Smart table warehouse batch cell component base on {DefaultEditor}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-smart-table-warehouse-inventory-storage-cell',
    templateUrl: './warehouse.inventory.detail.storage.cell.component.html',
    styleUrls: ['./warehouse.inventory.detail.storage.cell.component.scss'],
})
export class WarehouseInventoryDetailStorageCellComponent extends AbstractCellEditor
    implements OnInit, AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(WarehouseStorageFormlySelectFieldComponent)
    private readonly querySelectComponent: QueryList<WarehouseStorageFormlySelectFieldComponent>;
    private _selectComponents: WarehouseStorageFormlySelectFieldComponent[];
    @ViewChildren(MatInput)
    private readonly queryInputComponent: QueryList<MatInput>;
    private _inputComponents: MatInput[];

    private _warehouseDetailStorages: IWarehouseInventoryDetailStorage[] = [];
    private _warehouseStorages: IWarehouse[];

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

    get warehouseDetailStorages(): IWarehouseInventoryDetailStorage[] {
        return this._warehouseDetailStorages;
    }

    get newCellValue(): IWarehouseInventoryDetailStorage[] {
        return super.newCellValue as IWarehouseInventoryDetailStorage[];
    }

    set newCellValue(_value: IWarehouseInventoryDetailStorage[]) {
        super.newCellValue = _value;
    }

    get selectedStorageCodes(): string[] {
        const storageCodes: string[] = [];
        (this.newCellValue || []).forEach(storage => {
            (storage.storage_code || '').length && storageCodes.push(storage.storage_code);
        });
        return (storageCodes.length ? storageCodes : undefined);
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
     * @param warehouseDatasource {WarehouseDatasource}
     */
    constructor(@Inject(forwardRef(() => CellComponent)) _parentCell: CellComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef,
                @Inject(WarehouseDatasource) private warehouseDatasource: WarehouseDatasource) {
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

        // observe storage no master
        this.warehouseDatasource.getAll().then((storages: IWarehouse[]) => {
            if (this.viewMode) {
                this.__initialViewModeSelectItems(storages);

            } else {
                this.__initialEditModeSelectItems(storages);
            }
        }, reason => this.logger.error(reason))
        .catch(reason => this.logger.error(reason));
    }

    ngAfterViewInit(): void {
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
        if (this.viewMode) return;

        const components: WarehouseStorageFormlySelectFieldComponent[] = this.selectComponents;
        const inputComponents: MatInput[] = this.inputComponents;
        for (const component of components) {
            const dataIndex: number = components.indexOf(component);
            const inputComponent: MatInput = inputComponents[dataIndex];
            component.onLoad.subscribe(e => {
                const storages: IWarehouseInventoryDetailStorage[] =
                    this.cellValue as IWarehouseInventoryDetailStorage[];
                const storage: IWarehouseInventoryDetailStorage = storages[dataIndex];
                if (!isNullOrUndefined(storage)) {
                    component.setSelectedValue(storage.storage_code);
                    inputComponent.value =
                        (isNumber(storage.quantity) ? storage.quantity.toString() : undefined);
                }
            });
        }
    }

    /**
     * Initialize select items for edit mode
     * @param storages master data to load
     * @private
     */
    private __initialEditModeSelectItems(storages: IWarehouse[]): void {
        (this._warehouseStorages || []).clear();
        if (this.viewMode) return;

        // detect for master items
        this._warehouseStorages = [];
        (storages || []).forEach(storage => {
            storage['text'] = [storage.name, ' (', storage.code, ')'].join('');
            this._warehouseStorages.push(storage);
        });

        // apply select items
        (this.selectComponents || []).forEach(component => component.items = this._warehouseStorages);
        this.detectChanges();
    }

    /**
     * Initialize select items for view mode
     * @param storages master data to load
     * @private
     */
    private __initialViewModeSelectItems(storages: IWarehouse[]): void {
        this._warehouseDetailStorages.clear();
        if (!this.viewMode) return;

        (this.cellValue as IWarehouseInventoryDetailStorage[] || []).forEach(detailStorage => {
            const storage: IWarehouse = (storages || []).find(b => {
                return (b.code === detailStorage.storage_code);
            });
            if (!isNullOrUndefined(storage)) {
                detailStorage.storage = storage;
                detailStorage.viewStorage = [detailStorage.storage_name,
                    ' (', detailStorage.storage_code, ')'].join('');
                this._warehouseDetailStorages.push(detailStorage);
            }
        });
        this.detectChanges();
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
            this.newCellValue = [].concat(storages);
            this.detectChanges();
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
