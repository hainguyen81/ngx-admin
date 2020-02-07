import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    Inject, OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseSplitPaneComponent} from '../../../splitpane/base.splitpane.component';
import {OrganizationDataSource} from '../../../../../services/implementation/organization/organization.datasource';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {OrganizationTreeviewComponentService} from './organization.treeview.component.service';
import {OrganizationFormlyComponentService} from './organization.formly.component.service';
import {OrganizationTreeviewComponent} from './organization.treeview.component';
import {OrganizationFormlyComponent} from './organization.formly.component';
import {ISplitAreaConfig} from '../../../splitpane/abstract.splitpane.component';
import {SplitAreaDirective} from 'angular-split';

/* Organization left area configuration */
export const OrganizationTreeAreaConfig: ISplitAreaConfig = {
    size: 30,
    minSize: 20,
    maxSize: 30,
    lockSize: false,
    visible: true,
};

/* Organization right area configuration */
export const OrganizationFormAreaConfig: ISplitAreaConfig = {
    size: 70,
    minSize: 50,
    maxSize: 70,
    lockSize: false,
    visible: false,
};

/**
 * Organization split-pane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane',
    templateUrl: '../../../splitpane/splitpane.component.html',
    styleUrls: ['../../../splitpane/splitpane.component.scss'],
})
export class OrganizationSplitPaneComponent
    extends BaseSplitPaneComponent<OrganizationDataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private organizationTreeviewComponent: OrganizationTreeviewComponent;
    private organizationFormlyComponent: OrganizationFormlyComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {OrganizationTreeviewComponent} instance
     * @return the {OrganizationTreeviewComponent} instance
     */
    protected getTreeviewComponent(): OrganizationTreeviewComponent {
        return this.organizationTreeviewComponent;
    }

    /**
     * Get the {OrganizationFormlyComponent} instance
     * @return the {OrganizationFormlyComponent} instance
     */
    protected getFormlyComponent(): OrganizationFormlyComponent {
        return this.organizationFormlyComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {OrganizationSplitPaneComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     */
    constructor(@Inject(DataSource) dataSource: OrganizationDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
        super(dataSource, contextMenuService, logger, renderer, translateService, factoryResolver, viewContainerRef);
        super.setPaneHeader('system.organization.title');
        super.setHorizontal(true);
        super.setNumberOfAreas(2);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.createPaneComponents();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Create left/right component panes
     */
    private createPaneComponents() {
        const componentFactoryResolver: ComponentFactoryResolver = this.getFactoryResolver();
        const viewContainerRefs: ViewContainerRef[] = this.getSplitAreaHolderViewContainerComponents();
        const splitAreas: SplitAreaDirective[] = this.getSplitAreaComponents();

        // configure areas
        this.configArea(splitAreas[0], OrganizationTreeAreaConfig);
        this.configArea(splitAreas[1], OrganizationFormAreaConfig);

        // create tree-view component
        let treeviewComponentService: OrganizationTreeviewComponentService;
        treeviewComponentService = new OrganizationTreeviewComponentService(
            componentFactoryResolver, viewContainerRefs[0], this.getLogger());
        treeviewComponentService.setViewContainerRef(viewContainerRefs[0]);
        this.organizationTreeviewComponent = treeviewComponentService.resolve().instance;

        // create formly form component
        let formlyComponentService: OrganizationFormlyComponentService;
        formlyComponentService = new OrganizationFormlyComponentService(
            componentFactoryResolver, viewContainerRefs[1], this.getLogger());
        formlyComponentService.setViewContainerRef(viewContainerRefs[1]);
        this.organizationFormlyComponent = formlyComponentService.resolve().instance;
    }
}
