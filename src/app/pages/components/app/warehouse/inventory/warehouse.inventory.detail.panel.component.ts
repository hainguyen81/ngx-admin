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
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {AppPanelComponent} from '../../components/app.panel.component';
import {AbstractComponent} from '../../../abstract.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {WarehouseInventoryMainFormlyComponent} from './warehouse.inventory.main.formly.component';
import {WarehouseInventoryDetailSmartTableComponent} from './warehouse.inventory.detail.table.component';
import {IWarehouseInventoryDetail} from '../../../../../@core/data/warehouse/warehouse.inventory.detail';
import {
    WarehouseInventoryDetailDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.inventory.detail/warehouse.inventory.detail.datasource';
import {IWarehouseInventory} from '../../../../../@core/data/warehouse/warehouse.inventory';
import {isNullOrUndefined} from 'util';

@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-card-panel-app-warehouse-inventory-detail',
    templateUrl: '../../../panel/panel.component.html',
    styleUrls: [
        '../../../panel/panel.component.scss',
        '../../components/app.search.panel.component.scss',
        './warehouse.inventory.panel.component.scss',
        './warehouse.inventory.detail.panel.component.scss',
    ],
})
export class WarehouseInventoryDetailPanelComponent
    extends AppPanelComponent<
        IWarehouseInventoryDetail, WarehouseInventoryDetailDatasource,
        WarehouseInventoryMainFormlyComponent,
        AbstractComponent,
        WarehouseInventoryDetailSmartTableComponent>
    implements OnInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _dataModel: IWarehouseInventory;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {WarehouseInventoryMainFormlyComponent} instance
     * @return the {WarehouseInventoryMainFormlyComponent} instance
     */
    protected get mainForm(): WarehouseInventoryMainFormlyComponent {
        return this.header as WarehouseInventoryMainFormlyComponent;
    }

    /**
     * Get the {WarehouseInventoryDetailSmartTableComponent} instance
     * @return the {WarehouseInventoryDetailSmartTableComponent} instance
     */
    protected get detailTable(): WarehouseInventoryDetailSmartTableComponent {
        return this.footer as WarehouseInventoryDetailSmartTableComponent;
    }

    /**
     * Get the main model {IWarehouseInventory} instance
     * @return the main model {IWarehouseInventory} instance
     */
    get dataModel(): IWarehouseInventory {
        return this._dataModel;
    }

    /**
     * Set the main model {IWarehouseInventory} instance
     * @param _dataModel to apply
     */
    set dataModel(_dataModel: IWarehouseInventory) {
        this._dataModel = _dataModel;
        this.mainForm && this.mainForm.setModel(this._dataModel);
        if (!isNullOrUndefined(this.detailTable)) {
            this.detailTable.model = this._dataModel;
        }
    }

    /**
     * Get the {IWarehouseInventoryDetail} data array
     * @return the {IWarehouseInventoryDetail} data array
     */
    get dataModelDetail(): IWarehouseInventoryDetail[] {
        const detailData: IWarehouseInventoryDetail[] = [];
        if (isNullOrUndefined(this.detailTable)) {
            return detailData;
        }
        (this.detailTable.rows || []).forEach(row => {
            const detail: IWarehouseInventoryDetail =
                (row ? row.getData() as IWarehouseInventoryDetail : undefined);
            detail && detailData.push(detail);
        });
        return detailData;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventoryDetailPanelComponent} class
     * @param dataSource {WarehouseInventoryDetailDatasource}
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
    constructor(@Inject(WarehouseInventoryDetailDatasource) dataSource: WarehouseInventoryDetailDatasource,
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
            WarehouseInventoryMainFormlyComponent,
            null,
            WarehouseInventoryDetailSmartTableComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();
        this.panelClass = 'inventory-detail-panel';
        this.headerClass = 'inventory-detail-main-header';
        this.bodyClass = 'inventory-detail-sale-orders-body';
        this.footerClass = 'inventory-detail-table-footer';
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Save/SUbmit data model
     * @return true for valid; else false
     */
    submit(): boolean {
        const valid: boolean = (this.mainForm.submit() && this.detailTable.validate());
        if (valid) {
            this._dataModel = Object.assign({}, this._dataModel, this.mainForm.getModel());
        }
        return valid;
    }
}
