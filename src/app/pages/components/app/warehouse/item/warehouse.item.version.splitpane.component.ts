import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ComponentRef, ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {AppSplitPaneComponent} from '../../components/app.splitpane.component';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {WarehouseItemToolbarComponent} from './warehouse.item.toolbar.component';
import {WarehouseItemVersionFormlyComponent} from './warehouse.item.version.formly.component';
import {WarehouseItemSummaryComponent} from './warehouse.item.summary.component';
import {IModalDialog, IModalDialogOptions, ModalDialogService} from 'ngx-modal-dialog';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {throwError} from 'rxjs';

/**
 * Warehouse item version split-pane component base on {AngularSplitModule}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-split-pane-app-warehouse-item-version',
    templateUrl: '../../../splitpane/splitpane.component.html',
    styleUrls: ['../../../splitpane/splitpane.component.scss'],
})
export class WarehouseItemVersionSplitPaneComponent
    extends AppSplitPaneComponent<
        IWarehouseItem, WarehouseItemDatasource,
        WarehouseItemToolbarComponent,
        WarehouseItemVersionFormlyComponent,
        WarehouseItemSummaryComponent>
    implements IModalDialog, AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected shouldAttachRightSideOnStartup(): boolean {
        return true;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemVersionSplitPaneComponent} class
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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            null,
            WarehouseItemVersionFormlyComponent,
            WarehouseItemSummaryComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // using for item version
        (<WarehouseItemSummaryComponent>this.rightSideComponent).forVersion = true;
    }

    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>): void {
        this.getLogger().debug('Dialog Initialization', reference, options);
    }

    protected doSave(): void {
        throwError('Not support for saving model from internal component!');
    }

    protected doReset(): void {
        throwError('Not support for resetting model from internal component!');
    }

    protected performDelete(): void {
        throwError('Not support for deleting model from internal component!');
    }
}
