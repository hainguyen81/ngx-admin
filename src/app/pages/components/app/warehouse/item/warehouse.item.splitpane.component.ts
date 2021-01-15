import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, ViewContainerRef} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {WarehouseItemTabsetComponent} from './warehouse.item.tab.component';
import {WarehouseItemSummaryComponent} from './warehouse.item.summary.component';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {Lightbox} from 'ngx-lightbox';
import {ISplitAreaConfig} from '../../../splitpane/abstract.splitpane.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {ActivatedRoute, Router} from '@angular/router';
import {AppSplitPaneComponent} from '../../components/app.splitpane.component';
import {WarehouseItemToolbarComponent} from './warehouse.item.toolbar.component';
import {throwError} from 'rxjs';

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
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-split-pane-app-warehouse-item',
    templateUrl: '../../../splitpane/splitpane.component.html',
    styleUrls: [
        '../../../splitpane/splitpane.component.scss',
        '../../components/app.splitpane.component.scss',
    ],
})
export class WarehouseItemSplitPaneComponent
    extends AppSplitPaneComponent<
        IWarehouseItem, WarehouseItemDatasource,
        WarehouseItemToolbarComponent,
        WarehouseItemTabsetComponent,
        WarehouseItemSummaryComponent>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private dataModel: IWarehouseItem;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating whether showing panel header
     * @return true (default) for showing; else false
     */
    isShowHeader(): boolean {
        return false;
    }

    /**
     * Get a boolean value indicating the right side component should be created at start-up
     * @return true for should be created; else false
     */
    protected shouldAttachRightSideOnStartup(): boolean {
        return true;
    }

    /**
     * Get a boolean value indicating the data model whether has been changed
     * @return true for changed; else
     */
    public hasChanged(): boolean {
        return (this.summaryComponent && this.summaryComponent.hasChanged())
            || (this.tabsetComponent && this.tabsetComponent.hasChanged());
    }

    /**
     * Get the data model
     * @return data model
     */
    public getDataModel(): IWarehouseItem {
        return this.dataModel;
    }

    /**
     * Get the versions of the data model
     * @return the versions of the data model
     */
    public getDataModelVersions(): IWarehouseItem[] {
        return this.tabsetComponent ? this.tabsetComponent.getDataModelVersions() : [];
    }

    /**
     * Set the data model
     * @param dataModel to apply
     */
    public setDataModel(dataModel: IWarehouseItem): void {
        this.dataModel = dataModel;
        this.summaryComponent && this.summaryComponent.setDataModel(dataModel);
        this.tabsetComponent && this.tabsetComponent.setDataModel(dataModel);
    }

    /**
     * Get the {WarehouseItemTabsetComponent} instance
     * @return the {WarehouseItemTabsetComponent} instance
     */
    protected get tabsetComponent(): WarehouseItemTabsetComponent {
        return this.leftSideComponent;
    }

    /**
     * Get the {WarehouseItemSummaryComponent} instance
     * @return the {WarehouseItemSummaryComponent} instance
     */
    protected get summaryComponent(): WarehouseItemSummaryComponent {
        return this.rightSideComponent;
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
            null, WarehouseItemTabsetComponent, WarehouseItemSummaryComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.configAreaByIndex(0, WarehouseItemTabsetAreaConfig);
        this.configAreaByIndex(1, WarehouseItemSummaryAreaConfig);
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

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Require submit data from all tabs
     * @return false for error; else true
     */
    public submit(): boolean {
        return this.tabsetComponent && this.tabsetComponent.submit();
    }
}
