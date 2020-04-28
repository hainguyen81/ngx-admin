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
import {IToolbarActionsConfig, IToolbarHeaderConfig} from '../../../toolbar/abstract.toolbar.component';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {
    WarehouseItemDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {Lightbox} from 'ngx-lightbox';
import {
    AppToolbarComponent,
    AppToolbarImportActionsConfig,
} from '../../components/app.toolbar.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;

/* default warehouse item toolbar header config */
export const WarehouseItemToolbarHeaderConfig: IToolbarHeaderConfig = {
    title: 'warehouse.item.title',
    icon: {icon: 'boxes', pack: 'fa'},
};

/* default warehouse item toolbar actions config */
export const WarehouseItemToolbarActionsConfig: IToolbarActionsConfig[] = [].concat(AppToolbarImportActionsConfig);

/**
 * Toolbar component base on {MatToolbar}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-toolbar-warehouse-item',
    templateUrl: '../../../toolbar/toolbar.component.html',
    styleUrls: ['../../../toolbar/toolbar.component.scss'],
})
export class WarehouseItemToolbarComponent extends AppToolbarComponent<WarehouseItemDatasource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemToolbarComponent} class
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
        super.setToolbarHeader(WarehouseItemToolbarHeaderConfig);
        super.setActions(WarehouseItemToolbarActionsConfig);
    }
}
