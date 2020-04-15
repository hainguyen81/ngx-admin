import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {BaseSmartTableComponent} from '../../../smart-table/base.smart-table.component';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {IContextMenu, IEvent} from '../../../abstract.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {Lightbox} from 'ngx-lightbox';
import {WarehouseOrderDatasource} from '../../../../../services/implementation/warehouse/warehouse.order/warehouse.order.datasource';
import {WAREHOUSE_ORDER_TYPE} from '../../../../../@core/data/warehouse/warehouse.order';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {API} from '../../../../../config/api.config';

/* warehouse item orders table settings */
export const WarehouseItemOrdersTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'warehouse.item.orders.table.noData',
    actions: {
        add: false,
        edit: false,
        delete: false,
    },
    pager: {
        display: true,
        perPage: AppConfig.COMMON.itemsPerPage,
    },
    columns: {
        order_date: {
            title: 'warehouse.item.orders.table.order_date',
            type: 'string',
            sort: false,
            filter: false,
        },
        order_code: {
            title: 'warehouse.item.orders.table.order_code',
            type: 'string',
            sort: false,
            filter: false,
        },
        sales_person: {
            title: 'warehouse.item.orders.table.sales_person',
            type: 'string',
            sort: false,
            filter: false,
        },
        quantity: {
            title: 'warehouse.item.orders.table.quantity',
            type: 'string',
            sort: false,
            filter: false,
        },
        unit_price: {
            title: 'warehouse.item.orders.table.unit_price',
            type: 'string',
            sort: false,
            filter: false,
        },
        amount: {
            title: 'warehouse.item.orders.table.amount',
            type: 'string',
            sort: false,
            filter: false,
        },
        status: {
            title: 'warehouse.item.orders.table.status',
            type: 'string',
            sort: false,
            filter: false,
        },
    },
};

export const WarehouseItemOrdersContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: API.warehouseItem.code,
    selector: 'ngx-smart-table-warehouse-item-orders',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class WarehouseItemOrdersSmartTableComponent extends BaseSmartTableComponent<WarehouseOrderDatasource> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    // data model
    private model: IWarehouseItem = undefined;
    // raise while insert new table row
    private newItemDelegate: (event: IEvent) => void;
    // raise while editing table row
    private editItemDelegate: (event: IEvent) => void;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Remove panel header
     * @return false
     */
    protected isShowHeader(): boolean {
        return false;
    }

    /**
     * Get the {WAREHOUSE_ORDER_TYPE} order type
     * @return the {WAREHOUSE_ORDER_TYPE} order type
     */
    protected getOrderType(): WAREHOUSE_ORDER_TYPE {
        return null;
    }

    /**
     * Get the form data model
     * @return the form data model
     */
    getModel(): IWarehouseItem {
        return this.model;
    }

    /**
     * Set the form data model
     * @param model to apply
     */
    public setModel(model: IWarehouseItem) {
        this.model = model;
    }

    /**
     * Set the item new listener
     * @param newItemDelegate listener
     */
    public setNewItemListener(newItemDelegate: (event: IEvent) => void) {
        this.newItemDelegate = newItemDelegate;
    }

    /**
     * Set the item editing listener
     * @param editItemDelegate listener
     */
    public setEditItemListener(editItemDelegate: (event: IEvent) => void) {
        this.editItemDelegate = editItemDelegate;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemOrdersSmartTableComponent} class
     * @param dataSource {WarehouseOrderDatasource}
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
     */
    constructor(@Inject(WarehouseOrderDatasource) dataSource: WarehouseOrderDatasource,
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
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            'warehouse.item.title',
            WarehouseItemOrdersTableSettings, WarehouseItemOrdersContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'order_type', search: this.getOrderType().valueOf()},
            {field: 'order_code', search: keyword},
            {field: 'sales_person', search: keyword},
        ], false);
        this.getDataSource().refresh();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Create new Row
     */
    protected newRow() {
        if (this.newItemDelegate && !this.isInEditMode()) {
            this.newItemDelegate.apply(this, [{}]);

        } else {
            super.newRow();
        }
    }

    /**
     * Put the specified Cell into editing mode.
     * It means whole Row will be in editing mode.
     * @param rowIndex to edit
     * @param columnIndex to edit. -1 for focus the first cell
     */
    protected editCellByIndex(rowIndex: number, columnIndex: number) {
        if (0 > rowIndex || -1 > columnIndex) {
            return;
        }

        let row: Row;
        row = this.getRowByIndex(rowIndex);
        if (!row || row.isInEditing || !row.cells || !row.cells.length
            || columnIndex >= row.cells.length) {
            return;
        }

        if (this.editItemDelegate) {
            this.editItemDelegate.apply(this,
                [{ data: { rowIndex: rowIndex, columnIndex: columnIndex, row: row } }]);
        } else {
            super.editCellByIndex(rowIndex, columnIndex);
        }
    }
}
