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
import {
    WarehouseOrderDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.order/warehouse.order.datasource';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {Constants as OrderConstants} from '../../../../../@core/data/constants/warehouse.order.constants';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {AppSmartTableComponent} from '../../components/app.table.component';
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';

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
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-smart-table-app-warehouse-item-orders',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class WarehouseItemOrdersSmartTableComponent
    extends AppSmartTableComponent<WarehouseOrderDatasource> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    // data model
    private model: IWarehouseItem = undefined;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Remove panel header
     * @return false
     */
    protected get isShowHeader(): boolean {
        return false;
    }

    /**
     * Get the {WAREHOUSE_ORDER_TYPE} order type
     * @return the {WAREHOUSE_ORDER_TYPE} order type
     */
    protected getOrderType(): OrderConstants.WarehouseConstants.WarehouseOrderConstants.WAREHOUSE_ORDER_TYPE {
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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        this.tableHeader = 'warehouse.item.title';
        this.config = WarehouseItemOrdersTableSettings;
        this.setContextMenu(WarehouseItemOrdersContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'order_type', search: this.getOrderType().valueOf()},
            {field: 'order_code', search: keyword},
            {field: 'sales_person', search: keyword},
        ], false);
        this.getDataSource().refresh();
    }
}
