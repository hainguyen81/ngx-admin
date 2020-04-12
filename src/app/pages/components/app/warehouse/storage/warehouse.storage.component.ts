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
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ConfirmPopup} from 'ngx-material-popup';
import {ModalDialogService} from 'ngx-modal-dialog';
import {Lightbox} from 'ngx-lightbox';
import {WarehouseStorageToolbarComponent} from './warehouse.storage.toolbar.component';
import {WarehouseStorageTreeviewComponent} from './warehouse.storage.treeview.component';
import {WarehouseStorageFormlyComponent} from './warehouse.storage.formly.component';
import {WarehouseDatasource} from '../../../../../services/implementation/warehouse/warehouse/warehouse.datasource';
import {IWarehouse} from '../../../../../@core/data/warehouse/warehouse';
import {AppSplitPaneComponent} from '../../components/app.splitpane.component';

/**
 * Warehouse Storage split-pane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane-warehouse-storage',
    templateUrl: '../../../splitpane/splitpane.component.html',
})
export class WarehouseStorageSplitPaneComponent
    extends AppSplitPaneComponent<IWarehouse, WarehouseDatasource,
        WarehouseStorageToolbarComponent,
        WarehouseStorageTreeviewComponent,
        WarehouseStorageFormlyComponent>
    implements AfterViewInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseStorageSplitPaneComponent} class
     * @param dataSource {WarehouseDatasource}
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
    constructor(@Inject(WarehouseDatasource) dataSource: WarehouseDatasource,
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
            modalDialogService, confirmPopup, lightbox,
            WarehouseStorageToolbarComponent,
            WarehouseStorageTreeviewComponent,
            WarehouseStorageFormlyComponent);
    }
}
