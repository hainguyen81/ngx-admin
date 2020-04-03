import {BaseTabsetComponent} from '../../../tab/base.tab.component';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {WarehouseItemOverviewFormlyComponent} from './warehouse.item.overview.component';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {ITabConfig} from '../../../tab/abstract.tab.component';
import {NbIconConfig} from '@nebular/theme/components/icon/icon.component';
import {WarehouseItemPurchaseOrdersSmartTableComponent} from './warehouse.item.purchase.orders.table.component';
import {WarehouseItemSaleOrdersSmartTableComponent} from './warehouse.item.sale.orders.table.component';
import {WarehouseItemInOutSmartTableComponent} from './warehouse.item.in.out.table.component';

/** The number of tabs */
export const WAREHOUSE_ITEM_TABS_NUMBER: number = 5;

export const WAREHOUSE_ITEM_TAB_CONFIGS: ITabConfig[] = [{
    /**
     * Tab title
     * @type {string}
     */
    tabTitle: 'warehouse.item.overview.title',
    /**
     * Tab id
     * @type {string}
     */
    tabId: 'WAREHOUSE_ITEM_OVERVIEW',
    /**
     * Tab icon name or icon config object
     * @type {string | NbIconConfig}
     */
    tabIcon: { icon: 'archive', pack: 'fa' },
    /**
     * Item is disabled and cannot be opened.
     * @type {boolean}
     */
    disabled: false,
    /**
     * Show only icons when width is smaller than `tabs-icon-only-max-width`
     * @type {boolean}
     */
    responsive: true,
    /**
     * Specifies active tab
     * @returns {boolean}
     */
    active: true,
}, {
    /**
     * Tab title
     * @type {string}
     */
    tabTitle: 'warehouse.item.orders.purchase.title',
    /**
     * Tab id
     * @type {string}
     */
    tabId: 'WAREHOUSE_ITEM_PURCHASE',
    /**
     * Tab icon name or icon config object
     * @type {string | NbIconConfig}
     */
    tabIcon: { icon: 'shopping-cart', pack: 'fa' },
    /**
     * Item is disabled and cannot be opened.
     * @type {boolean}
     */
    disabled: false,
    /**
     * Show only icons when width is smaller than `tabs-icon-only-max-width`
     * @type {boolean}
     */
    responsive: true,
    /**
     * Specifies active tab
     * @returns {boolean}
     */
    active: true,
}, {
    /**
     * Tab title
     * @type {string}
     */
    tabTitle: 'warehouse.item.orders.sale.title',
    /**
     * Tab id
     * @type {string}
     */
    tabId: 'WAREHOUSE_ITEM_SALE',
    /**
     * Tab icon name or icon config object
     * @type {string | NbIconConfig}
     */
    tabIcon: { icon: 'credit-card', pack: 'far' },
    /**
     * Item is disabled and cannot be opened.
     * @type {boolean}
     */
    disabled: false,
    /**
     * Show only icons when width is smaller than `tabs-icon-only-max-width`
     * @type {boolean}
     */
    responsive: true,
    /**
     * Specifies active tab
     * @returns {boolean}
     */
    active: true,
}, {
    /**
     * Tab title
     * @type {string}
     */
    tabTitle: 'warehouse.item.in_out.title',
    /**
     * Tab id
     * @type {string}
     */
    tabId: 'WAREHOUSE_ITEM_IN_OUT',
    /**
     * Tab icon name or icon config object
     * @type {string | NbIconConfig}
     */
    tabIcon: { icon: 'exchange', pack: 'fa' },
    /**
     * Item is disabled and cannot be opened.
     * @type {boolean}
     */
    disabled: false,
    /**
     * Show only icons when width is smaller than `tabs-icon-only-max-width`
     * @type {boolean}
     */
    responsive: true,
    /**
     * Specifies active tab
     * @returns {boolean}
     */
    active: true,
}];

