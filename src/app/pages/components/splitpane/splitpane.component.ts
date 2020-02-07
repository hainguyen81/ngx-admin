import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    Inject,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractSplitpaneComponent} from './abstract.splitpane.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';

/**
 * SplitPane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane',
    templateUrl: './splitpane.component.html',
    styleUrls: ['./splitpane.component.scss'],
})
export class NgxSplitPaneComponent extends AbstractSplitpaneComponent<DataSource> implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren('splitAreaHolder', { read: ViewContainerRef })
    private readonly querySplitAreaHolderViewContainerRefs: QueryList<ViewContainerRef>;
    private splitAreaHolderViewContainerRefs: ViewContainerRef[];

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {ViewContainerRef} instances array of {SplitAreaDirective}
     * @return the {ViewContainerRef} instances array of {SplitAreaDirective}
     */
    protected getSplitAreaHolderViewContainerComponents(): ViewContainerRef[] {
        return this.splitAreaHolderViewContainerRefs;
    }

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
     * @param viewContainerRef {ViewContainerRef}
     */
    constructor(@Inject(DataSource) dataSource: DataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
        super(dataSource, contextMenuService, logger, renderer,
            translateService, factoryResolver, viewContainerRef, 0, false);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.splitAreaHolderViewContainerRefs || !this.splitAreaHolderViewContainerRefs.length) {
            this.splitAreaHolderViewContainerRefs = [];
            this.querySplitAreaHolderViewContainerRefs.forEach(
                (item) => this.splitAreaHolderViewContainerRefs.push(item));
        }
    }
}
