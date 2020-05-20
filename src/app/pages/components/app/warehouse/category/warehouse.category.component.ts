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
import {ConfirmPopup} from 'ngx-material-popup';
import {ModalDialogService} from 'ngx-modal-dialog';
import {Lightbox} from 'ngx-lightbox';
import {
    WarehouseCategoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import {
    IWarehouseCategory,
} from '../../../../../@core/data/warehouse/warehouse.category';
import {WarehouseCategoryToolbarComponent} from './warehouse.category.toolbar.component';
import {WarehouseCategoryTreeviewComponent} from './warehouse.category.treeview.component';
import {WarehouseCategoryFormlyComponent} from './warehouse.category.formly.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {AppTreeSplitFormComponent} from '../../components/app.treeview.splitpane.form.component';
import {
    ACTION_DELETE,
    ACTION_IMPORT,
    ACTION_RESET,
    ACTION_SAVE,
} from '../../../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';

/**
 * Warehouse Category split-pane component base on {AngularSplitModule}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_CATEGORY,
    selector: 'ngx-split-pane-app-warehouse-category',
    templateUrl: '../../../splitpane/splitpane.component.html',
    styleUrls: [
        '../../../splitpane/splitpane.component.scss',
        '../../components/app.splitpane.component.scss',
    ],
})
export class WarehouseCategorySplitPaneComponent
    extends AppTreeSplitFormComponent<
        IWarehouseCategory, WarehouseCategoryDatasource,
        WarehouseCategoryToolbarComponent,
        WarehouseCategoryTreeviewComponent,
        WarehouseCategoryFormlyComponent> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected visibleSpecialActions(): String[] {
        return [ACTION_IMPORT];
    }

    protected visibleActions(): String[] {
        return [ACTION_DELETE, ACTION_RESET, ACTION_SAVE];
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseCategorySplitPaneComponent} class
     * @param dataSource {WarehouseCategoryDatasource}
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
    constructor(@Inject(WarehouseCategoryDatasource) dataSource: WarehouseCategoryDatasource,
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
            WarehouseCategoryToolbarComponent,
            WarehouseCategoryTreeviewComponent,
            WarehouseCategoryFormlyComponent);
    }
}
