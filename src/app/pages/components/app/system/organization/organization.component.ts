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
import {IOrganization} from '../../../../../@core/data/organization';
import {ToasterService} from 'angular2-toaster';
import ComponentUtils from '../../../../../utils/component.utils';

/* Organization left area configuration */
export const OrganizationTreeAreaConfig: ISplitAreaConfig = {
    size: 30,
    /*minSize: 20,*/
    maxSize: 30,
    lockSize: false,
    visible: true,
};

/* Organization right area configuration */
export const OrganizationFormAreaConfig: ISplitAreaConfig = {
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
     * @param toasterService {ToasterService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     */
    constructor(@Inject(DataSource) dataSource: OrganizationDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToasterService) toasterService: ToasterService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef);
        super.setPaneHeader('system.organization.title');
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
     * Create organization tree-view component {OrganizationTreeviewComponent}
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @return {OrganizationTreeviewComponent}
     */
    private createOrganizationTreeviewComponent(
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef): OrganizationTreeviewComponent {
        let treeviewComponentService: OrganizationTreeviewComponentService;
        treeviewComponentService = new OrganizationTreeviewComponentService(
            componentFactoryResolver, viewContainerRef, this.getLogger());
        return ComponentUtils.createComponent(treeviewComponentService, viewContainerRef);
    }

    /**
     * Create organization formly component {OrganizationFormlyComponent}
     * @param componentFactoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @return {OrganizationFormlyComponent}
     */
    private createOrganizationFormlyComponent(
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef): OrganizationFormlyComponent {
        let formlyComponentService: OrganizationFormlyComponentService;
        formlyComponentService = new OrganizationFormlyComponentService(
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
        this.configArea(splitAreas[0], OrganizationTreeAreaConfig);
        this.configArea(splitAreas[1], OrganizationFormAreaConfig);

        // create tree-view component
        this.organizationTreeviewComponent = this.createOrganizationTreeviewComponent(
            componentFactoryResolver, viewContainerRefs[0]);

        // handle click tree-view item to show form
        this.organizationTreeviewComponent.setClickItemListener((e, it) => {
            if (it && it.value) {
                let organization: IOrganization;
                organization = it.value as IOrganization;
                if (organization) {
                    // create formly form component
                    this.organizationFormlyComponent = this.createOrganizationFormlyComponent(
                        componentFactoryResolver, viewContainerRefs[1]);
                    this.organizationFormlyComponent.getFormGroup().reset(organization);
                }
            }
        });
    }
}
