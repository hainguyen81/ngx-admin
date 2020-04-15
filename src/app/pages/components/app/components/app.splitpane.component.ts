import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {TreeviewItem} from 'ngx-treeview';
import {
    AfterViewInit,
    ChangeDetectorRef, Component,
    ComponentFactoryResolver, ElementRef,
    Inject, Renderer2, Type,
    ViewContainerRef,
} from '@angular/core';
import {BaseSplitPaneComponent} from '../../splitpane/base.splitpane.component';
import {
    ACTION_DELETE,
    ACTION_RESET,
    ACTION_SAVE,
    IToolbarActionsConfig,
} from '../../toolbar/abstract.toolbar.component';
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
import {IEvent} from '../../abstract.component';
import {ISplitAreaConfig} from '../../splitpane/abstract.splitpane.component';

/* Default left area configuration */
export const LeftTreeAreaConfig: ISplitAreaConfig = {
    size: 30,
    minSize: 20,
    maxSize: 30,
    lockSize: false,
    visible: true,
};

/* Default right area configuration */
export const RightFormAreaConfig: ISplitAreaConfig = {
    size: 70,
    minSize: 70,
    maxSize: 80,
    lockSize: false,
    visible: true,
};

/**
 * Base split-pane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane-app',
    templateUrl: '../../splitpane/splitpane.component.html',
    styleUrls: ['../../splitpane/splitpane.component.scss'],
})
export abstract class AppSplitPaneComponent<
    T extends IModel, D extends DataSource,
    TB extends AppToolbarComponent<D>,
    TR extends AppTreeviewComponent<T, D>,
    F extends AppFormlyComponent<T, D>>
    extends BaseSplitPaneComponent<D>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private toolbarComponent: TB;
    private treeviewComponent: TR;
    private formlyComponent: F;
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
     * Get the {AppToolbarComponent} instance
     * @return the {AppToolbarComponent} instance
     */
    protected getToolbarComponent(): TB {
        return this.toolbarComponent;
    }

    /**
     * Get the {AppTreeviewComponent} instance
     * @return the {AppTreeviewComponent} instance
     */
    protected getTreeviewComponent(): TR {
        return this.treeviewComponent;
    }

    /**
     * Get the {AppFormlyComponent} instance
     * @return the {AppFormlyComponent} instance
     */
    protected getFormlyComponent(): F {
        return this.formlyComponent;
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
    constructor(@Inject(DataSource) dataSource: D,
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
                private toolBarType?: Type<TB> | null,
                private treeviewType?: Type<TR> | null,
                private formType?: Type<F> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        confirmPopup || throwError('Could not inject ConfirmPopup');
        treeviewType || throwError('The left treeview component type is required');
        formType || throwError('The right formly component type is required');
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
        this.configAreaByIndex(0, LeftTreeAreaConfig);
        this.configAreaByIndex(1, RightFormAreaConfig);

        // create toolbar component
        if (this.toolBarType) {
            this.toolbarComponent = super.setToolbarComponent(this.toolBarType);
            this.toolbarComponent.actionListener().subscribe((e: IEvent) => this.onClickAction(e));
        }

        // create tree-view component
        this.treeviewComponent = super.setAreaComponent(0, this.treeviewType);
        // handle click tree-view item to show form
        this.treeviewComponent.setClickItemListener(
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
            if (!this.formlyComponent) {
                this.formlyComponent = this.setAreaComponent(1, this.formType);
            }
            this.doReset();
        }
    }

    /**
     * Perform saving data
     */
    private doSave(): void {
        this.getFormlyComponent().getFormGroup().updateValueAndValidity();
        if (this.getFormlyComponent().getFormGroup().invalid) {
            if (this.toolbarComponent) {
                this.showError(this.toolbarComponent.getToolbarHeader().title,
                    'common.form.invalid_data');
            } else {
                this.showError('app', 'common.form.invalid_data');
            }
            return;
        }

        // update model if necessary
        let model: T;
        model = this.getFormlyComponent().getModel();
        this.getDataSource().update(this.getSelectedModel(), model)
            .then(() => this.showSaveDataSuccess())
            .catch(() => this.showSaveDataError());
    }

    /**
     * Perform resetting data
     */
    private doReset(): void {
        let cloned: T;
        cloned = DeepCloner(this.selectedModel);
        delete cloned['parent'], cloned['children'];
        this.formlyComponent.setModel(cloned);
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
            title: (!this.toolbarComponent ? this.translate('app')
                : this.translate(this.toolbarComponent.getToolbarHeader().title)),
        }).toPromise().then(value => {
            value && this.getDataSource().remove(this.getFormlyComponent().getModel())
                .then(() => this.showDeleteDataSuccess())
                .catch(() => this.showSaveDataError());
        });
    }
}
