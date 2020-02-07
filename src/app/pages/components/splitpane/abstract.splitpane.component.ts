import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent} from '../abstract.component';
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Inject,
    QueryList,
    Renderer2,
    ViewChildren, ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {SplitAreaDirective, SplitComponent} from 'angular-split';
import {throwError} from 'rxjs';

/**
 * Abstract SplitPane component base on {AngularSplitModule}
 */
export abstract class AbstractSplitpaneComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(SplitComponent)
    private readonly querySplitComponent: QueryList<SplitComponent>;
    private splitComponent: SplitComponent;
    @ViewChildren(SplitAreaDirective)
    private readonly querySplitAreaDirectiveComponents: QueryList<SplitAreaDirective>;
    private splitAreas: SplitAreaDirective[];
    @ViewChildren(SplitAreaDirective, { read: ViewContainerRef })
    private readonly querySplitAreaViewContainerRefs: QueryList<ViewContainerRef>;
    private splitAreaViewContainerRefs: ViewContainerRef[];

    private paneHeader: string;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating this component whether is splitted by horizontal direction
     * @return true for horizontal direction; else false
     */
    public isHorizontal(): boolean {
        return this.horizontal;
    }

    protected setPaneHeader(header: string) {
        this.paneHeader = header;
    }

    /**
     * Get the number of split-area
     * @return the number of split-area
     */
    public getNumberOfAreas(): number {
        return this.numberOfAreas;
    }

    /**
     * Set the number of split-area
     * @param numberOfAreas the number of split-area
     */
    protected setNumberOfAreas(numberOfAreas: number): void {
        this.numberOfAreas = numberOfAreas;
    }

    /**
     * Set a boolean value indicating this component whether is splitted by horizontal direction
     * @param horizontal true for horizontal; else false
     */
    public setHorizontal(horizontal?: boolean): void {
        this.horizontal = horizontal || false;
        if (this.getSplitComponent()) {
            this.getSplitComponent().direction = (this.horizontal ? 'horizontal' : 'vertical');
        }
    }

    /**
     * Get the {SplitComponent} instance
     * @return the {SplitComponent} instance
     */
    protected getSplitComponent(): SplitComponent {
        return this.splitComponent;
    }

    /**
     * Get the {SplitAreaDirective} instances array
     * @return the {SplitAreaDirective} instances array
     */
    protected getSplitAreaComponents(): SplitAreaDirective[] {
        return this.splitAreas;
    }

    /**
     * Get the {ViewContainerRef} instances array of {SplitAreaDirective}
     * @return the {ViewContainerRef} instances array of {SplitAreaDirective}
     */
    protected getSplitAreaViewContainerComponents(): ViewContainerRef[] {
        return this.splitAreaViewContainerRefs;
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
     * @param numberOfAreas the number of split-area
     * @param horizontal true for horizontal; else vertical
     */
    protected constructor(@Inject(DataSource) dataSource: T,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                          private numberOfAreas: number,
                          private horizontal?: boolean | false) {
        super(dataSource, contextMenuService, logger, renderer, translateService, factoryResolver, viewContainerRef);
        (numberOfAreas >= 0) || throwError('The number of split-area must be equals or greater than 0');
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.splitComponent) {
            this.querySplitComponent.map(
                (item) => this.splitComponent = item);
        }
        if (!this.splitAreaViewContainerRefs || !this.splitAreaViewContainerRefs.length) {
            this.splitAreaViewContainerRefs = [];
            this.querySplitAreaViewContainerRefs.forEach(
                (item) => this.splitAreaViewContainerRefs.push(item));
        }
        if (!this.splitAreas || !this.splitAreas.length) {
            this.splitAreas = [];
            this.querySplitAreaDirectiveComponents.forEach(
                (item) => this.splitAreas.push(item));
        }
        this.setHorizontal(this.horizontal);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Perform resize areas
     * @param unit size unit
     * @param sizes area sizes
     */
    onDragEnd(unit, {sizes}): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDragEnd', unit, sizes);
    }
}
