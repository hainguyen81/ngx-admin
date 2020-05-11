import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2, ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IEvent} from '../../../abstract.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {
    ACTION_BACK,
    ACTION_DELETE,
    ACTION_IMPORT,
    ACTION_RESET,
    ACTION_SAVE,
} from '../../../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {
    WarehouseInventoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.inventory/warehouse.inventory.datasource';
import {
    WarehouseInventoryToolbarComponent,
} from './warehouse.inventory.toolbar.component';
import {
    WarehouseInventoryPanelComponent,
} from './warehouse.inventory.panel.component';
import {AppFlipcardComponent} from '../../components/app.flipcard.component';
import WarehouseInventory, {IWarehouseInventory} from '../../../../../@core/data/warehouse/warehouse.inventory';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {WarehouseInventoryDetailPanelComponent} from './warehouse.inventory.detail.panel.component';
import {throwError} from 'rxjs';

@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-flip-card-app-warehouse-inventory',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../../flipcard/flipcard.component.html',
    styleUrls: [
        '../../../flipcard/flipcard.component.scss',
        '../../components/app.flipcard.component.scss',
    ],
})
export class WarehouseInventoryComponent
    extends AppFlipcardComponent<
        WarehouseInventoryDatasource,
        WarehouseInventoryToolbarComponent,
        WarehouseInventoryPanelComponent,
        WarehouseInventoryDetailPanelComponent>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _selectedModel: IWarehouseInventory;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected visibleSpecialActionsOnFront(): String[] {
        return [ACTION_IMPORT];
    }

    protected visibleActionsOnBack(): String[] {
        return [ACTION_SAVE, ACTION_RESET, ACTION_DELETE, ACTION_BACK];
    }

    protected fulfillComponentsAtStartup(): boolean {
        return false;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventoryComponent} class
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
            WarehouseInventoryToolbarComponent,
            WarehouseInventoryPanelComponent,
            WarehouseInventoryDetailPanelComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // listener
        if (super.getFrontComponent()) {
            this.getFrontComponent().setNewItemListener($event => {
                this._selectedModel = null;
                this.ensureBackComponent();
                this.onNewData($event);
                this.setFlipped(true);
            });
            this.getFrontComponent().setEditItemListener($event => {
                this._selectedModel = ($event && $event.data
                && $event.data['row'] instanceof Row
                    ? ($event.data['row'] as Row).getData() as IWarehouseInventory : undefined);
                this.ensureBackComponent();
                this.onEditData($event);
                this.setFlipped(true);
            });
            this.getFrontComponent().setDeleteItemListener($event => {
                this._selectedModel = ($event && $event.data
                && $event.data['row'] instanceof Row
                    ? ($event.data['row'] as Row).getData() as IWarehouseInventory : undefined);
                this.ensureBackComponent();
                this.onDeleteData($event);
                this.setFlipped(false);
            });
        }
    }

    /**
     * Perform going back data
     */
    protected doBack(): void {
        // back to front
        this._selectedModel = undefined;
        this.setFlipped(false);
    }

    protected onNewData($event: IEvent): void {
        const newInst: IWarehouseInventory =
            new WarehouseInventory(null, null, null, null, null, null);
        super.getBackComponent().dataModel = newInst;
    }

    protected onEditData($event: IEvent): void {
        const row: Row = ($event.data && $event.data['row'] instanceof Row ? $event.data['row'] : undefined);
        if (row && row.getData()) {
            super.getBackComponent().dataModel = row.getData() as IWarehouseInventory;
        } else throwError('Could not found data model to edit');
    }

    /**
     * Call when table wanna delete data
     * @param $event event data {IEvent}
     */
    protected onDeleteData($event: IEvent): void {
        this.getLogger().debug('Flip-table wanna delete data', $event);
    }
}
