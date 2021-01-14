import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, ViewContainerRef,} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {AppToolbarComponent, AppToolbarImportActionsConfig,} from '../../components/app.toolbar.component';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import {IToolbarActionsConfig, IToolbarHeaderConfig} from '../../../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {WarehouseBatchNoDatasource,} from '../../../../../services/implementation/warehouse/warehouse.batchno/warehouse.batchno.datasource';

/* default warehouse batch no toolbar header config */
export const WarehouseBatchNoToolbarHeaderConfig: IToolbarHeaderConfig = {
    title: 'warehouse.batch_no.title',
    icon: {icon: 'clock', pack: 'fas'},
};

/* default warehouse batch no toolbar actions config */
export const WarehouseBatchNoToolbarActionsConfig: IToolbarActionsConfig[] = [].concat(AppToolbarImportActionsConfig);

/**
 * Toolbar component base on {MatToolbar}
 */
@Component({
    moduleId: Constants.COMMON.MODULE_CODES.WAREHOUSE_SETTINGS_BATCH,
    selector: 'ngx-toolbar-app-warehouse-batch-no',
    templateUrl: '../../../toolbar/toolbar.component.html',
    styleUrls: ['../../../toolbar/toolbar.component.scss',
        '../../components/app.toolbar.component.scss'],
})
export class WarehouseBatchNoToolbarComponent extends AppToolbarComponent<WarehouseBatchNoDatasource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseBatchNoToolbarComponent} class
     * @param dataSource {WarehouseBatchNoDatasource}
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
    constructor(@Inject(WarehouseBatchNoDatasource) dataSource: WarehouseBatchNoDatasource,
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
        super.setToolbarHeader(WarehouseBatchNoToolbarHeaderConfig);
        super.setActions(WarehouseBatchNoToolbarActionsConfig);
    }
}
