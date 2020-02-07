import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
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
import {SplitAreaDirective} from 'angular-split';
import {OrganizationSplitPaneAreaComponentService} from './organization.splitpane.area.component.service';
import {OrganizationTreeviewComponent} from './organization.treeview.component';
import {OrganizationFormlyComponent} from './organization.formly.component';

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
        super.setHorizontal(true);
        super.setNumberOfAreas(2);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // create tree-view component
        let treeviewComponentService: OrganizationTreeviewComponentService;
        treeviewComponentService = new OrganizationTreeviewComponentService(
            super.getFactoryResolver(), super.getSplitAreaViewContainerComponents()[0], this.getLogger());
        this.organizationTreeviewComponent = treeviewComponentService.resolve().instance;
        // this.getTreeviewComponentService().setViewContainerRef(leftAreaRef.injector.get(ViewContainerRef));
        // let treeviewRef: ComponentRef<OrganizationTreeviewComponent>;
        // treeviewRef = this.getTreeviewComponentService().resolve();
        // this.organizationTreeviewComponent = treeviewRef.instance;
        //
        // // create formly component
        // this.getFormlyComponentService().setViewContainerRef(rightAreaRef.injector.get(ViewContainerRef));
        // let formlyRef: ComponentRef<OrganizationFormlyComponent>;
        // formlyRef = this.getFormlyComponentService().resolve();
        // this.organizationFormlyComponent = formlyRef.instance;
    }
}
