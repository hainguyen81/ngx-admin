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
import {BaseFlipcardComponent} from '../../../flipcard/base.flipcard.component';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {WarehouseItemSmartTableComponent} from './warehouse.item.table.component';
import {WarehouseItemSplitPaneComponent} from './warehouse.item.splitpane.component';
import WarehouseItem, {ITEM_STATUS} from '../../../../../@core/data/warehouse/warehouse.item';
import {Lightbox} from 'ngx-lightbox';
import {IEvent} from '../../../abstract.component';
import {
    ACTION_DELETE,
    ACTION_RESET,
    ACTION_SAVE,
    IToolbarActionsConfig,
} from '../../../toolbar/abstract.toolbar.component';
import {ACTION_BACK} from './warehouse.item.toolbar.component';

@Component({
    selector: 'ngx-flip-card-warehouse-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../../flipcard/flipcard.component.html',
    styleUrls: ['../../../flipcard/flipcard.component.scss', './warehouse.item.flipcard.component.scss'],
})
export class WarehouseItemFlipcardComponent extends BaseFlipcardComponent<WarehouseItemDatasource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private warehouseItemTableComponentFront: WarehouseItemSmartTableComponent;
    private warehouseItemSplitPaneComponentBack: WarehouseItemSplitPaneComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {WarehouseItemSmartTableComponent} instance
     * @return the {WarehouseItemSmartTableComponent} instance
     */
    protected getWarehouseItemTableComponentFront(): WarehouseItemSmartTableComponent {
        return this.warehouseItemTableComponentFront;
    }

    /**
     * Get the {WarehouseItemSplitPaneComponent} instance
     * @return the {WarehouseItemSplitPaneComponent} instance
     */
    protected getWarehouseItemSplitPaneComponentBack(): WarehouseItemSplitPaneComponent {
        return this.warehouseItemSplitPaneComponentBack;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemFlipcardComponent} class
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
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // Create flip components
        this.createFlipComponents();
    }

    /**
     * Raise when toolbar action item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {IToolbarActionsConfig}
     */
    onClickAction(event: IEvent) {
        if (!event || !event.$data || !(event.$data as IToolbarActionsConfig)) {
            return;
        }
        let action: IToolbarActionsConfig;
        action = event.$data as IToolbarActionsConfig;
        switch (action.id) {
            case ACTION_SAVE:
                // TODO Waiting for saving
                break;
            case ACTION_RESET:
                // TODO Waiting for resetting
                break;
            case ACTION_DELETE:
                // TODO Waiting for deleting
                break;
            case ACTION_BACK:
                this.setFlipped(false);
                break;
        }
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Create flip view components
     */
    private createFlipComponents(): void {
        // create table component
        this.warehouseItemTableComponentFront = super.setFrontComponent(WarehouseItemSmartTableComponent);
        this.warehouseItemTableComponentFront.setNewItemListener(
            ($event) => {
                this.getWarehouseItemSplitPaneComponentBack().setDataModel(
                    new WarehouseItem(null, null, null,
                        ITEM_STATUS.NOT_ACTIVATED, null, null, []));
                this.setFlipped(true);
            });
        this.warehouseItemSplitPaneComponentBack = super.setBackComponent(WarehouseItemSplitPaneComponent);
        this.warehouseItemSplitPaneComponentBack.setToolbarActionsListener((e) => this.onClickAction(e));
    }
}
