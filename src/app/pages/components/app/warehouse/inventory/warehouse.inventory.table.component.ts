import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
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
import {ImageCellComponent} from '../../../smart-table/image.cell.component';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import AppObserveUtils from '../../../../../utils/app.observe.utils';
import PromiseUtils from '../../../../../utils/promise.utils';
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectTranslateCellComponent} from '../../../smart-table/select.translate.cell.component';
import {Cell, DefaultEditor} from 'ng2-smart-table';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {RowNumberCellComponent} from '../../../smart-table/row.number.cell.component';
import {IWarehouseInventory} from '../../../../../@core/data/warehouse/warehouse.inventory';
import {NumberCellComponent} from '../../../smart-table/number.cell.component';
import {
    WarehouseInventoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.inventory/warehouse.inventory.datasource';

/* warehouse inventory table settings */
export const WarehouseInventoryTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'warehouse.inventory.table.noData',
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
            title: 'warehouse.inventory.table.no',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: RowNumberCellComponent,
        },
        date: {
            title: 'warehouse.inventory.table.date',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        code: {
            title: 'warehouse.inventory.table.code',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        warehouse_code: {
            title: 'warehouse.inventory.table.warehouse',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: ImageCellComponent,
            editor: {
                type: 'custom',
                component: ImageCellComponent,
                config: {
                    'imagesPrepare': (c: DefaultEditor,
                                      cell: Cell, row: Row,
                                      data: IWarehouseInventory,
                                      config: any) => {
                        return (data && data.warehouse ? data.warehouse.image : []);
                    },
                    'descriptorPrepare': (c: DefaultEditor,
                                          cell: Cell, row: Row,
                                          data: IWarehouseInventory,
                                          config: any) => {
                        return (data && data.warehouse ? data.warehouse.name : '');
                    },
                },
            },
        },
        type: {
            title: 'warehouse.inventory.table.type',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: SelectTranslateCellComponent,
        },
        vendor_customer_code: {
            title: 'warehouse.inventory.table.vendor_customer',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: ImageCellComponent,
            editor: {
                type: 'custom',
                component: ImageCellComponent,
                config: {
                    'imagesPrepare': (c: DefaultEditor,
                                      cell: Cell, row: Row,
                                      data: IWarehouseInventory,
                                      config: any) => {
                        return (data && data.vendor_customer ? data.vendor_customer.image : []);
                    },
                    'descriptorPrepare': (c: DefaultEditor,
                                          cell: Cell, row: Row,
                                          data: IWarehouseInventory,
                                          config: any) => {
                        return (data && data.vendor_customer ? data.vendor_customer.name : '');
                    },
                },
            },
        },
        sales_order: {
            title: 'warehouse.inventory.table.sales_order',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        total_amount: {
            title: 'warehouse.inventory.table.total_amount',
            type: 'custom',
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

export const WarehouseInventoryContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-smart-table-app-warehouse-inventory',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: [
        '../../../smart-table/smart-table.component.scss',
    ],
})
export class WarehouseInventorySmartTableComponent
    extends AppSmartTableComponent<WarehouseInventoryDatasource>
    implements OnInit {

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
     * Create a new instance of {WarehouseInventorySmartTableComponent} class
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
     * @param generalSettingsDatasource {GeneralSettingsDatasource}
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                @Inject(GeneralSettingsDatasource) private generalSettingsDatasource?: GeneralSettingsDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        generalSettingsDatasource || throwError('Could not inject GeneralSettingsDatasource instance');
        this.tableHeader = 'warehouse.inventory.title';
        this.config = WarehouseInventoryTableSettings;
        this.setContextMenu(WarehouseInventoryContextMenu);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([], false);
    }

    ngOnInit(): void {
        super.ngOnInit();

        const settings: any = this.config;
        PromiseUtils.parallelPromises(undefined, undefined, [
            AppObserveUtils.observeDefaultWarehouseGeneralSettingsTableColumn(
                this.generalSettingsDatasource, settings, 'type',
                BUILTIN_CODES.WAREHOUSE_INVENTORY_TYPE.code,
                null),
        ]).then(
            value => {
                this.getLogger().debug('Loading general settings successful');
                this.getDataSource().refresh();
            },
            reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }
}
