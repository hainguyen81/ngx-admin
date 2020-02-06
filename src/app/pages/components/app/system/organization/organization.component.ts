import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    Inject,
    OnInit,
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
    implements OnInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @Inject(OrganizationSplitPaneAreaComponentService)
    private organizationSplitPaneAreaComponentService: OrganizationSplitPaneAreaComponentService;
    private organizationSplitPaneAreas: SplitAreaDirective[];
    @Inject(OrganizationTreeviewComponentService)
    private organizationTreeviewComponentService: OrganizationTreeviewComponentService;
    private organizationTreeviewComponent: OrganizationTreeviewComponent;
    @Inject(OrganizationFormlyComponentService)
    private organizationFormlyComponentService: OrganizationFormlyComponentService;
    private organizationFormlyComponent: OrganizationFormlyComponent;

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     */
    constructor(@Inject(DataSource) dataSource: OrganizationDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver) {
        super(dataSource, contextMenuService, logger, renderer, translateService, factoryResolver);
        super.setHorizontal(true);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        // create split areas
        this.organizationSplitPaneAreaComponentService.setViewContainerRef(super.getViewContainerRef());
        let leftAreaRef: ComponentRef<SplitAreaDirective>;
        leftAreaRef = this.organizationSplitPaneAreaComponentService.resolve();
        leftAreaRef.instance.size = 30;
        leftAreaRef.instance.minSize = 15;
        this.getSplitComponent().addArea(leftAreaRef.instance);

        let rightAreaRef: ComponentRef<SplitAreaDirective>;
        rightAreaRef = this.organizationSplitPaneAreaComponentService.resolve();
        rightAreaRef.instance.size = 70;
        rightAreaRef.instance.minSize = 50;
        this.getSplitComponent().addArea(rightAreaRef.instance);

        // create tree-view component
        this.organizationTreeviewComponentService.setViewContainerRef(
            leftAreaRef.injector.get(ViewContainerRef));
        let treeviewRef: ComponentRef<OrganizationTreeviewComponent>;
        treeviewRef = this.organizationTreeviewComponentService.resolve();
        this.organizationTreeviewComponent = treeviewRef.instance;

        // create formly component
        this.organizationFormlyComponentService.setViewContainerRef(
            rightAreaRef.injector.get(ViewContainerRef));
        let formlyRef: ComponentRef<OrganizationFormlyComponent>;
        formlyRef = this.organizationFormlyComponentService.resolve();
        this.organizationFormlyComponent = formlyRef.instance;
    }
}
