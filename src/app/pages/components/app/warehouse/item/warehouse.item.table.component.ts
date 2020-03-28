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
import {convertItemStatusToDisplay, ITEM_STATUS} from '../../../../../@core/data/warehouse/warehouse.item';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {ImageCellComponent} from '../../../smart-table/image.cell.component';

/* customers table settings */
export const WarehouseItemTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'warehouse.item.table.noData',
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
        code: {
            title: 'warehouse.item.table.code',
            type: 'string',
            sort: false,
            filter: false,
        },
        name: {
            title: 'warehouse.item.table.name',
            type: 'string',
            sort: false,
            filter: false,
        },
        status: {
            title: 'warehouse.item.table.status',
            type: 'string',
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
        },
        category: {
            title: 'warehouse.item.table.category',
            type: 'string',
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
        },
        brand: {
            title: 'warehouse.item.table.brand',
            type: 'string',
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
        },
        barcode: {
            title: 'warehouse.item.table.barcode',
            type: 'string',
            sort: false,
            filter: false,
        },
        serial: {
            title: 'warehouse.item.table.serial',
            type: 'string',
            sort: false,
            filter: false,
        },
        image: {
            title: 'warehouse.item.table.image',
            type: 'string',
            sort: false,
            filter: false,
            renderComponent: ImageCellComponent,
        },
        manufacturer: {
            title: 'warehouse.item.table.manufacturer',
            type: 'string',
            sort: false,
            filter: false,
        },
        length: {
            title: 'warehouse.item.table.length',
            type: 'string',
            sort: false,
            filter: false,
        },
        width: {
            title: 'warehouse.item.table.width',
            type: 'string',
            sort: false,
            filter: false,
        },
        height: {
            title: 'warehouse.item.table.height',
            type: 'string',
            sort: false,
            filter: false,
        },
        weight: {
            title: 'warehouse.item.table.weight',
            type: 'string',
            sort: false,
            filter: false,
        },
        size: {
            title: 'warehouse.item.table.size',
            type: 'string',
            sort: false,
            filter: false,
        },
        unit: {
            title: 'warehouse.item.table.unit',
            type: 'string',
            sort: false,
            filter: false,
        },
        rate_per_unit: {
            title: 'warehouse.item.table.rate_per_unit',
            type: 'string',
            sort: false,
            filter: false,
        },
        dealer_price: {
            title: 'warehouse.item.table.dealer_price',
            type: 'string',
            sort: false,
            filter: false,
        },
        cost_price: {
            title: 'warehouse.item.table.cost_price',
            type: 'string',
            sort: false,
            filter: false,
        },
        selling_price: {
            title: 'warehouse.item.table.selling_price',
            type: 'string',
            sort: false,
            filter: false,
        },
        currency: {
            title: 'warehouse.item.table.currency',
            type: 'string',
            sort: false,
            filter: false,
        },
        stock_on_hand: {
            title: 'warehouse.item.table.stock_on_hand',
            type: 'string',
            sort: false,
            filter: false,
        },
        committed_stock: {
            title: 'warehouse.item.table.committed_stock',
            type: 'string',
            sort: false,
            filter: false,
        },
        available_stock: {
            title: 'warehouse.item.table.available_stock',
            type: 'string',
            sort: false,
            filter: false,
        },
        incoming_stock: {
            title: 'warehouse.item.table.incoming_stock',
            type: 'string',
            sort: false,
            filter: false,
        },
        quantity_shipped: {
            title: 'warehouse.item.table.quantity_shipped',
            type: 'string',
            sort: false,
            filter: false,
        },
        quantity_received: {
            title: 'warehouse.item.table.quantity_received',
            type: 'string',
            sort: false,
            filter: false,
        },
        description: {
            title: 'warehouse.item.table.description',
            type: 'string',
            sort: false,
            filter: false,
        },
        remark: {
            title: 'warehouse.item.table.remark',
            type: 'string',
            sort: false,
            filter: false,
        },
    },
};

export const WarehouseItemContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    selector: 'ngx-smart-table-warehouse-item',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class WarehouseItemSmartTableComponent extends BaseSmartTableComponent<WarehouseItemDatasource> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    // raise while insert new table row
    private newItemDelegate: (event: IEvent) => void;
    // raise while editing table row
    private editItemDelegate: (event: IEvent) => void;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

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
     * Create a new instance of {WarehouseItemSmartTableComponent} class
     * @param dataSource {WarehouseItemDatasource}
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
     */
    constructor(@Inject(WarehouseItemDatasource) dataSource: WarehouseItemDatasource,
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
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup,
            'warehouse.item.title', WarehouseItemTableSettings, WarehouseItemContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([], false);
        this.getDataSource().refresh();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Convert {ITEM_STATUS} to the showed translated value
     * @param value to convert
     * @return converted value
     */
    private convertWarehouseItemStatusToDisplay(value: ITEM_STATUS): string {
        return this.translate(convertItemStatusToDisplay(value));
    }

    /**
     * Translate table settings
     */
    protected translateSettings(): void {
        super.translateSettings();

        this.translatedSettings['columns']['status']['valuePrepareFunction'] =
            value => this.convertWarehouseItemStatusToDisplay(value);
        this.translatedSettings['columns']['status']['editor']['config']['list'] = [
            {
                value: ITEM_STATUS.NOT_ACTIVATED,
                title: this.convertWarehouseItemStatusToDisplay(ITEM_STATUS.NOT_ACTIVATED),
            },
            {
                value: ITEM_STATUS.ACTIVATED,
                title: this.convertWarehouseItemStatusToDisplay(ITEM_STATUS.ACTIVATED),
            },
            {
                value: ITEM_STATUS.LOCKED,
                title: this.convertWarehouseItemStatusToDisplay(ITEM_STATUS.LOCKED),
            },
        ];
    }

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
