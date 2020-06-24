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
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {AppSplitPaneComponent} from '../../components/app.splitpane.component';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {WarehouseItemToolbarComponent} from './warehouse.item.toolbar.component';
import {WarehouseItemVersionFormlyComponent} from './warehouse.item.version.formly.component';
import {WarehouseItemSummaryComponent} from './warehouse.item.summary.component';
import {IModalDialog, IModalDialogOptions, ModalDialogComponent, ModalDialogService} from 'ngx-modal-dialog';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, throwError} from 'rxjs';
import {ISplitAreaConfig} from '../../../splitpane/abstract.splitpane.component';
import ObjectUtils from '../../../../../utils/object.utils';

/* Warehouse item version left area configuration */
export const WarehouseItemVersionFormAreaConfig: ISplitAreaConfig = {
    size: 70,
    /*minSize: 20,*/
    maxSize: 70,
    lockSize: false,
    visible: true,
};

/* Warehouse item version right area configuration */
export const WarehouseItemVersionSummaryAreaConfig: ISplitAreaConfig = {
    size: 30,
    /*minSize: 50,*/
    maxSize: 30,
    lockSize: false,
    visible: true,
};

/**
 * Warehouse item version split-pane component base on {AngularSplitModule}
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-split-pane-app-warehouse-item-version',
    templateUrl: '../../../splitpane/splitpane.component.html',
    styleUrls: [
        '../../../splitpane/splitpane.component.scss',
        '../../components/app.splitpane.component.scss',
        './warehouse.item.version.splitpane.component.scss',
    ],
})
export class WarehouseItemVersionSplitPaneComponent
    extends AppSplitPaneComponent<
        IWarehouseItem, WarehouseItemDatasource,
        WarehouseItemToolbarComponent,
        WarehouseItemVersionFormlyComponent,
        WarehouseItemSummaryComponent>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _dataModel?: IWarehouseItem | null;
    private _modifiedDataModel?: IWarehouseItem | null;
    private saveSubject: Subject<IWarehouseItem>;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected shouldAttachRightSideOnStartup(): boolean {
        return true;
    }

    isShowHeader(): boolean {
        return false;
    }

    protected set dataModel(_dataModel: IWarehouseItem) {
        this._dataModel = _dataModel;
        this._modifiedDataModel = ObjectUtils.deepCopy(_dataModel);
        this.getLeftSideComponent().setModel(this._modifiedDataModel);
        (<WarehouseItemSummaryComponent>this.rightSideComponent).setDataModel(this._modifiedDataModel);
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
        this.configAreaByIndex(0, WarehouseItemVersionFormAreaConfig);
        this.configAreaByIndex(1, WarehouseItemVersionSummaryAreaConfig);
        this.detectChanges();
    }

    /**
     * Customize modal dialog component if necessary while the present component is child of this modal.
     * @param modalDialog to customize
     * @param modalDialogElementRef modal dialog element reference {ElementRef}
     * @param childComponent child {IModalDialog} component that has been shown on dialog
     * @param options {IModalDialogOptions}
     */
    protected onDialogInit(
        modalDialog: ModalDialogComponent,
        modalDialogElementRef: ElementRef,
        childComponent: IModalDialog,
        options: Partial<IModalDialogOptions<any>>) {
        super.onDialogInit(modalDialog, modalDialogElementRef, childComponent, options);

        // parse data and save subscription from parent component
        const _this: WarehouseItemVersionSplitPaneComponent =
            <WarehouseItemVersionSplitPaneComponent>childComponent;
        this.saveSubject = (options && options.data['subject'] instanceof Subject
            ? <Subject<IWarehouseItem>>options.data['subject'] : undefined);
        const data: IWarehouseItem = (options && options.data['model']
            ? options.data['model'] as IWarehouseItem : undefined);
        this.saveSubject || throwError('Could not found parent subject to save data!');
        data || throwError('Could not found dialog data!');
        _this.dataModel = data;
        options.actionButtons[0].onAction = () => _this.performSave();
        options.actionButtons[1].onAction = () => _this.performReset();
    }

    protected doSave(): void {
        throwError('Not support for saving model from internal component!');
    }
    private performSave(): boolean {
        if (!this.getLeftSideComponent().submit()) {
            this.showError('warehouse.title', 'common.form.invalid_data');
            return false;
        }

        // apply modified data to parent model
        this._dataModel = Object.assign(this._dataModel, this._modifiedDataModel);
        this.saveSubject.next(this._dataModel);
        return true;
    }

    protected doReset(): void {
        throwError('Not support for resetting model from internal component!');
    }
    private performReset(): boolean {
        this._modifiedDataModel = Object.assign(this._modifiedDataModel, this._dataModel);
        this.getLeftSideComponent().setModel(this._modifiedDataModel);
        (<WarehouseItemSummaryComponent>this.rightSideComponent).setDataModel(this._modifiedDataModel);
        return false;
    }

    protected performDelete(): void {
        throwError('Not support for deleting model from internal component!');
    }
}
