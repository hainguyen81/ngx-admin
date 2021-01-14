import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnInit, Renderer2, ViewContainerRef,} from '@angular/core';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {IWarehouseInventory} from '../../../../../@core/data/warehouse/warehouse.inventory';
import {WarehouseInventoryDatasource,} from '../../../../../services/implementation/warehouse/warehouse.inventory/warehouse.inventory.datasource';
import {AppPanelComponent} from '../../components/app.panel.component';
import {WarehouseInventorySearchComponent} from './warehouse.inventory.search.panel.component';
import {WarehouseInventorySmartTableComponent} from './warehouse.inventory.table.component';
import {AbstractComponent, IEvent} from '../../../abstract.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-card-panel-app-warehouse-inventory',
    templateUrl: '../../../panel/panel.component.html',
    styleUrls: [
        '../../../panel/panel.component.scss',
        '../../components/app.search.panel.component.scss',
        './warehouse.inventory.panel.component.scss',
    ],
})
export class WarehouseInventoryPanelComponent
    extends AppPanelComponent<
        IWarehouseInventory, WarehouseInventoryDatasource,
        WarehouseInventorySearchComponent,
        WarehouseInventorySmartTableComponent,
        AbstractComponent>
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {WarehouseInventorySearchComponent} instance
     * @return the {WarehouseInventorySearchComponent} instance
     */
    protected get searchPanel(): WarehouseInventorySearchComponent {
        return this.header as WarehouseInventorySearchComponent;
    }

    /**
     * Get the {WarehouseInventorySmartTableComponent} instance
     * @return the {WarehouseInventorySmartTableComponent} instance
     */
    protected get tableResult(): WarehouseInventorySmartTableComponent {
        return this.body as WarehouseInventorySmartTableComponent;
    }

    /**
     * Set the item new listener
     * @param newItemDelegate listener
     */
    public setNewItemListener(newItemDelegate: (event: IEvent) => void) {
        this.tableResult && newItemDelegate
        && this.tableResult.setNewItemListener(newItemDelegate);
    }

    /**
     * Set the item editing listener
     * @param editItemDelegate listener
     */
    public setEditItemListener(editItemDelegate: (event: IEvent) => void) {
        this.tableResult && editItemDelegate
        && this.tableResult.setEditItemListener(editItemDelegate);
    }

    /**
     * Set the item deleting listener
     * @param deleteItemDelegate listener
     */
    public setDeleteItemListener(deleteItemDelegate: (event: IEvent) => void) {
        this.tableResult && deleteItemDelegate
        && this.tableResult.setDeleteItemListener(deleteItemDelegate);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventoryPanelComponent} class
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
            router, activatedRoute,
            WarehouseInventorySearchComponent,
            WarehouseInventorySmartTableComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();
        this.panelClass = 'inventory-front-panel';
        this.headerClass = 'inventory-front-header';
        this.bodyClass = 'inventory-front-body';
        this.footerClass = 'inventory-front-footer';
    }
}