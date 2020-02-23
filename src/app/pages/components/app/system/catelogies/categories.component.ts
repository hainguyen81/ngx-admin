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
import {SplitAreaDirective} from 'angular-split';
import ComponentUtils from '../../../../../utils/component.utils';
import {CategoriesDataSource} from '../../../../../services/implementation/categories/categories.datasource';
import {CategoriesTreeviewComponent} from './categories.treeview.component';
import {CategoriesFormlyComponent} from './categories.formly.component';
import {ICategories} from '../../../../../@core/data/warehouse_catelogies';
import {CategoriesTreeviewComponentService} from './categories.treeview.component.service';
import {CategoriesFormlyComponentService} from './categories.formly.component.service';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {CategoryToolbarComponent} from './category.toolbar.component';
import {CategoryToolbarComponentService} from './category.toolbar.component.service';
import {IEvent} from '../../../abstract.component';
import {DeepCloner} from '../../../../../utils/object.utils';
import {
    ACTION_DELETE,
    ACTION_RESET,
    ACTION_SAVE,
    IToolbarActionsConfig
} from '../../../toolbar/abstract.toolbar.component';

/* Categories left area configuration */
export const CategoriesTreeAreaConfig: ISplitAreaConfig = {
    size: 30,
    /*minSize: 20,*/
    maxSize: 30,
    lockSize: false,
    visible: true,
};

/* Categories right area configuration */
export const CategoriesFormAreaConfig: ISplitAreaConfig = {
    size: 70,
    /*minSize: 50,*/
    maxSize: 70,
    lockSize: false,
    visible: true,
};

/**
 * Organization split-pane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane-category',
    templateUrl: '../../../splitpane/splitpane.component.html',
    styleUrls: ['../../../splitpane/splitpane.component.scss'],
})
export class CategoriesSplitPanelComponent
    extends BaseSplitPaneComponent<CategoriesDataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private CategoryToolbarComponent: CategoryToolbarComponent;
    private CategoriesTreeviewComponent: CategoriesTreeviewComponent;
    private CategoriesFormlyComponent: CategoriesFormlyComponent;
    private selectedCategory: ICategories | null;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the selected {ICategories} instance
     * @return the selected {ICategories} instance
     */
    protected getSelectedCategory(): ICategories {
        return this.selectedCategory;
    }

    /**
     * Get the {CategoriesTreeviewComponent} instance
     * @return the {CategoriesTreeviewComponent} instance
     */
    protected getTreeviewComponent(): CategoriesTreeviewComponent {
        return this.CategoriesTreeviewComponent;
    }

    /**
     * Get the {OrganizationFormlyComponent} instance
     * @return the {OrganizationFormlyComponent} instance
     */
    protected getFormlyComponent(): CategoriesFormlyComponent {
        return this.CategoriesFormlyComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {CategoriesSplitPanelComponent} class
     * @param dataSource {CategoriesDataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toastrService
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param elementRef {ElementRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     */
    constructor(@Inject(CategoriesDataSource) dataSource: CategoriesDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toastrService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) elementRef: ElementRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup) {
        super(dataSource, contextMenuService, toastrService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup);
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
     * Create organization toolbar component {CategoryToolbarComponent}
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @return {CategoryToolbarComponent}
     */
    private createCategoryToolbarComponent(
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef): CategoryToolbarComponent {
        let toolbarComponentService: CategoryToolbarComponentService;
        toolbarComponentService = new CategoryToolbarComponentService(
            componentFactoryResolver, viewContainerRef, this.getLogger());
        return ComponentUtils.createComponent(toolbarComponentService, viewContainerRef);
    }

    /**
     * Create Categories tree-view component {CategoriesTreeviewComponent}
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @return {CategoriesTreeviewComponent}
     */
    private createCategoriesTreeviewComponent(
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef): CategoriesTreeviewComponent {
        let treeviewComponentService: CategoriesTreeviewComponentService;
        treeviewComponentService = new CategoriesTreeviewComponentService(
            componentFactoryResolver, viewContainerRef, this.getLogger());
        return ComponentUtils.createComponent(treeviewComponentService, viewContainerRef);
    }

    /**
     * Create Categories formly component {CategoriesFormlyComponent}
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @return {CategoriesFormlyComponent}
     */
    private createCategoriesFormlyComponent(
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef): CategoriesFormlyComponent {
        let formlyComponentService: CategoriesFormlyComponentService;
        formlyComponentService = new CategoriesFormlyComponentService(
            componentFactoryResolver, viewContainerRef, this.getLogger());
        return ComponentUtils.createComponent(formlyComponentService, viewContainerRef, true);
    }

    /**
     * Create left/right component panes
     */
    private createPaneComponents() {
        const componentFactoryResolver: ComponentFactoryResolver = this.getFactoryResolver();
        const viewContainerRefs: ViewContainerRef[] = this.getSplitAreaHolderViewContainerComponents();
        const headerViewContainer = this.getHeaderViewContainerComponent();
        const splitAreas: SplitAreaDirective[] = this.getSplitAreaComponents();

        // configure areas
        this.configArea(splitAreas[0], CategoriesTreeAreaConfig);
        this.configArea(splitAreas[1], CategoriesFormAreaConfig);

        // create toolbar component
        this.CategoryToolbarComponent = this.createCategoryToolbarComponent(
            componentFactoryResolver, headerViewContainer);
        this.CategoryToolbarComponent.actionListener()
            .subscribe((e: IEvent) => this.onClickAction(e));

        // create tree-view component
        this.CategoriesTreeviewComponent = this.createCategoriesTreeviewComponent(
            componentFactoryResolver, viewContainerRefs[0]);

        // handle click tree-view item to show form
        this.CategoriesTreeviewComponent.setClickItemListener((e, it) => {
            if (it && it.value) {
                let Categories: ICategories;
                Categories = it.value as ICategories;
                if (Categories) {
                    this.selectedCategory = Categories;
                    // create formly form component
                    this.CategoriesFormlyComponent = this.createCategoriesFormlyComponent(
                        componentFactoryResolver, viewContainerRefs[1]);
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
            this.showError(this.CategoryToolbarComponent.getToolbarHeader().title,
                'common.form.invalid_data');
            return;
        }

        this.getDataSource().update(
            this.getSelectedCategory(),
            this.getFormlyComponent().getModel())
            .then(() => this.showSaveDataSuccess())
            .catch(() => this.showSaveDataError());
    }

    /**
     * Perform resetting data
     */
    private doReset(): void {
        let clonedOrg: ICategories;
        clonedOrg = DeepCloner(this.selectedCategory);
        delete clonedOrg.parent, clonedOrg.children;
        this.CategoriesFormlyComponent.setModel(clonedOrg);
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
            title: this.translate(this.CategoryToolbarComponent.getToolbarHeader().title),
        }).toPromise().then(value => {
            value && this.getDataSource().remove(this.getFormlyComponent().getModel())
                .then(() => this.showDeleteDataSuccess())
                .catch(() => this.showSaveDataError());
        });
    }
}
