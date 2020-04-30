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
import {
    WarehouseItemDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {ImageCellComponent} from '../../../smart-table/image.cell.component';
import {Lightbox} from 'ngx-lightbox';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {AppSmartTableComponent} from '../../components/app.table.component';
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {NumberCellComponent} from '../../../smart-table/number.cell.component';
import {RowNumberCellComponent} from '../../../smart-table/row.number.cell.component';

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
        no: {
            title: 'warehouse.item.table.no',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: RowNumberCellComponent,
        },
        code: {
            title: 'warehouse.item.table.code',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        name: {
            title: 'warehouse.item.table.name',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        status: {
            title: 'warehouse.item.table.status',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
        },
        image: {
            title: 'warehouse.item.table.image',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: ImageCellComponent,
        },
        stock_on_hand: {
            title: 'warehouse.item.table.stock_on_hand',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: NumberCellComponent,
            config: {
                isCurrency: false,
            },
        },
        available_stock: {
            title: 'warehouse.item.table.available_stock',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: NumberCellComponent,
            config: {
                isCurrency: false,
            },
        },
        cost_price: {
            title: 'warehouse.item.table.cost_price',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: NumberCellComponent,
            config: {
                isCurrency: true,
            },
        },
        selling_price: {
            title: 'warehouse.item.table.selling_price',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: NumberCellComponent,
            config: {
                isCurrency: true,
            },
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
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected isShowHeader(): boolean {
        return false;
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
     * @param lightbox {Lightbox}
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        super.setTableHeader('warehouse.item.title');
        super.setTableSettings(WarehouseItemTableSettings);
        super.setContextMenu(WarehouseItemContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'code', search: keyword},
            {field: 'name', search: keyword},
        ], false);
    }
}
