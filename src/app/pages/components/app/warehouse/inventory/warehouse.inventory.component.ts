import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
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
import {IdGenerators} from '../../../../../config/generator.config';
import {DeepCloner} from '../../../../../utils/object.utils';
import {
    WarehouseInventoryDetailDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.inventory.detail/warehouse.inventory.detail.datasource';
import {IWarehouseInventoryDetail} from '../../../../../@core/data/warehouse/warehouse.inventory.detail';
import CalculatorUtils from '../../../../../utils/calculator.utils';
import {isArray, isNullOrUndefined} from 'util';

@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-flip-card-app-warehouse-inventory',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../../flipcard/flipcard.component.html',
    styleUrls: [
        '../../../flipcard/flipcard.component.scss',
        '../../components/app.flipcard.component.scss',
        './warehouse.inventory.component.scss',
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

    protected get visibleSpecialActionsOnFront(): String[] {
        return [ACTION_IMPORT];
    }

    protected get visibleActionsOnBack(): String[] {
        return [ACTION_SAVE, ACTION_RESET, ACTION_DELETE, ACTION_BACK];
    }

    protected get fulfillComponentsAtStartup(): boolean {
        return false;
    }

    get selectedModel(): IWarehouseInventory {
        return this._selectedModel;
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
     * @param warehouseInventoryDatasource {WarehouseInventoryDetailDatasource}
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
                @Inject(WarehouseInventoryDetailDatasource)
                private warehouseInventoryDatasource?: WarehouseInventoryDetailDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            WarehouseInventoryToolbarComponent,
            WarehouseInventoryPanelComponent,
            WarehouseInventoryDetailPanelComponent);
        this.warehouseInventoryDatasource
        || throwError('Could not inject WarehouseInventoryDetailDatasource');
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // listener
        if (this.frontComponent) {
            this.frontComponent.setNewItemListener($event => {
                this._selectedModel = null;
                this.ensureBackComponent();
                this.onNewData($event);
                this.setFlipped(true);
            });
            this.frontComponent.setEditItemListener($event => {
                this._selectedModel = ($event && $event.data
                && $event.data['row'] instanceof Row
                    ? ($event.data['row'] as Row).getData() as IWarehouseInventory : undefined);
                this.ensureBackComponent();
                this.onEditData($event);
                this.setFlipped(true);
            });
            this.frontComponent.setDeleteItemListener($event => {
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
        this.backComponent.dataModel = newInst;
    }

    protected onEditData($event: IEvent): void {
        const row: Row = ($event.data && $event.data['row'] instanceof Row ? $event.data['row'] : undefined);
        if (row && row.getData()) {
            this.backComponent.dataModel = row.getData() as IWarehouseInventory;
        } else throwError('Could not found data model to edit');
    }

    /**
     * Call when table wanna delete data
     * @param $event event data {IEvent}
     */
    protected onDeleteData($event: IEvent): void {
        this.getLogger().debug('Flip-table wanna delete data', $event);
    }

    /**
     * Perform saving data
     */
    protected doSave(): void {
        if (!this.backComponent.submit()) {
            if (this.toolbarComponent) {
                this.showError(this.toolbarComponent.getToolbarHeader().title,
                    'common.form.invalid_data');
            } else {
                this.showError('app', 'common.form.invalid_data');
            }
            return;
        }

        // update model if necessary
        const model: IWarehouseInventory = this.backComponent.dataModel;
        const detailData: IWarehouseInventoryDetail[] = this.backComponent.dataModelDetail;
        if (!(model.id || '').length) {
            model.id = IdGenerators.oid.generate();
        }
        detailData.forEach(detail => {
            detail.inventory_id = model.id;
            detail.inventory_code = model.code;
            delete detail.inventory;

            if (!isArray(detail.batches)) {
                detail.batches = [];
            }
            detail.batches.removeSelfIf(batch => {
                return (isNullOrUndefined(batch)
                    || (!(batch.batch_code || '').length && isNaN(batch.quantity)));
            });
            (detail.batches || []).forEach(batch => delete batch['batch']);

            if (!isArray(detail.storage)) {
                detail.storage = [];
            }
            detail.storage.removeSelfIf(storage => {
                return (isNullOrUndefined(storage)
                    || (!(storage.warehouse_code || '').length && isNaN(storage.quantity)));
            });
            (detail.storage || []).forEach(storage => delete storage['storage']);

            if (!isArray(detail.series)) {
                detail.series = [];
            }
            detail.series.removeSelfIf(serial => !(serial || '').length);
        });
        this.getDataSource().update(this.selectedModel, model)
            .then(() => this.warehouseInventoryDatasource.save(detailData)
                .then(() => { this.showSaveDataSuccess(); this.doBack(); })
                .catch(() => this.showSaveDataError()))
            .catch(() => this.showSaveDataError());
    }

    /**
     * Perform resetting data
     */
    protected doReset(): void {
        const cloned: IWarehouseInventory = DeepCloner(this.selectedModel);
        this.backComponent.dataModel = cloned;
    }
}
