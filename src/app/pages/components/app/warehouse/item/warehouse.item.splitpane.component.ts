import {BaseSplitPaneComponent} from '../../../splitpane/base.splitpane.component';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {
    AfterViewInit,
    ChangeDetectorRef, Component,
    ComponentFactoryResolver, ElementRef,
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
import {throwError} from 'rxjs';
import {WarehouseItemTabsetComponent} from './warehouse.item.tab.component';
import {ACTION_BACK, WarehouseItemToolbarComponent} from './warehouse.item.toolbar.component';
import {IEvent} from '../../../abstract.component';
import {
    ACTION_DELETE,
    ACTION_RESET,
    ACTION_SAVE,
    IToolbarActionsConfig,
} from '../../../toolbar/abstract.toolbar.component';
import {WarehouseItemSummaryComponent} from './warehouse.item.summary.component';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {Lightbox} from 'ngx-lightbox';
import {ISplitAreaConfig} from '../../../splitpane/abstract.splitpane.component';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = Constants.COMMON.MODULE_CODES;

/* Warehouse item left area configuration */
export const WarehouseItemTabsetAreaConfig: ISplitAreaConfig = {
    size: 70,
    /*minSize: 20,*/
    maxSize: 70,
    lockSize: false,
    visible: true,
};

/* Warehouse item right area configuration */
export const WarehouseItemSummaryAreaConfig: ISplitAreaConfig = {
    size: 30,
    /*minSize: 50,*/
    maxSize: 30,
    lockSize: false,
    visible: true,
};

@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-split-pane-warehouse-item',
    templateUrl: '../../../splitpane/splitpane.component.html',
    styleUrls: ['../../../splitpane/splitpane.component.scss', './warehouse.item.splitpane.component.scss'],
})
export class WarehouseItemSplitPaneComponent
    extends BaseSplitPaneComponent<WarehouseItemDatasource> implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private warehouseTabsetComponent: WarehouseItemTabsetComponent;
    private warehouseSummaryComponent: WarehouseItemSummaryComponent;
    private warehouseToolbarComponent: WarehouseItemToolbarComponent;
    private warehouseToolbarActionsListener: (e: IEvent) => void;
    private dataModel: IWarehouseItem;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating the data model whether has been changed
     * @return true for changed; else
     */
    public hasChanged(): boolean {
        return this.getSummaryComponent().hasChanged()
            || this.getTabsetComponent().hasChanged();
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
        if (this.getSummaryComponent()) {
            this.getSummaryComponent().setDataModel(dataModel);
        }
        if (this.getTabsetComponent()) {
            this.getTabsetComponent().setDataModel(dataModel);
        }
    }

    /**
     * Get the {WarehouseItemTabsetComponent} instance
     * @return the {WarehouseItemTabsetComponent} instance
     */
    protected getTabsetComponent(): WarehouseItemTabsetComponent {
        return this.warehouseTabsetComponent;
    }

    /**
     * Get the {WarehouseItemSummaryComponent} instance
     * @return the {WarehouseItemSummaryComponent} instance
     */
    protected getSummaryComponent(): WarehouseItemSummaryComponent {
        return this.warehouseSummaryComponent;
    }

    /**
     * Get the {WarehouseItemToolbarComponent} instance
     * @return the {WarehouseItemToolbarComponent} instance
     */
    protected getToolbarComponent(): WarehouseItemToolbarComponent {
        return this.warehouseToolbarComponent;
    }

    /**
     * Set the toolbar actions listener
     * @param listener to apply
     */
    public setToolbarActionsListener(listener: (e: IEvent) => void): void {
        this.warehouseToolbarActionsListener = listener;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemSplitPaneComponent} class
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
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        confirmPopup || throwError('Could not inject ConfirmPopup');
        super.setHorizontal(true);
        super.setNumberOfAreas(2);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // Create left/right component panes
        this.createPaneComponents();
    }

    /**
     * Raise when toolbar action item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {IToolbarActionsConfig}
     */
    onClickAction(event: IEvent) {
        if (!event || !event.$data || !(event.$data as IToolbarActionsConfig)) {
            return;
        }
        if (!this.warehouseToolbarActionsListener) {
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
                    // TODO Waiting for backing
                    break;
            }
        } else this.warehouseToolbarActionsListener.apply(this, [ event ]);
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Create left/right component panes
     */
    private createPaneComponents() {
        // create toolbar
        this.warehouseToolbarComponent = super.setToolbarComponent(WarehouseItemToolbarComponent);
        this.warehouseToolbarComponent.actionListener().subscribe((e: IEvent) => this.onClickAction(e));

        // create tabset component at left side
        this.warehouseTabsetComponent = super.setAreaComponent(0, WarehouseItemTabsetComponent);
        this.configAreaByIndex(0, WarehouseItemTabsetAreaConfig);

        // create summary component at the right side
        this.warehouseSummaryComponent = super.setAreaComponent(1, WarehouseItemSummaryComponent);
        this.configAreaByIndex(1, WarehouseItemSummaryAreaConfig);
    }
}
