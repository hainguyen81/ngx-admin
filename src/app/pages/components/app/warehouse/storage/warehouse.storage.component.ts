import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, ViewContainerRef} from '@angular/core';
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
import {WarehouseDatasource} from '../../../../../services/implementation/warehouse/warehouse.storage/warehouse.datasource';
import {IWarehouse} from '../../../../../@core/data/warehouse/warehouse';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {AppTreeSplitFormComponent} from '../../components/app.treeview.splitpane.form.component';
import {ACTION_DELETE, ACTION_IMPORT, ACTION_RESET, ACTION_SAVE} from '../../../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';

/**
 * Warehouse Storage split-pane component base on {AngularSplitModule}
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_SETTINGS_STORAGE,
    selector: 'ngx-split-pane-app-warehouse-storage',
    templateUrl: '../../../splitpane/splitpane.component.html',
    styleUrls: [
        '../../../splitpane/splitpane.component.scss',
        '../../components/app.splitpane.component.scss',
    ],
})
export class WarehouseStorageSplitPaneComponent
    extends AppTreeSplitFormComponent<
        IWarehouse, WarehouseDatasource,
        WarehouseStorageToolbarComponent,
        WarehouseStorageTreeviewComponent,
        WarehouseStorageFormlyComponent>
    implements AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get visibleSpecialActions(): String[] {
        return [ACTION_IMPORT];
    }

    protected get visibleActions(): String[] {
        return [ACTION_SAVE, ACTION_RESET, ACTION_DELETE];
    }

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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            WarehouseStorageToolbarComponent,
            WarehouseStorageTreeviewComponent,
            WarehouseStorageFormlyComponent);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    protected requireFormModel(isSave?: boolean): IWarehouse {
        const model: IWarehouse = super.requireFormModel(isSave);
        if (isSave) {
            delete model['parent'], model['children'];
        }
        return model;
    }
}
