import {AfterViewInit, ComponentFactoryResolver, Inject, QueryList, Renderer2, ViewChildren, ViewContainerRef} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuComponent, ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';
import {LocalDataSource} from 'ng2-smart-table';
import {
    DocumentKeydownHandlerService,
    DocumentKeypressHandlerService,
    DocumentKeyupHandlerService,
} from '../../services/implementation/document.keypress.handler.service';
import {IContextMenu} from './smart-table.component';

/**
 * Abstract component
 */
export class AbstractComponent implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(ViewContainerRef)
    private readonly queryViewContainerRef: QueryList<ViewContainerRef>;
    private viewContainerRef: ViewContainerRef;

    @ViewChildren(ContextMenuComponent)
    private readonly queryContextMenuComponent: QueryList<ContextMenuComponent>;
    private contextMenuComponent: ContextMenuComponent;
    private contextMenu: IContextMenu[];

    private documentKeyDownHandlerService: DocumentKeydownHandlerService;
    private documentKeyUpHandlerService: DocumentKeyupHandlerService;
    private documentKeyPressHandlerService: DocumentKeypressHandlerService;

    // -------------------------------------------------
    // GETTER/SETTER
    // -------------------------------------------------

    /**
     * Get the {ComponentFactoryResolver} instance
     * @return the {ComponentFactoryResolver} instance
     */
    protected getFactoryResolver(): ComponentFactoryResolver {
        return this.factoryResolver;
    }

    /**
     * Get the {ViewContainerRef} instance
     * @return the {ViewContainerRef} instance
     */
    protected getViewContainerRef(): ViewContainerRef {
        return this.viewContainerRef;
    }

    /**
     * Get the Renderer2 instance for applying HTML element attributes
     * @return the Renderer2 instance
     */
    protected getRenderer(): Renderer2 {
        return this.renderer;
    }

    /**
     * Get the TranslateService instance for applying multilingual
     * @return the TranslateService instance
     */
    protected getTranslateService(): TranslateService {
        return this.translateService;
    }

    /**
     * Get the DocumentKeydownHandlerService instance for handling document `keydown` event
     * @return the DocumentKeydownHandlerService instance
     */
    protected getDocumentKeyDownHandlerService(): DocumentKeydownHandlerService {
        this.documentKeyDownHandlerService || throwError('Could not handle document keydown');
        return this.documentKeyDownHandlerService;
    }

    /**
     * Get the DocumentKeyupHandlerService instance for handling document `keyup` event
     * @return the DocumentKeyupHandlerService instance
     */
    protected getDocumentKeyUpHandlerService(): DocumentKeyupHandlerService {
        this.documentKeyUpHandlerService || throwError('Could not handle document keyup');
        return this.documentKeyUpHandlerService;
    }

    /**
     * Get the DocumentKeypressHandlerService instance for handling document `keypress` event
     * @return the DocumentKeypressHandlerService instance
     */
    protected getDocumentKeyPressHandlerService(): DocumentKeypressHandlerService {
        this.documentKeyPressHandlerService || throwError('Could not handle document keypress');
        return this.documentKeyPressHandlerService;
    }

    /**
     * Get the NGXLogger instance for logging
     * @return the NGXLogger instance
     */
    protected getLogger(): NGXLogger {
        return this.logger;
    }

    /**
     * Get the component DataSource instance
     * @return the component DataSource instance
     */
    protected getDataSource(): DataSource {
        return this.dataSource;
    }

    /**
     * Set the component DataSource instance
     * @param dataSource to apply
     */
    protected setDataSource(dataSource: DataSource) {
        dataSource || throwError('Not found data source!');
        this.dataSource = dataSource;
    }

    /**
     * Get the ContextMenuService instance for handling context menu
     * @return the ContextMenuService instance
     */
    protected getContextMenuService(): ContextMenuService {
        return this.contextMenuService;
    }

    /**
     * Get the context menu component
     * @return the context menu component
     */
    protected getContextMenuComponent(): ContextMenuComponent {
        return this.contextMenuComponent;
    }

    /**
     * Get the context menu items array
     * @return the context menu items array
     */
    public getContextMenu(): IContextMenu[] {
        return this.contextMenu || [];
    }

    /**
     * Set the context menu items array to show
     * @param contextMenu the context menu items array
     */
    protected setContextMenu(contextMenu: IContextMenu[]) {
        (contextMenu && contextMenu.length) || throwError('Context menu must be valid');
        this.contextMenu = contextMenu;
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
    protected constructor(@Inject(DataSource) private dataSource: DataSource,
                          @Inject(ContextMenuService) private contextMenuService: ContextMenuService,
                          @Inject(NGXLogger) private logger: NGXLogger,
                          @Inject(Renderer2) private renderer: Renderer2,
                          @Inject(TranslateService) private translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) private factoryResolver: ComponentFactoryResolver) {
        contextMenuService || throwError('Could not inject ContextMenuService');
        logger || throwError('Could not inject NGXLogger');
        renderer || throwError('Could not inject Renderer2');
        translateService || throwError('Could not inject TranslateService');
        factoryResolver || throwError('Could not inject ComponentFactoryResolver');
        dataSource = dataSource || new LocalDataSource();
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        this.queryViewContainerRef.map(
            (item) => this.viewContainerRef = item);
        this.queryContextMenuComponent.map(
            (item) => this.contextMenuComponent = item);
        this.documentKeyDownHandlerService = new DocumentKeydownHandlerService(
            (e: KeyboardEvent) => this.onKeyDown(e), this.getLogger());
        this.documentKeyUpHandlerService = new DocumentKeyupHandlerService(
            (e: KeyboardEvent) => this.onKeyUp(e), this.getLogger());
        this.documentKeyPressHandlerService = new DocumentKeypressHandlerService(
            (e: KeyboardEvent) => this.onKeyPress(e), this.getLogger());
    }

    /**
     * Perform keydown action
     * @param event KeyboardEvent
     */
    onKeyDown(event: KeyboardEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyDown', event);
    }

    /**
     * Perform keyup action
     * @param event KeyboardEvent
     */
    onKeyUp(event: KeyboardEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyUp', event);
    }

    /**
     * Perform keypress action
     * @param event KeyboardEvent
     */
    onKeyPress(event: KeyboardEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyPress');
    }
}
