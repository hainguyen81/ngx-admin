import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, ViewContainerRef} from '@angular/core';
import {DataSource} from '@app/types/index';
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
import {ActivatedRoute, Router} from '@angular/router';
import {AppTabsetComponent} from '../../components/app.tabset.component';
import {WarehouseItemToolbarComponent} from './warehouse.item.toolbar.component';
import {AbstractComponent} from '../../../abstract.component';
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
    tabIcon: { icon: 'code-branch', pack: 'fas' },
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

/**
 * @deprecated Currently NbTabsetComponent component has problem with dynamic component. Insted of using tabset (ngx-tabset-2)
 */
@Component({
    moduleId: Constants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'nbx-tabset-app-warehouse-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
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

    private __dataModel: IWarehouseItem;

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating the data model whether has been changed
     * @return true for changed; else
     */
    public get hasChanged(): boolean {
        return this.overviewTab && this.overviewTab.getFormGroup() && this.overviewTab.getFormGroup().dirty;
    }

    /**
     * Get the data model
     * @return data model
     */
    public get dataModel(): IWarehouseItem {
        return this.__dataModel;
    }

    /**
     * Get the versions of the data model
     * @return the versions of the data model
     */
    public get dataModelVersions(): IWarehouseItem[] {
        return this.versionTab ? this.versionTab.getVersions() : [];
    }

    /**
     * Set the data model
     * @param dataModel to apply
     */
    public set dataModel(__dataModel: IWarehouseItem) {
        this.__dataModel = __dataModel;
        this.overviewTab && this.overviewTab.setModel(__dataModel);
        this.versionTab && this.versionTab.setDataModel(__dataModel);
        this.purchaseTab && this.purchaseTab.setModel(__dataModel);
        this.saleTab && this.saleTab.setModel(__dataModel);
        this.inOutTab && this.inOutTab.setModel(__dataModel);
        this.adjustmentTab && this.adjustmentTab.setModel(__dataModel);
    }

    /**
     * Get the {WarehouseItemOverviewFormlyComponent} instance
     * @return the {WarehouseItemOverviewFormlyComponent} instance
     */
    protected get overviewTab(): WarehouseItemOverviewFormlyComponent {
        return this.getTabComponent(0, WarehouseItemOverviewFormlyComponent);
    }

    /**
     * Get the {WarehouseItemVersionSmartTableComponent} instance
     * @return the {WarehouseItemVersionSmartTableComponent} instance
     */
    protected get versionTab(): WarehouseItemVersionSmartTableComponent {
        return this.getTabComponent(1, WarehouseItemVersionSmartTableComponent);
    }

    /**
     * Get the {WarehouseItemPurchaseOrdersSmartTableComponent} instance
     * @return the {WarehouseItemPurchaseOrdersSmartTableComponent} instance
     */
    protected get purchaseTab(): WarehouseItemPurchaseOrdersSmartTableComponent {
        return this.getTabComponent(2, WarehouseItemPurchaseOrdersSmartTableComponent);
    }

    /**
     * Get the {WarehouseItemSaleOrdersSmartTableComponent} instance
     * @return the {WarehouseItemSaleOrdersSmartTableComponent} instance
     */
    protected get saleTab(): WarehouseItemSaleOrdersSmartTableComponent {
        return this.getTabComponent(3, WarehouseItemSaleOrdersSmartTableComponent);
    }

    /**
     * Get the {WarehouseItemInOutSmartTableComponent} instance
     * @return the {WarehouseItemInOutSmartTableComponent} instance
     */
    protected get inOutTab(): WarehouseItemInOutSmartTableComponent {
        return this.getTabComponent(4, WarehouseItemInOutSmartTableComponent);
    }

    /**
     * Get the {WarehouseItemAdjustmentSmartTableComponent} instance
     * @return the {WarehouseItemAdjustmentSmartTableComponent} instance
     */
    protected get adjustmentTab(): WarehouseItemAdjustmentSmartTableComponent {
        return this.getTabComponent(5, WarehouseItemAdjustmentSmartTableComponent);
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
        throw new Error('Not support for saving model from internal component!');
    }

    protected doReset(): void {
        throw new Error('Not support for resetting model from internal component!');
    }

    protected performDelete(): void {
        throw new Error('Not support for deleting model from internal component!');
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Require submit data from all tabs
     * @return false for error; else true
     */
    public submit(): boolean {
        if (!this.overviewTab || !this.overviewTab.submit()) {
            this.tabsetComponent.selectTab(this.tabsComponent[0]);
            this.showError('warehouse.title', 'common.form.invalid_data');
            return false;
        }

        return true;
    }
}
