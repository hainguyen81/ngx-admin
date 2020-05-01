import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {
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
import {WarehouseItemAdjustmentSmartTableComponent} from './warehouse.item.adjustment.table.component';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = Constants.COMMON.MODULE_CODES;
import {ActivatedRoute, Router} from '@angular/router';
import {AppTabsetComponent} from '../../components/app.tabset.component';
import {WarehouseItemToolbarComponent} from './warehouse.item.toolbar.component';
import {AbstractComponent} from '../../../abstract.component';
import {throwError} from 'rxjs';
import {WarehouseItemVersionSmartTableComponent} from './warehouse.item.version.table.component';

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
    tabTitle: 'warehouse.item.version.title',
    /**
     * Tab id
     * @type {string}
     */
    tabId: 'WAREHOUSE_ITEM_VERSION',
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
    tabIcon: { icon: 'cubes', pack: 'fa' },
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
    tabTitle: 'warehouse.item.adjustment.title',
    /**
     * Tab id
     * @type {string}
     */
    tabId: 'WAREHOUSE_ITEM_ADJUSTMENT',
    /**
     * Tab icon name or icon config object
     * @type {string | NbIconConfig}
     */
    tabIcon: { icon: 'adjust', pack: 'fa' },
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
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-tabset-app-warehouse-item',
    templateUrl: '../../../tab/tab.component.html',
    styleUrls: ['../../../tab/tab.component.scss'],
})
export class WarehouseItemTabsetComponent
    extends AppTabsetComponent<
        IWarehouseItem, WarehouseItemDatasource,
        WarehouseItemToolbarComponent, AbstractComponent> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private dataModel: IWarehouseItem;

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating the data model whether has been changed
     * @return true for changed; else
     */
    public hasChanged(): boolean {
        return this.getOverviewTab().getFormGroup().dirty;
    }

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
        this.getInOutTab() && this.getInOutTab().setModel(dataModel);
        this.getAdjustmentTab() && this.getAdjustmentTab().setModel(dataModel);
    }

    /**
     * Get the {WarehouseItemOverviewFormlyComponent} instance
     * @return the {WarehouseItemOverviewFormlyComponent} instance
     */
    protected getOverviewTab(): WarehouseItemOverviewFormlyComponent {
        return this.getTabComponent(0, WarehouseItemOverviewFormlyComponent);
    }

    /**
     * Get the {WarehouseItemPurchaseOrdersSmartTableComponent} instance
     * @return the {WarehouseItemPurchaseOrdersSmartTableComponent} instance
     */
    protected getPurchaseTab(): WarehouseItemPurchaseOrdersSmartTableComponent {
        return this.getTabComponent(1, WarehouseItemPurchaseOrdersSmartTableComponent);
    }

    /**
     * Get the {WarehouseItemSaleOrdersSmartTableComponent} instance
     * @return the {WarehouseItemSaleOrdersSmartTableComponent} instance
     */
    protected getSaleTab(): WarehouseItemSaleOrdersSmartTableComponent {
        return this.getTabComponent(2, WarehouseItemSaleOrdersSmartTableComponent);
    }

    /**
     * Get the {WarehouseItemInOutSmartTableComponent} instance
     * @return the {WarehouseItemInOutSmartTableComponent} instance
     */
    protected getInOutTab(): WarehouseItemInOutSmartTableComponent {
        return this.getTabComponent(3, WarehouseItemInOutSmartTableComponent);
    }

    /**
     * Get the {WarehouseItemAdjustmentSmartTableComponent} instance
     * @return the {WarehouseItemAdjustmentSmartTableComponent} instance
     */
    protected getAdjustmentTab(): WarehouseItemAdjustmentSmartTableComponent {
        return this.getTabComponent(4, WarehouseItemAdjustmentSmartTableComponent);
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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            WAREHOUSE_ITEM_TAB_CONFIGS,
            null, [
                WarehouseItemOverviewFormlyComponent,
                WarehouseItemVersionSmartTableComponent,
                WarehouseItemPurchaseOrdersSmartTableComponent,
                WarehouseItemSaleOrdersSmartTableComponent,
                WarehouseItemInOutSmartTableComponent,
                WarehouseItemAdjustmentSmartTableComponent,
            ]);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected doSave(): void {
        throwError('Not support for saving model from internal component!');
    }

    protected doReset(): void {
        throwError('Not support for resetting model from internal component!');
    }

    protected performDelete(): void {
        throwError('Not support for deleting model from internal component!');
    }
}
