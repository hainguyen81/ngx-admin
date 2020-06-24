import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, OnInit,
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
import {AppSmartTableComponent} from '../../components/app.table.component';
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {NumberCellComponent} from '../../../smart-table/number.cell.component';
import {RowNumberCellComponent} from '../../../smart-table/row.number.cell.component';
import {SelectTranslateCellComponent} from '../../../smart-table/select.translate.cell.component';
import {Cell, DefaultEditor} from 'ng2-smart-table';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import PromiseUtils from '../../../../../utils/promise.utils';
import AppObserveUtils from '../../../../../utils/app.observe.utils';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';

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
        image: {
            title: 'warehouse.item.table.code',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: ImageCellComponent,
            editor: {
                type: 'custom',
                component: ImageCellComponent,
                config: {
                    'descriptorPrepare': (c: DefaultEditor,
                                          cell: Cell, row: Row,
                                          data: IWarehouseItem,
                                          config: any) => {
                        return (data ? data.code || '' : '');
                    },
                },
            },
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
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: SelectTranslateCellComponent,
        },
        stock_on_hand: {
            title: 'warehouse.item.table.stock_on_hand',
            type: 'custom',
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
            type: 'custom',
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
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: NumberCellComponent,
            config: {
                isCurrency: true,
            },
        },
        dealer_price: {
            title: 'warehouse.item.table.dealer_price',
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

export const WarehouseItemContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-smart-table-app-warehouse-item',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class WarehouseItemSmartTableComponent
    extends AppSmartTableComponent<WarehouseItemDatasource>
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
     * @param generalSettingsDatasource {GeneralSettingsDatasource}
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                @Inject(GeneralSettingsDatasource) private generalSettingsDatasource?: GeneralSettingsDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        generalSettingsDatasource || throwError('Could not inject GeneralSettingsDatasource instance');
        this.tableHeader = 'warehouse.item.title';
        this.config = WarehouseItemTableSettings;
        this.setContextMenu(WarehouseItemContextMenu);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'code', search: keyword},
            {field: 'name', search: keyword},
        ], false);
    }

    ngOnInit(): void {
        super.ngOnInit();

        const settings: any = this.config;
        PromiseUtils.parallelPromises(undefined, undefined, [
            AppObserveUtils.observeDefaultSystemGeneralSettingsTableColumn(
                this.generalSettingsDatasource, settings, 'status',
                CommonConstants.COMMON.BUILTIN_CODES.STATUS.code, null),
        ]).then(value => {
            this.getLogger().debug('Loading general settings successful');
            this.getDataSource().refresh();
        }, reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }
}
