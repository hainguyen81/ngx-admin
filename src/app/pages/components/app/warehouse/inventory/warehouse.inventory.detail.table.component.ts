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
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {AppSmartTableComponent} from '../../components/app.table.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
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
        rows: 1,
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
            },
        },
        quantity_orders: {
            title: 'warehouse.inventory.detail.table.quantity_orders',
            type: 'custom',
            sort: false,
            filter: false,
            renderComponent: NumberCellComponent,
            config: {
                isCurrency: false,
            },
            editor: {
                type: 'custom',
                component: NumberCellComponent,
            },
        },
        unit_price: {
            title: 'warehouse.inventory.detail.table.unit_price',
            type: 'custom',
            sort: false,
            filter: false,
            renderComponent: NumberCellComponent,
            config: {
                isCurrency: false,
            },
            editor: {
                type: 'custom',
                component: NumberCellComponent,
            },
        },
    },
};

export const WarehouseInventoryDetailContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-smart-table-app-warehouse-inventory-detail',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: [
        '../../../smart-table/smart-table.component.scss',
        './warehouse.inventory.detail.table.component.scss',
    ],
})
export class WarehouseInventoryDetailSmartTableComponent
    extends AppSmartTableComponent<WarehouseInventoryDetailDatasource> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get isShowHeader(): boolean {
        return false;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventoryDetailSmartTableComponent} class
     * @param dataSource {WarehouseInventoryDetailDatasource}
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
     */
    constructor(@Inject(WarehouseInventoryDetailDatasource) dataSource: WarehouseInventoryDetailDatasource,
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        this.tableHeader = 'warehouse.inventory.title';
        this.config = WarehouseInventoryDetailTableSettings;
        this.setContextMenu(WarehouseInventoryDetailContextMenu);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([], false);
    }
}
