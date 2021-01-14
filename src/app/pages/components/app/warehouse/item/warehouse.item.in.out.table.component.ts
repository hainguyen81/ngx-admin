import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, ViewContainerRef,} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {WarehouseInventoryDatasource,} from '../../../../../services/implementation/warehouse/warehouse.inventory/warehouse.inventory.datasource';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {AppSmartTableComponent} from '../../components/app.table.component';
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';

/* warehouse item IN/OUT table settings */
export const WarehouseItemInOutTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'warehouse.item.in_out.table.noData',
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
        date: {
            title: 'warehouse.item.in_out.table.date',
            type: 'string',
            sort: false,
            filter: false,
        },
        warehouse_id: {
            title: 'warehouse.item.in_out.table.warehouse',
            type: 'string',
            sort: false,
            filter: false,
        },
        stock_in: {
            title: 'warehouse.item.in_out.table.stock_in',
            type: 'string',
            sort: false,
            filter: false,
        },
        stock_out: {
            title: 'warehouse.item.in_out.table.stock_out',
            type: 'string',
            sort: false,
            filter: false,
        },
        final_stock: {
            title: 'warehouse.item.in_out.table.final_stock',
            type: 'string',
            sort: false,
            filter: false,
        },
    },
};

export const WarehouseItemInOutContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-smart-table-app-warehouse-item-in-out',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class WarehouseItemInOutSmartTableComponent
    extends AppSmartTableComponent<WarehouseInventoryDatasource> {

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
    get isShowHeader(): boolean {
        return false;
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
     * Create a new instance of {WarehouseItemInOutSmartTableComponent} class
     * @param dataSource {WarehouseInventoryDatasource}
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
    constructor(@Inject(WarehouseInventoryDatasource) dataSource: WarehouseInventoryDatasource,
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
        this.config = WarehouseItemInOutTableSettings;
        this.setContextMenu(WarehouseItemInOutContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([], false);
        this.getDataSource().refresh();
    }
}
