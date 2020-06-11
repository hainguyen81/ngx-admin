import {
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
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {
    AppToolbarComponent,
    AppToolbarServiceWorkerExecActionsConfig,
} from '../../components/app.toolbar.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {IToolbarActionsConfig, IToolbarHeaderConfig} from '../../../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {
    WarehouseInventoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.inventory/warehouse.inventory.datasource';
import ObjectUtils from '../../../../../utils/object.utils';

/* default warehouse inventory toolbar header config */
export const WarehouseInventoryToolbarHeaderConfig: IToolbarHeaderConfig = {
    title: 'warehouse.inventory.title',
    icon: {icon: 'truck-loading', pack: 'fas'},
};

/* default warehouse inventory toolbar actions config */
export const WarehouseInventoryToolbarActionsConfig: IToolbarActionsConfig[] =
    [].concat(ObjectUtils.deepCopy(AppToolbarServiceWorkerExecActionsConfig));

/**
 * Toolbar component base on {MatToolbar}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-toolbar-app-warehouse-inventory',
    templateUrl: '../../../toolbar/toolbar.component.html',
    styleUrls: ['../../../toolbar/toolbar.component.scss',
        '../../components/app.toolbar.component.scss'],
})
export class WarehouseInventoryToolbarComponent
    extends AppToolbarComponent<WarehouseInventoryDatasource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventoryToolbarComponent} class
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
            router, activatedRoute);
        super.setToolbarHeader(WarehouseInventoryToolbarHeaderConfig);
        super.setActions(WarehouseInventoryToolbarActionsConfig);
    }
}
