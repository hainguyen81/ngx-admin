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
import {BaseSplitPaneComponent} from '../../../splitpane/base.splitpane.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ISplitAreaConfig} from '../../../splitpane/abstract.splitpane.component';
import {IEvent} from '../../../abstract.component';
import {
    ACTION_DELETE,
    ACTION_RESET,
    ACTION_SAVE,
    IToolbarActionsConfig,
} from '../../../toolbar/abstract.toolbar.component';
import ObjectUtils, {DeepCloner} from '../../../../../utils/object.utils';
import {ToastrService} from 'ngx-toastr';
import {ConfirmPopup} from 'ngx-material-popup';
import {throwError} from 'rxjs';
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
import {TreeviewItem} from 'ngx-treeview';

/* Warehouse category left area configuration */
export const WarehouseCategoryTreeAreaConfig: ISplitAreaConfig = {
    size: 30,
    /*minSize: 20,*/
    maxSize: 30,
    lockSize: false,
    visible: true,
};

/* Warehouse category right area configuration */
export const WarehouseCategoryFormAreaConfig: ISplitAreaConfig = {
    size: 70,
    /*minSize: 50,*/
    maxSize: 70,
    lockSize: false,
    visible: true,
};

/**
 * Warehouse Category split-pane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane-warehouse-category',
    templateUrl: '../../../splitpane/splitpane.component.html',
    styleUrls: ['../../../splitpane/splitpane.component.scss'],
})
export class WarehouseCategorySplitPaneComponent
    extends BaseSplitPaneComponent<WarehouseCategoryDatasource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private warehouseCategoryToolbarComponent: WarehouseCategoryToolbarComponent;
    private warehouseCategoryTreeviewComponent: WarehouseCategoryTreeviewComponent;
    private warehouseCategoryFormlyComponent: WarehouseCategoryFormlyComponent;
    private selectedWarehouseCategory: IWarehouseCategory | null;
    private selectedWarehouseCategoryItem: TreeviewItem | null;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the selected {IWarehouseCategory} instance
     * @return the selected {IWarehouseCategory} instance
     */
    protected getSelectedWarehouseCategory(): IWarehouseCategory {
        return this.selectedWarehouseCategory;
    }

    /**
     * Get the selected {TreeviewItem} instance
     * @return the selected {TreeviewItem} instance
     */
    protected getSelectedWarehouseCategoryItem(): TreeviewItem {
        return this.selectedWarehouseCategoryItem;
    }

    /**
     * Get the {WarehouseCategoryTreeviewComponent} instance
     * @return the {WarehouseCategoryTreeviewComponent} instance
     */
    protected getTreeviewComponent(): WarehouseCategoryTreeviewComponent {
        return this.warehouseCategoryTreeviewComponent;
    }

    /**
     * Get the {WarehouseCategoryFormlyComponent} instance
     * @return the {WarehouseCategoryFormlyComponent} instance
     */
    protected getFormlyComponent(): WarehouseCategoryFormlyComponent {
        return this.warehouseCategoryFormlyComponent;
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
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        confirmPopup || throwError('Could not inject ConfirmPopup');
        super.setHorizontal(true);
        super.setNumberOfAreas(2);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // Create left/right component panes
        this.createPaneComponents();
    }

    /**
     * Raise when toolbar action item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {IToolbarActionsConfig}
     */
    onClickAction(event: IEvent) {
        if (!event || !event.$data || !(event.$data as IToolbarActionsConfig)) {
            return;
        }
        let action: IToolbarActionsConfig;
        action = event.$data as IToolbarActionsConfig;
        switch (action.id) {
            case ACTION_SAVE:
                this.doSave();
                break;
            case ACTION_RESET:
                this.doReset();
                break;
            case ACTION_DELETE:
                this.doDelete();
                break;
        }
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Create left/right component panes
     */
    private createPaneComponents() {
        // configure areas
        this.configAreaByIndex(0, WarehouseCategoryTreeAreaConfig);
        this.configAreaByIndex(1, WarehouseCategoryFormAreaConfig);

        // create toolbar component
        this.warehouseCategoryToolbarComponent = super.setToolbarComponent(WarehouseCategoryToolbarComponent);
        this.warehouseCategoryToolbarComponent.actionListener()
            .subscribe((e: IEvent) => this.onClickAction(e));

        // create tree-view component
        this.warehouseCategoryTreeviewComponent = super.setAreaComponent(0, WarehouseCategoryTreeviewComponent);
        // handle click tree-view item to show form
        this.warehouseCategoryTreeviewComponent.setClickItemListener((e, it) => {
            this.selectedWarehouseCategoryItem = it;
            if (it && it.value) {
                let category: IWarehouseCategory;
                category = it.value as IWarehouseCategory;
                if (category) {
                    this.selectedWarehouseCategory = category;
                    // create formly form component
                    if (!this.warehouseCategoryFormlyComponent) {
                        this.warehouseCategoryFormlyComponent = this.setAreaComponent(
                            1, WarehouseCategoryFormlyComponent);
                    }
                    this.doReset();
                }
            }
        });
    }

    // -------------------------------------------------
    // MAIN FUNCTION
    // -------------------------------------------------

    /**
     * Perform saving data
     */
    private doSave(): void {
        this.getFormlyComponent().getFormGroup().updateValueAndValidity();
        if (this.getFormlyComponent().getFormGroup().invalid) {
            this.showError(this.warehouseCategoryToolbarComponent.getToolbarHeader().title,
                'common.form.invalid_data');
            return;
        }

        // update category's parent if necessary
        let model: IWarehouseCategory;
        model = this.getFormlyComponent().getModel();
        this.getDataSource().update(this.getSelectedWarehouseCategory(), model)
            .then(() => this.showSaveDataSuccess())
            .catch(() => this.showSaveDataError());
    }

    /**
     * Perform resetting data
     */
    private doReset(): void {
        let clonedOrg: IWarehouseCategory;
        clonedOrg = DeepCloner(this.selectedWarehouseCategory);
        delete clonedOrg.parent, clonedOrg.children;
        this.warehouseCategoryFormlyComponent.setModel(clonedOrg);
    }

    /**
     * Perform deleting data
     */
    private doDelete(): void {
        this.getConfirmPopup().show({
            cancelButton: this.translate('common.toast.confirm.delete.cancel'),
            color: 'warn',
            content: this.translate('common.toast.confirm.delete.message'),
            okButton: this.translate('common.toast.confirm.delete.ok'),
            title: this.translate(this.warehouseCategoryToolbarComponent.getToolbarHeader().title),
        }).toPromise().then(value => {
            value && this.getDataSource().remove(this.getFormlyComponent().getModel())
                .then(() => this.showDeleteDataSuccess())
                .catch(() => this.showSaveDataError());
        });
    }
}