@Component({
    selector: 'ngx-tabset-warehouse-item',
    templateUrl: '../../../tab/tab.component.html',
    styleUrls: ['../../../tab/tab.component.scss'],
})
export class WarehouseItemTabsetComponent extends BaseTabsetComponent<WarehouseItemDatasource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private warehouseItemOverviewTabComponent: WarehouseItemOverviewFormlyComponent;
    private warehouseItemPurchaseTabComponent: WarehouseItemPurchaseOrdersSmartTableComponent;
    private warehouseItemSaleTabComponent: WarehouseItemSaleOrdersSmartTableComponent;
    private warehouseItemInOutTabComponent: WarehouseItemInOutSmartTableComponent;
    private dataModel: IWarehouseItem;

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Get the data model
     * @return data model
     */
    public getDataModel(): IWarehouseItem {
        return this.dataModel;
    }

    /**
     * Set the data model
     * @param dataModel to apply
     */
    public setDataModel(dataModel: IWarehouseItem): void {
        this.dataModel = dataModel;
        this.getOverviewTab() && this.getOverviewTab().setModel(dataModel);
        this.getPurchaseTab() && this.getPurchaseTab().setModel(dataModel);
        this.getSaleTab() && this.getSaleTab().setModel(dataModel);
    }

    /**
     * Get the {WarehouseItemOverviewFormlyComponent} instance
     * @return the {WarehouseItemOverviewFormlyComponent} instance
     */
    protected getOverviewTab(): WarehouseItemOverviewFormlyComponent {
        return this.warehouseItemOverviewTabComponent;
    }

    /**
     * Get the {WarehouseItemPurchaseOrdersSmartTableComponent} instance
     * @return the {WarehouseItemPurchaseOrdersSmartTableComponent} instance
     */
    protected getPurchaseTab(): WarehouseItemPurchaseOrdersSmartTableComponent {
        return this.warehouseItemPurchaseTabComponent;
    }

    /**
     * Get the {WarehouseItemSaleOrdersSmartTableComponent} instance
     * @return the {WarehouseItemSaleOrdersSmartTableComponent} instance
     */
    protected getSaleTab(): WarehouseItemSaleOrdersSmartTableComponent {
        return this.warehouseItemSaleTabComponent;
    }

    /**
     * Get the {WarehouseItemInOutSmartTableComponent} instance
     * @return the {WarehouseItemInOutSmartTableComponent} instance
     */
    protected getInOutTab(): WarehouseItemInOutSmartTableComponent {
        return this.warehouseItemInOutTabComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemTabsetComponent} class
     * @param dataSource {DataSource}
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
    constructor(@Inject(DataSource) dataSource: WarehouseItemDatasource,
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
        super.setNumberOfTabs(WAREHOUSE_ITEM_TABS_NUMBER);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // create tab components
        this.createTabComponents();
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Create tab components
     */
    private createTabComponents(): void {
        let tabIndex: number;
        tabIndex = 0;
        // overview tab
        this.warehouseItemOverviewTabComponent = this.setTabComponent(
            tabIndex, WarehouseItemOverviewFormlyComponent);
        this.configTabByIndex(tabIndex, WAREHOUSE_ITEM_TAB_CONFIGS[tabIndex]);
        tabIndex += 1;
        // purchase tab
        this.warehouseItemPurchaseTabComponent = this.setTabComponent(
            tabIndex, WarehouseItemPurchaseOrdersSmartTableComponent);
        this.configTabByIndex(tabIndex, WAREHOUSE_ITEM_TAB_CONFIGS[tabIndex]);
        tabIndex += 1;
        // sale tab
        this.warehouseItemSaleTabComponent = this.setTabComponent(
            tabIndex, WarehouseItemSaleOrdersSmartTableComponent);
        this.configTabByIndex(tabIndex, WAREHOUSE_ITEM_TAB_CONFIGS[tabIndex]);
        tabIndex += 1;
        // in/out tab
        this.warehouseItemInOutTabComponent = this.setTabComponent(
            tabIndex, WarehouseItemInOutSmartTableComponent);
        this.configTabByIndex(tabIndex, WAREHOUSE_ITEM_TAB_CONFIGS[tabIndex]);
        tabIndex += 1;
    }
}
