import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent} from './abstract.component';
import {AfterViewInit, ComponentFactoryResolver, Inject, Renderer2} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';

/**
 * Abstract SplitPane component base on {AngularSplitModule}
 */
export abstract class AbstractSplitpaneComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating this component whether is splitted by horizontal direction
     * @return true for drop-down; else false
     */
    protected isHorizontal(): boolean {
        return this.horizontal;
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
}
