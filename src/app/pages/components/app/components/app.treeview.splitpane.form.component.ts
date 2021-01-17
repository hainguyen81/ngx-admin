import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {TreeviewItem} from 'ngx-treeview';
import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, InjectionToken, Renderer2, Type, ViewContainerRef} from '@angular/core';
import {ConfirmPopup} from 'ngx-material-popup';
import {AppToolbarComponent} from './app.toolbar.component';
import {AppTreeviewComponent} from './app.treeview.component';
import {IModel} from '../../../../@core/data/base';
import {DeepCloner} from '../../../../utils/common/object.utils';
import {ContextMenuService} from 'ngx-contextmenu';
import {AppFormlyComponent} from './app.formly.component';
import {Lightbox} from 'ngx-lightbox';
import {TranslateService} from '@ngx-translate/core';
import {DataSource} from '@app/types/index';
import {throwError} from 'rxjs';
import {AppSplitPaneComponent} from './app.splitpane.component';
import {ActivatedRoute, Router} from '@angular/router';

export const APP_TREE_SPLIT_FORM_TOOLBAR_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AppToolbarComponent<any>>>
    = new InjectionToken<Type<AppToolbarComponent<any>>>('The toolbar component type injection token of the split-pane between tree-view and form');
export const APP_TREE_SPLIT_FORM_TREE_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AppTreeviewComponent<any, any>>>
    = new InjectionToken<Type<AppTreeviewComponent<any, any>>>('The table component type injection token of the split-pane between tree-view and form');
export const APP_TREE_SPLIT_FORM_FORM_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AppFormlyComponent<any, any>>>
    = new InjectionToken<Type<AppFormlyComponent<any, any>>>('The table component type injection token of the split-pane between tree-view and form');

/**
 * Base split-pane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane-app-tree-form',
    templateUrl: '../../splitpane/splitpane.component.html',
    styleUrls: [
        '../../splitpane/splitpane.component.scss',
        './app.splitpane.component.scss',
    ],
})
export class AppTreeSplitFormComponent<
    T extends IModel, D extends DataSource,
    TB extends AppToolbarComponent<D>,
    TR extends AppTreeviewComponent<T, D>,
    F extends AppFormlyComponent<T, D>>
    extends AppSplitPaneComponent<T, D, TB, TR, F>
    implements AfterViewInit {

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
    protected get treeviewComponent(): TR {
        return this.leftSideComponent;
    }

    /**
     * Get the {AppFormlyComponent} instance
     * @return the {AppFormlyComponent} instance
     */
    protected get formlyComponent(): F {
        return this.rightSideComponent;
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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     * @param toolBarType toolbar component type
     * @param treeviewType left side treeview component type
     * @param formType right side form component type
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
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                @Inject(APP_TREE_SPLIT_FORM_TOOLBAR_COMPONENT_TYPE_TOKEN) toolBarType?: Type<TB> | null,
                @Inject(APP_TREE_SPLIT_FORM_TREE_COMPONENT_TYPE_TOKEN) treeviewType?: Type<TR> | null,
                @Inject(APP_TREE_SPLIT_FORM_FORM_COMPONENT_TYPE_TOKEN) formType?: Type<F> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            toolBarType, treeviewType, formType);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

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
        if (this.selectedModelItem !== item) {
            this.selectedModelItem = item;
            if (item && item.value) {
                const model: T = item.value as T;
                model || throwError('Could not apply undefined model to formly component!');

                this.selectedModel = DeepCloner(model);
                // create formly form component
                if (super.createRightSideComponent()) {
                    this.doReset();
                } else {
                    super.showGlobalError();
                }
            }
        }
    }

    /**
     * Perform saving data
     */
    protected doSave(): void {
        if (!this.formlyComponent.submit()) {
            if (this.toolbarComponent) {
                this.showError(this.toolbarComponent.getToolbarHeader().title,
                    'common.form.invalid_data');
            } else {
                this.showError('app', 'common.form.invalid_data');
            }
            return;
        }

        // update model if necessary
        const model: T = this.requireFormModel(true);
        this.getDataSource().update(this.getSelectedModel(), model)
            .then(() => this.showSaveDataSuccess())
            .catch(() => this.showSaveDataError());
    }

    /**
     * Get the model of the form component for saving/deleting
     * TODO Children classes could override this method for customizing model
     * @param isSave specify whether is SAVE action
     * @return the model of the form component for saving/deleting
     */
    protected requireFormModel(isSave?: boolean | true): T {
        return this.formlyComponent ? this.formlyComponent.getModel() : undefined;
    }

    /**
     * Perform resetting data
     */
    protected doReset(): void {
        const cloned: T = DeepCloner(this.selectedModel);
        delete cloned['parent'], cloned['children'];
        this.formlyComponent && this.formlyComponent.setModel(cloned);
    }

    /**
     * Perform deleting data
     */
    protected performDelete(): void {
        this.getDataSource().remove(this.requireFormModel(false))
            .then(() => this.showDeleteDataSuccess())
            .catch(() => this.showSaveDataError());
    }
}
