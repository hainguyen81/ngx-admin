/**
 * WarehouseItem split-pane component base on {AngularSplitModule}
 */
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {WarehouseItemTabsetComponent} from './partial/tabset/warehouse-item.tabset.component';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ContextMenuService} from 'ngx-contextmenu';
import {BaseFlipcardComponent} from '../../../flipcard/base.flipcard.component';
import {ConfirmPopup} from 'ngx-material-popup';
import {TranslateService} from '@ngx-translate/core';
import {WarehouseItemFlipcardDatasource} from '../../../../../services/implementation/warehouse-item/warehouse-item.flipcard.datasource';
import WarehouseItemSmartTable from '../../../../../@core/data/warehouse-item.smarttable';
import {WarehouseItemSmartTableComponent} from './partial/smarttable/warehouse-item.smarttable.component';

@Component({
    selector: 'ngx-flip-card-warehouse-item',
    templateUrl: '../../../flipcard/flipcard.component.html',
    styleUrls: ['../../../flipcard/flipcard.component.scss'],
})
export class WarehouseItemFlipcardComponent
    extends BaseFlipcardComponent<WarehouseItemFlipcardDatasource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    // private warehouseItemToolbarComponent: WarehouseItemToolbarComponent;
    private WarehouseItemSmartTableComponent: WarehouseItemSmartTableComponent;
    private warehouseItemTabsetComponent: WarehouseItemTabsetComponent;
    private selectedWarehouseItem: WarehouseItemSmartTable | null;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the selected {IWarehouseItem} instance
     * @return the selected {IWarehouseItem} instance
     */
    protected getSelectedWarehouseItem(): WarehouseItemSmartTable {
        return this.selectedWarehouseItem;
    }

    /**
     * Get the {WarehouseItemSmartTableComponent} instance
     * @return the {WarehouseItemSmartTableComponent} instance
     */
    protected getSmartTableComponent(): WarehouseItemSmartTableComponent {
        return this.WarehouseItemSmartTableComponent;
    }

    /**
     * Get the {warehouseItemFormlyComponent} instance
     * @return the {warehouseItemFormlyComponent} instance
     */
    protected getTabsetComponent(): WarehouseItemTabsetComponent {
        return this.warehouseItemTabsetComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {BaseFlipcardComponent} class
     * @param dataSource {WarehouseItemFlipcardDatasource}
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
    public constructor(@Inject(WarehouseItemFlipcardDatasource) dataSource: WarehouseItemFlipcardDatasource,
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
            modalDialogService, confirmPopup);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // Create front/back component
        this.createFlipsComponents();
    }

    /**
     * Create left/right component panes
     */
    private createFlipsComponents() {
        super.setFrontComponent(WarehouseItemSmartTableComponent);
        // super.setBackComponent(WarehouseItemTabsetComponent);
    }
}
