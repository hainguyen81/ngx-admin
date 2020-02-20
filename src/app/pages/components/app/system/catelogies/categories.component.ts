import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseSplitPaneComponent} from '../../../splitpane/base.splitpane.component';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
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
    selector: 'ngx-split-pane',
    templateUrl: '../../../splitpane/splitpane.component.html',
    styleUrls: ['../../../splitpane/splitpane.component.scss'],
})
export class CategoriesSplitPanelComponent
    extends BaseSplitPaneComponent<CategoriesDataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private CategoriesTreeviewComponent: CategoriesTreeviewComponent;
    private CategoriesFormlyComponent: CategoriesFormlyComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

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
     * Create a new instance of {OrganizationSplitPaneComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toastrService
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param modalDialogService
     * @param confirmPopup
     */
    constructor(@Inject(DataSource) dataSource: CategoriesDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toastrService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup) {
        super(dataSource, contextMenuService, toastrService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, modalDialogService, confirmPopup);
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

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

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
        const splitAreas: SplitAreaDirective[] = this.getSplitAreaComponents();

        // configure areas
        this.configArea(splitAreas[0], CategoriesTreeAreaConfig);
        this.configArea(splitAreas[1], CategoriesFormAreaConfig);

        // create tree-view component
        this.CategoriesTreeviewComponent = this.createCategoriesTreeviewComponent(
            componentFactoryResolver, viewContainerRefs[0]);

        // handle click tree-view item to show form
        this.CategoriesTreeviewComponent.setClickItemListener((e, it) => {
            if (it && it.value) {
                let Categories: ICategories;
                Categories = it.value as ICategories;
                if (Categories) {
                    // create formly form component
                    this.CategoriesFormlyComponent = this.createCategoriesFormlyComponent(
                        componentFactoryResolver, viewContainerRefs[1]);
                    this.CategoriesFormlyComponent.getFormGroup().reset(Categories);
                }
            }
        });
    }
}
