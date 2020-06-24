import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {AppSmartTableComponent} from '../../components/app.table.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {NumberCellComponent} from '../../../smart-table/number.cell.component';
import {
    WarehouseItemCellComponent,
} from '../../module.components/warehouse/item/warehouse.item.cell.component';
import {
    WarehouseInventoryDetailDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.inventory.detail/warehouse.inventory.detail.datasource';
import {
    WarehouseInventoryDetailBatchNoCellComponent,
} from '../../module.components/warehouse/inventory/warehouse.inventory.detail.batch.cell.component';
import {
    WarehouseInventoryDetailSerialCellComponent,
} from '../../module.components/warehouse/inventory/warehouse.inventory.detail.serial.cell.component';
import {
    WarehouseInventoryDetailStorageCellComponent,
} from '../../module.components/warehouse/inventory/warehouse.inventory.detail.storage.cell.component';
import {IEvent} from '../../../abstract.component';
import {isNullOrUndefined} from 'util';
import {InjectionService} from '../../../../../services/injection.service';
import {
    WarehouseInventoryDetailSummaryComponent,
} from '../../module.components/warehouse/inventory/warehouse.inventory.detail.summary.component';
import {
    AppMultilinguageLabelComponent,
} from '../../module.components/common/app.multilinguage.label.component';
import {Cell, LocalDataSource} from 'ng2-smart-table';
import {BehaviorSubject, throwError} from 'rxjs';
import {IWarehouseInventory} from '../../../../../@core/data/warehouse/warehouse.inventory';
import PromiseUtils from '../../../../../utils/promise.utils';
import {IWarehouseInventoryDetail} from '../../../../../@core/data/warehouse/warehouse.inventory.detail';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {
    IWarehouseInventoryDetailBatch,
} from '../../../../../@core/data/warehouse/extension/warehouse.inventory.detail.batch';
import CalculatorUtils from '../../../../../utils/calculator.utils';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {
    IWarehouseInventoryDetailStorage,
} from '../../../../../@core/data/warehouse/extension/warehouse.inventory.detail.storage';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import ObjectUtils from '../../../../../utils/object.utils';

/* warehouse inventory detail table settings */
export const WarehouseInventoryDetailTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'warehouse.inventory.detail.table.noData',
    actions: {
        add: false,
        edit: false,
        delete: false,
    },
    pager: {
        display: true,
        perPage: AppConfig.COMMON.itemsPerPage,
    },
    footer: {
        rows: 2,
    },
    columns: {
        item_code: {
            title: 'warehouse.inventory.detail.table.item',
            type: 'custom',
            sort: false,
            filter: false,
            renderComponent: WarehouseItemCellComponent,
            editor: {
                type: 'custom',
                component: WarehouseItemCellComponent,
                config: {
                    required: true,
                },
            },
        },
        batches: {
            title: 'warehouse.inventory.detail.table.batch',
            type: 'custom',
            sort: false,
            filter: false,
            renderComponent: WarehouseInventoryDetailBatchNoCellComponent,
            editor: {
                type: 'custom',
                component: WarehouseInventoryDetailBatchNoCellComponent,
                config: {},
            },
        },
        series: {
            title: 'warehouse.inventory.detail.table.series',
            type: 'custom',
            sort: false,
            filter: false,
            renderComponent: WarehouseInventoryDetailSerialCellComponent,
            editor: {
                type: 'custom',
                component: WarehouseInventoryDetailSerialCellComponent,
            },
        },
        storage: {
            title: 'warehouse.inventory.detail.table.storage',
            type: 'custom',
            sort: false,
            filter: false,
            renderComponent: WarehouseInventoryDetailStorageCellComponent,
            editor: {
                type: 'custom',
                component: WarehouseInventoryDetailStorageCellComponent,
                config: {},
            },
        },
        unit_price: {
            title: 'warehouse.inventory.detail.table.unit_price',
            type: 'custom',
            sort: false,
            filter: false,
            renderComponent: NumberCellComponent,
            editor: {
                type: 'custom',
                component: NumberCellComponent,
                config: {
                    isCurrency: false,
                    required: true,
                },
            },
        },
        quantity_actually: {
            title: 'warehouse.inventory.detail.table.quantity_orders',
            type: 'custom',
            sort: false,
            filter: false,
            renderComponent: NumberCellComponent,
            editor: {
                type: 'custom',
                component: NumberCellComponent,
                config: {
                    isCurrency: false,
                    readonly: (cell: Cell, row: Row, rowData: IWarehouseInventoryDetail, config: any) => {
                        const batchesCell: Cell = row.cells[1];
                        const storagesCell: Cell = row.cells[3];
                        const batches: IWarehouseInventoryDetailBatch[] = batchesCell.newValue;
                        const storages: IWarehouseInventoryDetailBatch[] = storagesCell.newValue;
                        const anyBatch: IWarehouseInventoryDetailBatch =
                            (batches || []).find(
                                batch => !isNullOrUndefined(batch.quantity) && batch.quantity > 0);
                        const anyStorage: IWarehouseInventoryDetailStorage =
                            (storages || []).find(
                                storage => !isNullOrUndefined(storage.quantity) && storage.quantity > 0);
                        return (!isNullOrUndefined(anyBatch) || !isNullOrUndefined(anyStorage));
                    },
                    required: true,
                },
            },
        },
        amount: {
            title: 'warehouse.inventory.detail.table.amount',
            type: 'custom',
            sort: false,
            filter: false,
            renderComponent: NumberCellComponent,
            config: {
                isCurrency: false,
                readonly: true,
            },
            editor: {
                type: 'custom',
                component: NumberCellComponent,
                config: {
                    readonly: true,
                },
            },
        },
    },
};

export const WarehouseInventoryDetailContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-smart-table-app-warehouse-inventory-detail',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: [
        '../../../smart-table/smart-table.component.scss',
        './warehouse.inventory.detail.table.component.scss',
    ],
})
export class WarehouseInventoryDetailSmartTableComponent
    extends AppSmartTableComponent<LocalDataSource>
    implements OnInit, AfterViewInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _behaviorSubject: BehaviorSubject<IWarehouseInventory>;
    private _model: IWarehouseInventory;
    private _details: IWarehouseInventoryDetail[];
    private _sumQuantityComponent: ComponentRef<WarehouseInventoryDetailSummaryComponent>;
    private _sumPriceComponent: ComponentRef<WarehouseInventoryDetailSummaryComponent>;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    get isShowHeader(): boolean {
        return false;
    }

    protected get dataIndexName(): string {
        return 'inventory_id';
    }

    protected get dataIndexKey(): IDBKeyRange {
        return (this.model && (this.model.id || '').length
            ? IDBKeyRange.only(this.model.id) : undefined);
    }

    /**
     * Get the {InjectionService} instance
     * @return the {InjectionService} instance
     */
    protected get injectionService(): InjectionService {
        return this._injectionService;
    }

    /**
     * Get the {NumberCellComponent} component
     * @return the {NumberCellComponent} component
     */
    protected get sumQuantityComponent(): ComponentRef<WarehouseInventoryDetailSummaryComponent> {
        return this._sumQuantityComponent;
    }

    /**
     * Get the {NumberCellComponent} component
     * @return the {NumberCellComponent} component
     */
    protected get sumPriceComponent(): ComponentRef<WarehouseInventoryDetailSummaryComponent> {
        return this._sumPriceComponent;
    }

    /**
     * Get the {IWarehouseInventoryDetail} instance
     * @return the {IWarehouseInventoryDetail} instance
     */
    get details(): IWarehouseInventoryDetail[] {
        return this._details;
    }

    /**
     * Get the {IWarehouseInventory} instance
     * @return the {IWarehouseInventory} instance
     */
    @Input() get model(): IWarehouseInventory {
        return this._model;
    }

    /**
     * Set the {IWarehouseInventory} instance
     * @param _model to apply
     */
    set model(_model: IWarehouseInventory) {
        this._model = _model;
        this._behaviorSubject
        && this._behaviorSubject.next(this._model);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventoryDetailSmartTableComponent} class
     * @param dataSource {LocalDataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param elementRef {ElementRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     * @param lightbox {Lightbox}
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     * @param _warehouseInventoryDetailDatasource {WarehouseInventoryDetailDatasource}
     * @param _injectionService {InjectionService}
     */
    constructor(@Inject(DataSource) dataSource: LocalDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toasterService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) elementRef: ElementRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                @Inject(WarehouseInventoryDetailDatasource)
                private _warehouseInventoryDetailDatasource?: WarehouseInventoryDetailDatasource,
                @Inject(InjectionService) private _injectionService?: InjectionService) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        this._warehouseInventoryDetailDatasource
        || throwError('Could not inject WarehouseInventoryDetailDatasource');
        this.tableHeader = 'warehouse.inventory.title';
        this.config = WarehouseInventoryDetailTableSettings;
        this.setContextMenu(WarehouseInventoryDetailContextMenu);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        this._behaviorSubject = new BehaviorSubject<IWarehouseInventory>(this.model);
        this._behaviorSubject.subscribe(model => this.__loadInventoryDetail(model));
    }

    ngOnDestroy(): void {
        PromiseUtils.unsubscribe(this._behaviorSubject);
        super.ngOnDestroy();
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([], false);
    }

    ngAfterViewInit(): void {
        // listen for creating footer components
        this.footerCreation.subscribe(e => {
            this.__createTableFooter(e);
        });

        super.ngAfterViewInit();
    }

    /**
     * Fire while item cell data had been changed
     * @param e {IEvent}
     */
    protected onItemCellChanged(e: IEvent) {
        const row: Row =
            (e &&  e.data ? e.data['row'] as Row : undefined);
        if (isNullOrUndefined(row)) return;

        const rowData: IWarehouseInventoryDetail =
            (e &&  e.data ? e.data['rowData'] as IWarehouseInventoryDetail : undefined);
        const item: IWarehouseItem =
            (e && e.data ? e.data['changedData'] as IWarehouseItem : undefined);

        // calculate unit price
        const unitPriceCell: Cell = row.cells[4];
        if (!isNaN(unitPriceCell.getValue()) || parseFloat(unitPriceCell.getValue()) <= 0) {
            const price: number = isNullOrUndefined(item) || isNaN(item.selling_price)
                ? undefined : item.selling_price;
            unitPriceCell.setValue(price);
            unitPriceCell.newValue = price;
        }

        // calculate row item
        rowData.item = item;
        rowData.item_id = (isNullOrUndefined(item) ? undefined : item.id);
        rowData.item_code = (isNullOrUndefined(item) ? undefined : item.code);

        // calculate footer amount
        this.__calculateFooterSummary();
    }

    /**
     * Fire while batches cell data had been changed
     * @param e {IEvent}
     */
    protected onBatchCellChanged(e: IEvent) {
        this.__updateQuantities(e, true);
    }

    /**
     * Fire while storages cell data had been changed
     * @param e {IEvent}
     */
    protected onStorageCellChanged(e: IEvent) {
        this.__updateQuantities(e, false);
    }

    /**
     * Fire while unit-prices cell data had been changed
     * @param e {IEvent}
     */
    protected onUnitPriceCellChanged(e: IEvent) {
        const row: Row =
            (e &&  e.data ? e.data['row'] as Row : undefined);
        if (isNullOrUndefined(row)) return;

        const rowData: IWarehouseInventoryDetail =
            (e &&  e.data ? e.data['rowData'] as IWarehouseInventoryDetail : undefined);
        const unitPriceVal: number = (e && e.data ? e.data['changedData'] as number : undefined);

        // calculate row amount
        const quantityCell: Cell = row.cells[5];
        const amountCell: Cell = row.cells[6];
        let amount: number = CalculatorUtils.multiply(quantityCell.newValue, unitPriceVal);
        amount = (isNaN(amount) ? undefined : amount);
        amountCell.setValue(amount);
        amountCell.newValue = amount;
        rowData.amount = amount;

        // calculate footer amount
        this.__calculateFooterSummary();
    }

    /**
     * Fire while quantities cell data had been changed
     * @param e {IEvent}
     */
    protected onQuantityCellChanged(e: IEvent) {
        const row: Row =
            (e &&  e.data ? e.data['row'] as Row : undefined);
        if (isNullOrUndefined(row)) return;

        const rowData: IWarehouseInventoryDetail =
            (e &&  e.data ? e.data['rowData'] as IWarehouseInventoryDetail : undefined);
        const quantityVal: number = (e && e.data ? e.data['changedData'] as number : undefined);

        // calculate row amount
        const unitPriceCell: Cell = row.cells[4];
        const amountCell: Cell = row.cells[6];
        let amount: number = CalculatorUtils.multiply(quantityVal, unitPriceCell.newValue);
        amount = (isNaN(amount) ? undefined : amount);
        amountCell.setValue(amount);
        amountCell.newValue = amount;
        rowData.amount = amount;

        // calculate footer amount
        this.__calculateFooterSummary();
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Load {IWarehouseInventoryDetail} by the specified {IWarehouseInventory}
     * @param model to load
     * @private
     */
    private __loadInventoryDetail(model: IWarehouseInventory): void {
        this.getDataSource().empty().then(() => {
            if (!isNullOrUndefined(model) && (model.id || '').length) {
                this._warehouseInventoryDetailDatasource.getAllByIndex(
                    this.dataIndexName, this.dataIndexKey)
                    .then((details: IWarehouseInventoryDetail[]) => {
                        this._details = ObjectUtils.deepCopy(details);
                        this.getDataSource().load(details);
                    }, reason => this.getLogger().error(reason))
                    .catch(reason => this.getLogger().error(reason));
            } else {
                this._details = [];
                this.getDataSource().load(this._details);
            }
        }, reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }

    /**
     * Create table footer
     * @private
     */
    private __createTableFooter($event: IEvent): void {
        if (isNullOrUndefined($event) || isNullOrUndefined($event.data)
            || isNullOrUndefined(this.injectionService)) return;

        const rows: HTMLTableRowElement[] = $event.data as HTMLTableRowElement[];
        if (!(rows || []).length) return;

        // first summary row
        let rowIndex: number = 0;
        let cell: HTMLTableCellElement = rows[rowIndex].insertCell(0);
        cell.colSpan = 5;
        this.injectionService.appendComponentByFactory(
            this.getFactoryResolver(), AppMultilinguageLabelComponent, {
                innerHtml: 'warehouse.inventory.detail.table.summary',
                componentClass: 'inventory-total-quantity-label',
            }, cell);
        cell = rows[rowIndex].insertCell(1);
        cell.colSpan = 2;
        this._sumQuantityComponent = this.injectionService.appendComponentByFactory(
            this.getFactoryResolver(), WarehouseInventoryDetailSummaryComponent, {
                isCurrency: false,
                componentClass: 'inventory-total-quantity',
                summaryColumn: 5,
                tableComponent: this.tableComponent,
            }, cell);

        // second summary row
        rowIndex++;
        cell = rows[rowIndex].insertCell(0);
        cell.colSpan = 5;
        this.injectionService.appendComponentByFactory(
            this.getFactoryResolver(), AppMultilinguageLabelComponent, {
                innerHtml: 'warehouse.inventory.detail.table.total',
                componentClass: 'inventory-total-amount-label',
            }, cell);
        cell = rows[rowIndex].insertCell(1);
        cell.colSpan = 2;
        this._sumPriceComponent = this.injectionService.appendComponentByFactory(
            this.getFactoryResolver(), WarehouseInventoryDetailSummaryComponent, {
                isCurrency: false,
                componentClass: 'inventory-total-amount',
                summaryColumn: 5,
                tableComponent: this.tableComponent,
            }, cell);
    }

    /**
     * Fire while storages cell data had been changed
     * @param e {IEvent}
     * @param byBatch by changing batches cell; else changing storages cell
     */
    private __updateQuantities(e: IEvent, byBatch: boolean | false) {
        const row: Row =
            (e &&  e.data ? e.data['row'] as Row : undefined);
        if (isNullOrUndefined(row)) return;

        const rowData: IWarehouseInventoryDetail =
            (e &&  e.data ? e.data['rowData'] as IWarehouseInventoryDetail : undefined);
        const quantitiesList: number[] = [];
        if (byBatch) {
            const batches: IWarehouseInventoryDetailBatch[] =
                (e && e.data ? e.data['cellData'] as IWarehouseInventoryDetailBatch[] : undefined);
            (batches || []).forEach(batch => {
                (batch.batch_code || '').length && !isNaN(batch.quantity)
                && quantitiesList.push(batch.quantity);
            });

        } else {
            const storages: IWarehouseInventoryDetailStorage[] =
                (e && e.data ? e.data['cellData'] as IWarehouseInventoryDetailStorage[] : undefined);
            (storages || []).forEach(storage => {
                (storage.storage_code || '').length && !isNaN(storage.quantity)
                && quantitiesList.push(storage.quantity);
            });
        }

        // calculate quantities cell
        const quantityCell: Cell = row.cells[5];
        let quantities = quantityCell.newValue;
        if (quantitiesList.length && (!isNaN(quantities) || parseFloat(quantities) <= 0)) {
            quantities = CalculatorUtils.plusMulti(...quantitiesList);
        }
        quantities = (isNaN(quantities) ? undefined : quantities);
        quantityCell.setValue(quantities);
        quantityCell.newValue = quantities;

        // calculate row amount
        const unitPriceCell: Cell = row.cells[4];
        const amountCell: Cell = row.cells[6];
        let amount: number = CalculatorUtils.multiply(
            quantityCell.newValue, unitPriceCell.newValue);
        amount = (isNaN(amount) ? undefined : amount);
        amountCell.setValue(amount);
        amountCell.newValue = amount;
        rowData.amount = amount;

        // calculate footer amount
        this.__calculateFooterSummary();
    }

    /**
     * Calculate the footer summary cell
     * @private
     */
    private __calculateFooterSummary() {
        const rows: Row[] = this.rows;
        const quantities: number[] = [];
        const prices: number[] = [];
        (rows || []).forEach(row => {
            const rowData: IWarehouseInventoryDetail =
                (row.isInEditing ? row.getNewData() as IWarehouseInventoryDetail
                    : row.getData() as IWarehouseInventoryDetail);
            if (!isNullOrUndefined(rowData)) {
                quantities.push(rowData.quantity_actually);
                prices.push(rowData.amount);
            }
        });
        this._sumQuantityComponent.instance.value = CalculatorUtils.plusMulti(...quantities);
        this._sumPriceComponent.instance.value = CalculatorUtils.plusMulti(...prices);
        this._model.total_amount = (isNaN(this._sumPriceComponent.instance.value)
            ? undefined : this._sumPriceComponent.instance.value);
    }

    /**
     * Translate table settings
     */
    protected translateSettings(): void {
        // translate as default
        super.translateSettings();

        // Attach `cellChanged` event into table settings
        this.__attachCellChangedEventsSettings();
    }

    /**
     * Attach `cellChanged` event into table settings
     * @private
     */
    private __attachCellChangedEventsSettings() {
        const settings: any = this.config;

        settings['columns']['item_code']['editor']['config'] =
            (settings['columns']['item_code']['editor']['config'] || {});
        const itemColumnConfig = settings['columns']['item_code']['editor']['config'];
        itemColumnConfig['cellChanged'] = (e: IEvent) => this.onItemCellChanged(e);

        settings['columns']['batches']['editor']['config'] =
            (settings['columns']['batches']['editor']['config'] || {});
        const batchesColumnConfig = settings['columns']['batches']['editor']['config'];
        batchesColumnConfig['cellChanged'] = (e: IEvent) => this.onBatchCellChanged(e);

        settings['columns']['storage']['editor']['config'] =
            (settings['columns']['storage']['editor']['config'] || {});
        const storagesColumnConfig = settings['columns']['storage']['editor']['config'];
        storagesColumnConfig['cellChanged']  = (e: IEvent) => this.onStorageCellChanged(e);

        settings['columns']['unit_price']['editor']['config'] =
            (settings['columns']['unit_price']['editor']['config'] || {});
        const pricesColumnConfig = settings['columns']['unit_price']['editor']['config'];
        pricesColumnConfig['cellChanged']  = (e: IEvent) => this.onUnitPriceCellChanged(e);

        settings['columns']['quantity_actually']['editor']['config'] =
            (settings['columns']['quantity_actually']['editor']['config'] || {});
        const quantitiesColumnConfig = settings['columns']['quantity_actually']['editor']['config'];
        quantitiesColumnConfig['cellChanged']  = (e: IEvent) => this.onQuantityCellChanged(e);
    }
}
