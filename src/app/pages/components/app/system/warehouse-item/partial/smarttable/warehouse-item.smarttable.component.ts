import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {BaseSmartTableComponent} from '../../../../../smart-table/base.smart-table.component';
import {convertWarehouseItemSmartTableStatusToDisplay, WarehouseItemSmartTable_STATUS} from '../../../../../../../@core/data/warehouse-item.smarttable';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../../../config/app.config';
import {IContextMenu, IEvent} from '../../../../../abstract.component';
import {COMMON} from '../../../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {TreeviewItem} from 'ngx-treeview';
import {WarehouseItemSmartTableDatasource} from '../../../../../../../services/implementation/warehouse-item/partial/smarttable/warehouse-item.smarttable.datasource';

/* WarehouseItemSmartTables table settings */
export const WarehouseItemSmartTableTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'system.warehouse-item.table.noData',
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
        WarehouseItemSmartTableName: {
            title: 'system.warehouse-item.table.warehouse-item',
            type: 'string',
            sort: false,
            filter: false,
        },
        email: {
            title: 'system.warehouse-item.table.email',
            type: 'string',
            sort: false,
            filter: false,
        },
        tel: {
            title: 'system.warehouse-item.table.tel',
            type: 'string',
            sort: false,
            filter: false,
        },
        address: {
            title: 'system.warehouse-item.table.address',
            type: 'string',
            sort: false,
            filter: false,
        },
        status: {
            title: 'system.warehouse-item.table.status',
            type: 'string',
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
        },
    },
};

export const WarehouseItemSmartTableContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    selector: 'ngx-smart-table-warehouse-items',
    templateUrl: '../../../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../../../smart-table/smart-table.component.scss'],
})
export class WarehouseItemSmartTableComponent extends
    BaseSmartTableComponent<WarehouseItemSmartTableDatasource> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private clickItemDelegate: (event: MouseEvent, item: TreeviewItem) => void;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Set the item click listener
     * @param clickItemDelegate listener
     */
    public setClickItemListener(clickItemDelegate: (event: MouseEvent, item: TreeviewItem) => void) {
        this.clickItemDelegate = clickItemDelegate;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {CustomerSmartTableComponent} class
     * @param dataSource {CustomerDatasource}
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
    constructor(@Inject(WarehouseItemSmartTableDatasource) dataSource: WarehouseItemSmartTableDatasource,
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
            'system.customer.title', WarehouseItemSmartTableTableSettings, WarehouseItemSmartTableContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'WarehouseItemSmartTableName', search: keyword},
            {field: 'email', search: keyword},
            {field: 'title', search: keyword},
            {field: 'tel', search: keyword},
            {field: 'address', search: keyword},
        ], false);
        this.getDataSource().refresh();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Convert {WarehouseItemSmartTable_STATUS} to the showed translated value
     * @param value to convert
     * @return converted value
     */
    private convertWarehouseItemSmartTableStatusToDisplay(value: WarehouseItemSmartTable_STATUS): string {
        return this.translate(convertWarehouseItemSmartTableStatusToDisplay(value));
    }

    /**
     * Translate table settings
     */
    protected translateSettings(): void {
        super.translateSettings();

        this.translatedSettings['columns']['status']['valuePrepareFunction'] =
            value => this.convertWarehouseItemSmartTableStatusToDisplay(value);
        this.translatedSettings['columns']['status']['editor']['config']['list'] = [
            {
                value: WarehouseItemSmartTable_STATUS.NOT_ACTIVATED,
                title: this.convertWarehouseItemSmartTableStatusToDisplay(WarehouseItemSmartTable_STATUS.NOT_ACTIVATED),
            },
            {
                value: WarehouseItemSmartTable_STATUS.ACTIVATED,
                title: this.convertWarehouseItemSmartTableStatusToDisplay(WarehouseItemSmartTable_STATUS.ACTIVATED),
            },
            {
                value: WarehouseItemSmartTable_STATUS.LOCKED,
                title: this.convertWarehouseItemSmartTableStatusToDisplay(WarehouseItemSmartTable_STATUS.LOCKED),
            },
        ];
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Raise when tree-view item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {TreeviewItem}
     */
    onClickItem(event: IEvent) {
        // super.onClickItem(event);
        this.clickItemDelegate
        && this.clickItemDelegate.apply(this, [event.$event, event.$data]);
    }
}
