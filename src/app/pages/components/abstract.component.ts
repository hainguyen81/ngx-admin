import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    ComponentFactoryResolver,
    DoCheck,
    Inject,
    OnChanges,
    OnDestroy,
    OnInit,
    QueryList,
    Renderer2,
    SimpleChanges,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
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
import HtmlUtils from '../../utils/html.utils';
import KeyboardUtils from '../../utils/keyboard.utils';

export const CONTEXT_MENU_ADD: string = 'MENU_ADD';
export const CONTEXT_MENU_EDIT: string = 'MENU_EDIT';
export const CONTEXT_MENU_DELETE: string = 'MENU_DELETE';

/**
 * Context menu item declaration
 */
export interface IContextMenu {
    id?: (item?: any) => string;
    icon: (item?: any) => string;
    title: (item?: any) => string;
    enabled: (item?: any) => boolean;
    visible: (item?: any) => boolean;
    divider: (item?: any) => boolean;
    click?: (item?: any) => void | null;
}

/* Customize event for abstract component */
export interface IEvent {
    $data?: any | null;
    $event?: Event | null;
}

/**
 * Abstract component
 */
export class AbstractComponent
    implements OnChanges, OnInit, DoCheck,
        AfterContentInit, AfterContentChecked,
        AfterViewInit, AfterViewChecked,
        OnDestroy {

    protected static CONTEXT_MENU_SELECTOR: string = '.ngx-contextmenu';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(AbstractComponent, { read: ViewContainerRef })
    private readonly queryViewContainerRef: QueryList<ViewContainerRef>;

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
     * @param viewContainerRef {ViewContainerRef}
     */
    protected constructor(@Inject(DataSource) private dataSource: DataSource,
                          @Inject(ContextMenuService) private contextMenuService: ContextMenuService,
                          @Inject(NGXLogger) private logger: NGXLogger,
                          @Inject(Renderer2) private renderer: Renderer2,
                          @Inject(TranslateService) private translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) private factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef) {
        contextMenuService || throwError('Could not inject ContextMenuService');
        logger || throwError('Could not inject NGXLogger');
        renderer || throwError('Could not inject Renderer2');
        translateService || throwError('Could not inject TranslateService');
        factoryResolver || throwError('Could not inject ComponentFactoryResolver');
        dataSource = dataSource || new LocalDataSource();
        dataSource.onChanged().subscribe(value => this.onDataSourceChanged({$data: value}));
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnChanges(changes: SimpleChanges): void {
        // TODO Waiting for implementing from children component
        // this.getLogger().debug('ngOnChanges', changes,
        //     'queryViewContainerRef', this.queryViewContainerRef,
        //     'queryContextMenuComponent', this.queryContextMenuComponent);
    }

    ngOnInit(): void {
        // TODO Waiting for implementing from children component
        // this.getLogger().debug('ngOnInit',
        //     'queryViewContainerRef', this.queryViewContainerRef,
        //     'queryContextMenuComponent', this.queryContextMenuComponent);
    }

    ngDoCheck(): void {
        // TODO Waiting for implementing from children component
        // this.getLogger().debug('ngDoCheck',
        //     'queryViewContainerRef', this.queryViewContainerRef,
        //     'queryContextMenuComponent', this.queryContextMenuComponent);
    }

    ngAfterContentInit(): void {
        // TODO Waiting for implementing from children component
        // this.getLogger().debug('ngAfterContentInit',
        //     'queryViewContainerRef', this.queryViewContainerRef,
        //     'queryContextMenuComponent', this.queryContextMenuComponent);
    }

    ngAfterContentChecked(): void {
        // TODO Waiting for implementing from children component
        // this.getLogger().debug('ngAfterContentChecked',
        //     'queryViewContainerRef', this.queryViewContainerRef,
        //     'queryContextMenuComponent', this.queryContextMenuComponent);
    }

    ngAfterViewInit(): void {
        // TODO Waiting for implementing from children component
        // this.getLogger().debug('ngAfterViewInit',
        //     'queryViewContainerRef', this.queryViewContainerRef,
        //     'queryContextMenuComponent', this.queryContextMenuComponent);

        if (!this.viewContainerRef && this.queryViewContainerRef) {
            this.queryViewContainerRef.map(
                (item) => this.viewContainerRef = item);
        }
        if (!this.contextMenuComponent && this.queryContextMenuComponent) {
            this.queryContextMenuComponent.map(
                (item) => this.contextMenuComponent = item);
        }
        this.documentKeyDownHandlerService = new DocumentKeydownHandlerService(
            (e: KeyboardEvent) => this.onKeyDown({$event: e}), this.getLogger());
        this.documentKeyUpHandlerService = new DocumentKeyupHandlerService(
            (e: KeyboardEvent) => this.onKeyUp({$event: e}), this.getLogger());
        this.documentKeyPressHandlerService = new DocumentKeypressHandlerService(
            (e: KeyboardEvent) => this.onKeyPress({$event: e}), this.getLogger());
    }

    ngAfterViewChecked(): void {
        // TODO Waiting for implementing from children component
        // this.getLogger().debug('ngAfterViewChecked',
        //     'queryViewContainerRef', this.queryViewContainerRef,
        //     'queryContextMenuComponent', this.queryContextMenuComponent);
    }

    ngOnDestroy(): void {
        // TODO Waiting for implementing from children component
        // this.getLogger().debug('ngOnDestroy',
        //     'queryViewContainerRef', this.queryViewContainerRef,
        //     'queryContextMenuComponent', this.queryContextMenuComponent);
    }

    /**
     * Perform keydown action
     * @param event KeyboardEvent
     */
    onKeyDown(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyDown', event);
        if (event && event.$event instanceof KeyboardEvent
            && KeyboardUtils.isNavigateKey(event.$event as KeyboardEvent)) {
            // handle navigation keys
            this.onNavigateKeyDown(event);

        } else if (event && event.$event instanceof KeyboardEvent
            && KeyboardUtils.isContextMenuKey(event.$event)) {
            // handle context menu key
            this.onContextMenuKeyDown(event);

        } else if (event && event.$event instanceof KeyboardEvent) {
            // handle action keydown
            this.onActionKeyDown(event);
        }
    }

    /**
     * Perform navigate keydown action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onNavigateKeyDown(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onNavigateKeyDown', event);
    }

    /**
     * Perform context menu keydown action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onContextMenuKeyDown(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onContextMenuKeyDown', event);
    }

    /**
     * Perform keydown action (not navigate and context menu key
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onActionKeyDown(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onContextMenuKeyDown', event);
    }

    /**
     * Perform keyup action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onKeyUp(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyUp', event);
        if (event && event.$event instanceof KeyboardEvent
            && (KeyboardUtils.isNavigateKey(event.$event as KeyboardEvent)
                || KeyboardUtils.isContextMenuKey(event.$event as KeyboardEvent))) {
            // stop firing event
            this.preventEvent(event.$event);
        }
    }

    /**
     * Perform keypress action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onKeyPress(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyPress', event);
    }

    /**
     * Triggered ContextMenu.
     * @param event {IEvent} that contains {$event} as MouseEvent
     */
    onContextMenu(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onContextMenu', event);
        if (event && event.$event instanceof MouseEvent
            && ((!this.getContextMenu() || !this.getContextMenu().length)
                || this.showHideContextMenu(event.$event, event.$event.target, event.$data))) {
            // stop firing event
            this.preventEvent(event.$event);
        }
    }

    /**
     * Triggered closed ContextMenu.
     */
    onContextMenuClose(): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onContextMenuClose');
    }

    /**
     * Perform action on menu item has been clicked
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      event: action event
     *      item: menu item data
     */
    onMenuEvent(event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMenuEvent', event);
        if (event && event.$data && event.$data['item']
            && typeof event.$data['item']['click'] === 'function') {
            event.$data['item']['click']['apply'](this, [event.$data['item']]);
        }
    }

    /**
     * Perform action on resize event
     * @param event {IEvent} that contains {$event} as DOM resize event
     */
    onResize(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onResize', event);
    }

    /**
     * Perform action on resize event
     * @param event {IEvent} that contains {$data} as ResizedEvent
     */
    onResized(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onResized', event);
    }

    /**
     * Perform action on data-source changed event
     * @param value {IEvent} that contains {$data} as changed value
     */
    onDataSourceChanged(value: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDataSourceChanged', value);
    }

    /**
     * Triggered click event
     * @param event {IEvent} that contains {$event} as MouseEvent
     */
    onClick(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClick', event);
    }

    /**
     * Triggered only on a user double-click event.
     * @param event {IEvent} that contains {$event} as DOM `dbclick` event
     */
    onDoubleClick(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDoubleClick', event);
    }

    /**
     * Triggered only on a user `mousedown` event.
     * @param event {IEvent} that contains {$event} as DOM `mousedown` MouseEvent
     */
    onMouseDown(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseDown', event);
    }

    /**
     * Triggered only on a user `mouseenter` event.
     * @param event {IEvent} that contains {$event} as DOM `mouseenter` event
     */
    onMouseEnter(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseEnter', event);
    }

    /**
     * Triggered only on a user `mouseleave` event.
     * @param event {IEvent} that contains {$event} as DOM `mouseleave` event
     */
    onMouseLeave(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseLeave', event);
    }

    /**
     * Triggered only on a user `mousemove` event.
     * @param event {IEvent} that contains {$event} as DOM `mousemove` event
     */
    onMouseMove(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseMove', event);
    }

    /**
     * Triggered only on a user `mouseout` event.
     * @param event {IEvent} that contains {$event} as DOM `mouseout` event
     */
    onMouseOut(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseOut', event);
    }

    /**
     * Triggered only on a user `mouseover` event.
     * @param event {IEvent} that contains {$event} as DOM `mouseover` event
     */
    onMouseOver(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseOver', event);
    }

    /**
     * Triggered only on a user `mouseup` event.
     * @param event {IEvent} that contains {$event} as DOM `mouseup` event
     */
    onMouseUp(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseUp', event);
    }

    /**
     * Triggered only on a user `mousewheel` event.
     * @param event {IEvent} that contains {$event} as DOM `mousewheel` event
     */
    onMouseWheel(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseWheel', event);
    }

    /**
     * Triggered `focus` event
     * @param event {IEvent} that contains {$event} as FocusEvent
     */
    onFocus(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onFocus', event);
    }

    /**
     * Triggered `focusin` event
     * @param event {IEvent} that contains {$event} as FocusEvent
     */
    onFocusIn(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onFocusIn', event);
    }

    /**
     * Triggered `focusout` event
     * @param event {IEvent} that contains {$event} as FocusEvent
     */
    onFocusOut(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onFocusOut', event);
    }

    /**
     * Triggered `blur` event
     * @param event {IEvent} that contains {$event} as FocusEvent
     */
    onBlur(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onBlur', event);
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Prevent the specified event
     * @param event to prevent
     */
    protected preventEvent(event: Event): boolean {
        return HtmlUtils.preventEvent(event);
    }

    /**
     * Show/Hide context menu base on the specified Row
     * @param event current event
     * @param target element target to show context menu if event is invalid
     * @param data attached data
     * @return true for showing context menu; else false
     */
    protected showHideContextMenu(event?: Event, target?: Element | EventTarget, data?: any): boolean {
        this.getLogger().debug('showHideContextMenu', data);
        let mouseEvent: MouseEvent;
        mouseEvent = (event instanceof MouseEvent ? event as MouseEvent : undefined);
        let kbEvent: KeyboardEvent;
        kbEvent = (event instanceof KeyboardEvent ? event as KeyboardEvent : undefined);
        let eventTarget: Element | EventTarget;
        eventTarget = (event && event.target instanceof Node ? event.target : target);
        this.getContextMenuService().show.next({
            // Optional - if unspecified, all context menu components will open
            contextMenu: this.getContextMenuComponent(),
            event: mouseEvent || kbEvent,
            item: data,
            anchorElement: eventTarget,
        });
        // wait for showing context menu and focus on it
        setTimeout(() => {
            let ctxMnuEls: NodeListOf<HTMLElement>;
            ctxMnuEls = this.getElementsBySelector(AbstractComponent.CONTEXT_MENU_SELECTOR);
            if (ctxMnuEls && ctxMnuEls.length) {
                ctxMnuEls[0].focus({preventScroll: true});
            }
        }, 300);
        return true;
    }

    /**
     * Support for closing all context menu
     */
    public closeContextMenu() {
        const keyEvent = new KeyboardEvent('keydown', {key: 'Escape'});
        this.getContextMenuService().closeAllContextMenus({
            eventType: 'cancel',
            event: keyEvent,
        });
    }

    /**
     * Get the DOM elements by the specified selector
     * @return DOM elements or undefined
     */
    protected getElementsBySelector(selector: string, element?: Element): NodeListOf<HTMLElement> {
        return HtmlUtils.getElementsBySelector(selector, element);
    }

    /**
     * Get the focusable DOM elements of the specified element
     * @param element to filter. undefined for filtering whole document
     * @return focusable DOM elements or undefined
     */
    protected getFocusableElements(element?: Element): NodeListOf<HTMLElement> {
        return HtmlUtils.getFocusableElements(element);
    }

    /**
     * Toggle the specified class for the specified DOM element
     * @param element to toggle
     * @param className class
     * @param add true for adding class if not existed; false for removing if existed
     */
    protected toggleElementClass(element: HTMLElement, className: string, add?: boolean | false) {
        if (!add && (className || '').length && element.classList.contains(className)) {
            this.getRenderer().removeClass(element, className);

        } else if ((className || '').length && !element.classList.contains(className)) {
            this.getRenderer().addClass(element, className);
        }
    }
}
