import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent, IEvent} from '../abstract.component';
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Inject,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {SplitAreaDirective, SplitComponent} from 'angular-split';
import {throwError} from 'rxjs';
import {ToasterService} from 'angular2-toaster';

/* Split area configuration */
export interface ISplitAreaConfig {
    size?: number | null;
    minSize?: number | null;
    maxSize?: number | null;
    lockSize?: boolean | false;
    visible?: boolean | true;
}

/**
 * Abstract SplitPane component base on {AngularSplitModule}
 */
export abstract class AbstractSplitpaneComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    protected static SPLIT_ELEMENT_SELECTOR: string = 'as-split';
    protected static SPLIT_AREA_ELEMENT_SELECTOR: string = 'as-split-area';
    protected static SPLIT_GUTTER_ELEMENT_SELECTOR: string = '.as-split-gutter';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(SplitComponent)
    private readonly querySplitComponent: QueryList<SplitComponent>;
    private splitComponent: SplitComponent;
    @ViewChildren(SplitAreaDirective)
    private readonly querySplitAreaDirectiveComponents: QueryList<SplitAreaDirective>;
    private splitAreas: SplitAreaDirective[];

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

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToasterService}
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
                          @Inject(ToasterService) toasterService: ToasterService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                          private numberOfAreas: number,
                          private horizontal?: boolean | false) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver, viewContainerRef);
        (numberOfAreas >= 0) || throwError('The number of split-area must be equals or greater than 0');
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.splitComponent && this.querySplitComponent) {
            this.querySplitComponent.map(
                (item) => this.splitComponent = item);
        }
        if ((!this.splitAreas || !this.splitAreas.length) && this.querySplitAreaDirectiveComponents) {
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
     * @param event {IEvent} that contains {$data} as Object, consist of: unit, {sizes}
     */
    onDragEnd(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDragEnd', event);
    }

    /**
     * Perform action on resize event
     * @param event {IEvent} that contains {$data} as ResizedEvent
     */
    onResized(event: IEvent): void {
        super.onResized(event);

        let splitAreaEls: NodeListOf<HTMLElement>;
        splitAreaEls = this.getElementsBySelector(
            AbstractSplitpaneComponent.SPLIT_AREA_ELEMENT_SELECTOR);
        let splitGutterEls: NodeListOf<HTMLElement>;
        splitGutterEls = this.getElementsBySelector(
            AbstractSplitpaneComponent.SPLIT_GUTTER_ELEMENT_SELECTOR);
        if (splitAreaEls && splitAreaEls.length && splitGutterEls && splitGutterEls.length) {
            let maxHeight: number;
            maxHeight = 0;
            splitAreaEls.forEach(splitAreaEl => {
                maxHeight = Math.max(splitAreaEl.offsetHeight, maxHeight);
            });
            let splitGutterEl: HTMLElement;
            splitGutterEl = splitGutterEls.item(0);
            this.getRenderer().setStyle(splitGutterEl, 'height', maxHeight + 'px');
        }
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Configure the specified area
     * @param area to config
     * @param config to apply
     */
    protected configArea(area: SplitAreaDirective, config: ISplitAreaConfig): void {
        if (!area || !config) {
            return;
        }

        area.size = config.size;
        area.minSize = config.minSize;
        area.maxSize = config.maxSize;
        area.lockSize = config.lockSize;
        area.visible = config.visible;
    }
}
