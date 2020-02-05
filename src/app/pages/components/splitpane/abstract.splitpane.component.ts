import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent} from '../abstract.component';
import {AfterViewInit, ComponentFactoryResolver, Inject, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {SplitComponent} from 'angular-split';

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
     * Set a boolean value indicating this component whether is splitted by horizontal direction
     * @param horizontal true for horizontal; else false
     */
    public setHorizontal(horizontal?: boolean): void {
        this.horizontal = horizontal || false;
    }

    /**
     * Get the {SplitComponent} instance
     * @return the {SplitComponent} instance
     */
    protected getSplitComponent(): SplitComponent {
        return this.splitComponent;
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
     */
    protected constructor(@Inject(DataSource) dataSource: T,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          private horizontal?: boolean | false) {
        super(dataSource, contextMenuService, logger, renderer, translateService, factoryResolver);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.querySplitComponent.map(
            (item) => this.splitComponent = item);
    }
}
