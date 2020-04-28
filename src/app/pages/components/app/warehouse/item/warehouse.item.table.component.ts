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
import {IContextMenu} from '../../../abstract.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {
    WarehouseItemDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {ImageCellComponent} from '../../../smart-table/image.cell.component';
import {Lightbox} from 'ngx-lightbox';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {AppSmartTableComponent} from '../../components/app.table.component';

/* warehouse item table settings */
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
        color: {
            title: 'warehouse.item.table.color',
            type: 'string',
            sort: false,
            filter: false,
        },
        material: {
            title: 'warehouse.item.table.material',
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
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-smart-table-app-warehouse-item',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class WarehouseItemSmartTableComponent
    extends AppSmartTableComponent<WarehouseItemDatasource> {

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
     * @param lightbox {Lightbox}
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
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        super.setTableHeader('warehouse.item.title');
        super.setTableSettings(WarehouseItemTableSettings);
        super.setContextMenu(WarehouseItemContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([], false);
        this.getDataSource().refresh();
    }
}
