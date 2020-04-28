import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {TreeviewItem} from 'ngx-treeview';
import {
    AfterViewInit,
    ChangeDetectorRef, Component,
    ComponentFactoryResolver, ElementRef,
    Inject, OnInit, Renderer2, Type,
    ViewContainerRef,
} from '@angular/core';
import {ConfirmPopup} from 'ngx-material-popup';
import {AppToolbarComponent} from './app.toolbar.component';
import {AppTreeviewComponent} from './app.treeview.component';
import {IModel} from '../../../../@core/data/base';
import {DeepCloner} from '../../../../utils/object.utils';
import {ContextMenuService} from 'ngx-contextmenu';
import {AppFormlyComponent} from './app.formly.component';
import {Lightbox} from 'ngx-lightbox';
import {TranslateService} from '@ngx-translate/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {throwError} from 'rxjs';
import {AppSplitPaneComponent} from './app.splitpane.component';

/**
 * Base split-pane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane-app-tree-form',
    templateUrl: '../../splitpane/splitpane.component.html',
    styleUrls: ['../../splitpane/splitpane.component.scss'],
})
export abstract class AppTreeSplitFormComponent<
    T extends IModel, D extends DataSource,
    TB extends AppToolbarComponent<D>,
    TR extends AppTreeviewComponent<T, D>,
    F extends AppFormlyComponent<T, D>>
    extends AppSplitPaneComponent<T, D, TB, TR, F>
    implements OnInit, AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private selectedModel: T | null;
    private selectedModelItem: TreeviewItem | null;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the selected {IModel} instance
     * @return the selected {IModel} instance
     */
    protected getSelectedModel(): T {
        return this.selectedModel;
    }

    /**
     * Get the selected {TreeviewItem} instance
     * @return the selected {TreeviewItem} instance
     */
    protected getSelectedModelItem(): TreeviewItem {
        return this.selectedModelItem;
    }

    /**
     * Get the {AppTreeviewComponent} instance
     * @return the {AppTreeviewComponent} instance
     */
    protected getTreeviewComponent(): TR {
        return this.getLeftSideComponent() as TR;
    }

    /**
     * Get the {AppFormlyComponent} instance
     * @return the {AppFormlyComponent} instance
     */
    protected getFormlyComponent(): F {
        return this.rightSideComponent as F;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppSplitPaneComponent} class
     * @param dataSource {Datasource}
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
    protected constructor(@Inject(DataSource) dataSource: D,
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
                          toolBarType?: Type<TB> | null,
                          treeviewType?: Type<TR> | null,
                          formType?: Type<F> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            toolBarType, treeviewType, formType);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        // refresh data source at strat-up
        super.getDataSource().refresh();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // Configure left/right component panes
        this.configPaneComponents();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Create left/right component panes
     */
    private configPaneComponents() {
        // handle click tree-view item to show form
        this.getTreeviewComponent().setClickItemListener(
            (e, it) => this.doApplyFormModel(it));
    }

    // -------------------------------------------------
    // MAIN FUNCTION
    // -------------------------------------------------

    /**
     * Apply data of the specified {TreeviewItem} to right formly component
     * @param item to apply
     */
    private doApplyFormModel(item?: TreeviewItem): void {
        this.selectedModelItem = item;
        if (item && item.value) {
            let model: T;
            model = item.value as T;
            model || throwError('Could not apply undefined model to formly component!');

            this.selectedModel = model;
            // create formly form component
            if (super.createRightSideComponent()) {
                this.doReset();
            } else {
                super.showGlobalError();
            }
        }
    }

    /**
     * Perform saving data
     */
    protected doSave(): void {
        this.getFormlyComponent().getFormGroup().updateValueAndValidity();
        if (this.getFormlyComponent().getFormGroup().invalid) {
            if (this.getToolbarComponent()) {
                this.showError(this.getToolbarComponent().getToolbarHeader().title,
                    'common.form.invalid_data');
            } else {
                this.showError('app', 'common.form.invalid_data');
            }
            return;
        }

        // update model if necessary
        const model: T = this.getFormlyComponent().getModel();
        this.getDataSource().update(this.getSelectedModel(), model)
            .then(() => this.showSaveDataSuccess())
            .catch(() => this.showSaveDataError());
    }

    /**
     * Perform resetting data
     */
    protected doReset(): void {
        const cloned: T = DeepCloner(this.selectedModel);
        delete cloned['parent'], cloned['children'];
        this.getFormlyComponent().setModel(cloned);
    }

    /**
     * Perform deleting data
     */
    protected performDelete(): void {
        this.getDataSource().remove(this.getFormlyComponent().getModel())
            .then(() => this.showDeleteDataSuccess())
            .catch(() => this.showSaveDataError());
    }
}
