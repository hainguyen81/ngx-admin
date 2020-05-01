import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    DoCheck,
    ElementRef,
    Inject,
    OnChanges,
    OnDestroy,
    OnInit,
    QueryList,
    Renderer2,
    SimpleChanges, Type,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuComponent, ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {Observable, throwError} from 'rxjs';
import {LocalDataSource} from 'ng2-smart-table';
import HtmlUtils from '../../utils/html.utils';
import KeyboardUtils from '../../utils/keyboard.utils';
import ComponentUtils from '../../utils/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ConfirmPopup, ConfirmPopupConfig} from 'ngx-material-popup';
import {ModalDialogService} from 'ngx-modal-dialog';
import {
    BaseElementKeydownHandlerService,
    BaseElementKeypressHandlerService,
    BaseElementKeyupHandlerService,
} from '../../services/implementation/base.keyboard.handler';
import {
    AbstractKeydownEventHandlerService,
    AbstractKeypressEventHandlerService,
    AbstractKeyupEventHandlerService,
} from '../../services/event.handler.service';
import {IComponentService} from '../../services/interface.service';
import {AbstractComponentService, BaseComponentService} from '../../services/component.service';
import {Lightbox} from 'ngx-lightbox';
import {IAlbum} from 'ngx-lightbox/lightbox-event.service';
import {AutoUnsubscribe} from './customization/extend.component';
import {isNullOrUndefined} from 'util';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import AppUtils from '../../utils/app.utils';
import {NgxLocalStorageEncryptionService} from '../../services/storage.services/local.storage.services';
import {AppConfig} from '../../config/app.config';
import {__evalContextMenuItem, IContextMenu} from '../../config/context.menu.conf';
import {ActivatedRoute, Data, ParamMap, Params, Router} from '@angular/router';

/* Customize event for abstract component */
export interface IEvent {
    data?: any | null;
    event?: Event | void | null;
}

/**
 * Abstract component
 */
@AutoUnsubscribe()
export abstract class AbstractComponent
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

    private componentKeyDownHandlerService: AbstractKeydownEventHandlerService<Element>;
    private componentKeyUpHandlerService: AbstractKeyupEventHandlerService<Element>;
    private componentKeyPressHandlerService: AbstractKeypressEventHandlerService<Element>;

    // -------------------------------------------------
    // GETTER/SETTER
    // -------------------------------------------------

    /**
     * Get the application base href
     * @return the application base href
     */
    public get baseHref(): string {
        return HtmlUtils.getBaseHref();
    }

    /**
     * Get the activated route parameters
     * @return the activated route parameters
     */
    protected get parametersMap(): Observable<ParamMap> {
        const activatedRoute: ActivatedRoute = this.getActivatedRoute();
        return (activatedRoute ? activatedRoute.paramMap : undefined);
    }

    /**
     * Get the activated route parameters
     * @return the activated route parameters
     */
    protected get parameters(): Observable<Params> {
        const activatedRoute: ActivatedRoute = this.getActivatedRoute();
        return (activatedRoute ? activatedRoute.params : undefined);
    }

    /**
     * Get the activated route data
     * @return the activated route data
     */
    protected get activatedRouteData(): Observable<Data> {
        const activatedRoute: ActivatedRoute = this.getActivatedRoute();
        return (activatedRoute ? activatedRoute.data : undefined);
    }

    /**
     * Get the activated route query parameters
     * @return the activated route query parameters
     */
    protected get queryParametersMap(): Observable<ParamMap> {
        const activatedRoute: ActivatedRoute = this.getActivatedRoute();
        return (activatedRoute ? activatedRoute.queryParamMap : undefined);
    }

    /**
     * Get the activated route data
     * @return the activated route data
     */
    protected get queryParameters(): Observable<Params> {
        const activatedRoute: ActivatedRoute = this.getActivatedRoute();
        return (activatedRoute ? activatedRoute.queryParams : undefined);
    }

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
     * Get the {ChangeDetectorRef} instance
     * @return the {ChangeDetectorRef} instance
     */
    protected getChangeDetectorRef(): ChangeDetectorRef {
        return this.changeDetectorRef;
    }

    /**
     * Get the {ElementRef} instance
     * @return the {ElementRef} instance
     */
    protected getElementRef(): ElementRef {
        return this.elementRef;
    }

    /**
     * Get the native {ElementRef} instance
     * @return the native {ElementRef} instance
     */
    protected getNativeElement(): any {
        return (this.getElementRef() == null ? null : this.getElementRef().nativeElement);
    }

    /**
     * Get the native {ElementRef} tag name
     * @return the native {ElementRef} tag name
     */
    protected getNativeElementTagName(): any {
        let element: Element;
        element = this.getNativeElement() as Element;
        return (element == null ? null : element.tagName);
    }

    /**
     * Get the {Renderer2} instance for applying HTML element attributes
     * @return the {Renderer2} instance
     */
    protected getRenderer(): Renderer2 {
        return this.renderer;
    }

    /**
     * Get the {TranslateService} instance for applying multilingual
     * @return the {TranslateService} instance
     */
    protected getTranslateService(): TranslateService {
        return this.translateService;
    }

    /**
     * Get the {AbstractKeydownEventHandlerService} instance for handling component/document `keydown` event
     * @return the {AbstractKeydownEventHandlerService} instance
     */
    protected getComponentKeyDownHandlerService(): AbstractKeydownEventHandlerService<Element> {
        this.componentKeyDownHandlerService || throwError('Could not handle component/document `keydown`');
        return this.componentKeyDownHandlerService;
    }

    /**
     * Get the {AbstractKeyupEventHandlerService} instance for handling component/document `keyup` event
     * @return the {AbstractKeyupEventHandlerService} instance
     */
    protected getComponentKeyUpHandlerService(): AbstractKeyupEventHandlerService<Element> {
        this.componentKeyUpHandlerService || throwError('Could not handle component/document `keyup`');
        return this.componentKeyUpHandlerService;
    }

    /**
     * Get the {AbstractKeypressEventHandlerService} instance for handling component/document `keypress` event
     * @return the {AbstractKeypressEventHandlerService} instance
     */
    protected getComponentKeyPressHandlerService(): AbstractKeypressEventHandlerService<Element> {
        this.componentKeyPressHandlerService || throwError('Could not handle component/document `keypress`');
        return this.componentKeyPressHandlerService;
    }

    /**
     * Get the {NGXLogger} instance for logging
     * @return the {NGXLogger} instance
     */
    protected getLogger(): NGXLogger {
        return this.logger;
    }

    /**
     * Get the {Router} instance for navigating
     * @return the {Router} instance
     */
    protected getRouter(): Router {
        return this.router;
    }

    /**
     * Get the {ActivatedRoute} instance for parsing parameters
     * @return the {ActivatedRoute} instance
     */
    protected getActivatedRoute(): ActivatedRoute {
        return this.activatedRoute;
    }

    /**
     * Get the component {DataSource} instance
     * @return the component {DataSource} instance
     */
    protected getDataSource(): DataSource {
        return this.dataSource;
    }

    /**
     * Set the component {DataSource} instance
     * @param dataSource to apply
     */
    protected setDataSource(dataSource: DataSource) {
        dataSource || throwError('Not found data source!');
        this.dataSource = dataSource;
    }

    /**
     * Get the {ToastrService} instance for showing notification popup
     * @return the {ToastrService} instance
     */
    protected getToasterService(): ToastrService {
        return this.toasterService;
    }

    /**
     * Get the {Lightbox} instance for showing image lightbox
     * @return the {Lightbox} instance
     */
    protected getLightbox(): Lightbox {
        return this.lightbox;
    }

    /**
     * Get the {ModalDialogService} instance for showing modal dialog if necessary
     * @return the {ModalDialogService} instance
     */
    protected getModalDialogService(): ModalDialogService {
        this.modalDialogService || throwError('Could not inject ModalDialogService');
        return this.modalDialogService;
    }

    /**
     * Get the {ConfirmPopup} instance for showing confirmation popup if necessary
     * @return the {ConfirmPopup} instance
     */
    protected getConfirmPopup(): ConfirmPopup {
        this.confirmPopup || throwError('Could not inject ConfirmPopup');
        return this.confirmPopup;
    }

    /**
     * Get the {ContextMenuService} instance for handling context menu
     * @return the {ContextMenuService} instance
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
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param elementRef {ElementRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     * @param lightbox {Lightbox}
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     */
    protected constructor(@Inject(DataSource) private dataSource: DataSource,
                          @Inject(ContextMenuService) private contextMenuService: ContextMenuService,
                          @Inject(ToastrService) private toasterService: ToastrService,
                          @Inject(NGXLogger) private logger: NGXLogger,
                          @Inject(Renderer2) private renderer: Renderer2,
                          @Inject(TranslateService) private translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) private factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) private changeDetectorRef: ChangeDetectorRef,
                          @Inject(ElementRef) private elementRef: ElementRef,
                          @Inject(ModalDialogService) private modalDialogService?: ModalDialogService,
                          @Inject(ConfirmPopup) private confirmPopup?: ConfirmPopup,
                          @Inject(Lightbox) private lightbox?: Lightbox,
                          @Inject(Router) private router?: Router,
                          @Inject(ActivatedRoute) private activatedRoute?: ActivatedRoute) {
        contextMenuService || throwError('Could not inject ContextMenuService');
        toasterService || throwError('Could not inject ToastrService');
        logger || throwError('Could not inject NGXLogger');
        renderer || throwError('Could not inject Renderer2');
        translateService || throwError('Could not inject TranslateService');
        factoryResolver || throwError('Could not inject ComponentFactoryResolver');
        router || throwError('Could not inject Router');
        dataSource = dataSource || new LocalDataSource();
        dataSource.onChanged().subscribe(value => this.onDataSourceChanged({data: value}));
        translateService.onLangChange.subscribe(value => this.onLangChange({event: value}));
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

        if (!this.viewContainerRef) {
            this.viewContainerRef = ComponentUtils.queryComponent(this.queryViewContainerRef);
        }
        if (!this.contextMenuComponent) {
            this.contextMenuComponent = ComponentUtils.queryComponent(this.queryContextMenuComponent);
        }

        // initialize keyboard handlers
        this.initializeKeyboardHandlers();
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
        this.getLogger().debug('onKeyDown', event, '[', this.constructor.name, ']');

        // check whether navigating on context menu
        let isOnContextMenu: boolean;
        let targetEl: HTMLElement;
        targetEl = (event && event.event as Event ? (<Event>event.event).target as HTMLElement : null);
        isOnContextMenu = this.hasClosestElement(AbstractComponent.CONTEXT_MENU_SELECTOR, targetEl);
        // if action key on context-menu, not handle it
        if (isOnContextMenu) {
            return;
        }

        if (event && event.event instanceof KeyboardEvent
            && KeyboardUtils.isNavigateKey(event.event as KeyboardEvent)) {
            // close context menu
            this.closeContextMenu();

            // handle navigation keys
            this.onNavigateKeyDown(event);

        } else if (event && event.event instanceof KeyboardEvent
            && KeyboardUtils.isContextMenuKey(event.event)) {
            // handle context menu key
            this.onContextMenuKeyDown(event);

        } else if (event && event.event instanceof KeyboardEvent) {
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
        this.getLogger().debug('onNavigateKeyDown', event, '[', this.constructor.name, ']');
    }

    /**
     * Perform context menu keydown action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onContextMenuKeyDown(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onContextMenuKeyDown', event, '[', this.constructor.name, ']');
    }

    /**
     * Perform keydown action (not navigate and context menu key
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onActionKeyDown(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onContextMenuKeyDown', event, '[', this.constructor.name, ']');
    }

    /**
     * Perform keyup action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onKeyUp(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyUp', event, '[', this.constructor.name, ']');
        if (event && event.event instanceof KeyboardEvent
            && (KeyboardUtils.isNavigateKey(event.event as KeyboardEvent)
                || KeyboardUtils.isContextMenuKey(event.event as KeyboardEvent))) {
            // stop firing event
            this.preventEvent(event.event);
        }
    }

    /**
     * Perform keypress action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onKeyPress(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyPress', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered ContextMenu.
     * @param event {IEvent} that contains {$event} as MouseEvent
     */
    onContextMenu(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onContextMenu', event, '[', this.constructor.name, ']');
        if (event && event.event instanceof MouseEvent
            && ((!this.getContextMenu() || !this.getContextMenu().length)
                || this.showHideContextMenu(event.event, event.event.target, event.data))) {
            // stop firing event
            this.preventEvent(event.event);
        }
    }

    /**
     * Triggered closed ContextMenu.
     */
    onContextMenuClose(): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onContextMenuClose', '[', this.constructor.name, ']');
    }

    /**
     * Perform action on menu item has been clicked
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      menu: menu item
     *      item: menu item data
     * and {$event} as action event
     */
    onMenuEvent(event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMenuEvent', event, '[', this.constructor.name, ']');
        if (event && event.data && event.data['menu']) {
            if (typeof event.data['menu']['click'] === 'function') {
                event.data['menu']['click']['apply'](this, [event.data['item']]);
            } else {
                let menuItem: IContextMenu;
                menuItem = event.data['menu'] as IContextMenu;
                let mnuId: string;
                mnuId = (menuItem && typeof menuItem.id === 'function'
                    ? menuItem.id.apply(this, [event.data['item']]) : menuItem.id);
                this.doMenuAction(event, mnuId, event.data['item']);
            }
        }
    }

    /**
     * Perform action on resize event
     * @param event {IEvent} that contains {$event} as DOM resize event
     */
    onResize(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onResize', event, '[', this.constructor.name, ']');
    }

    /**
     * Perform action on resize event
     * @param event {IEvent} that contains {$data} as ResizedEvent
     */
    onResized(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onResized', event, '[', this.constructor.name, ']');
    }

    /**
     * Perform action on data-source changed event
     * @param value {IEvent} that contains {$data} as changed value
     */
    onDataSourceChanged(value: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDataSourceChanged', value, '[', this.constructor.name, ']');
    }

    /**
     * Triggered click event
     * @param event {IEvent} that contains {$event} as MouseEvent
     */
    onClick(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClick', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered only on a user double-click event.
     * @param event {IEvent} that contains {$event} as DOM `dbclick` event
     */
    onDoubleClick(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDoubleClick', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered only on a user `mousedown` event.
     * @param event {IEvent} that contains {$event} as DOM `mousedown` MouseEvent
     */
    onMouseDown(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseDown', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered only on a user `mouseenter` event.
     * @param event {IEvent} that contains {$event} as DOM `mouseenter` event
     */
    onMouseEnter(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseEnter', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered only on a user `mouseleave` event.
     * @param event {IEvent} that contains {$event} as DOM `mouseleave` event
     */
    onMouseLeave(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseLeave', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered only on a user `mousemove` event.
     * @param event {IEvent} that contains {$event} as DOM `mousemove` event
     */
    onMouseMove(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseMove', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered only on a user `mouseout` event.
     * @param event {IEvent} that contains {$event} as DOM `mouseout` event
     */
    onMouseOut(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseOut', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered only on a user `mouseover` event.
     * @param event {IEvent} that contains {$event} as DOM `mouseover` event
     */
    onMouseOver(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseOver', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered only on a user `mouseup` event.
     * @param event {IEvent} that contains {$event} as DOM `mouseup` event
     */
    onMouseUp(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseUp', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered only on a user `mousewheel` event.
     * @param event {IEvent} that contains {$event} as DOM `mousewheel` event
     */
    onMouseWheel(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseWheel', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered `focus` event
     * @param event {IEvent} that contains {$event} as FocusEvent
     */
    onFocus(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onFocus', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered `focusin` event
     * @param event {IEvent} that contains {$event} as FocusEvent
     */
    onFocusIn(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onFocusIn', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered `focusout` event
     * @param event {IEvent} that contains {$event} as FocusEvent
     */
    onFocusOut(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onFocusOut', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered `blur` event
     * @param event {IEvent} that contains {$event} as FocusEvent
     */
    onBlur(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onBlur', event, '[', this.constructor.name, ']');
    }

    /**
     * Triggered `languageChange` event
     * @param event {IEvent} that contains {$event} as LangChangeEvent
     */
    onLangChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onLangChange', event, '[', this.constructor.name, ']');
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Initialize keyboard handlers for component or document
     */
    protected initializeKeyboardHandlers(): void {
        let componentElement: Element;
        componentElement = this.getNativeElement() as Element;
        this.componentKeyDownHandlerService = new BaseElementKeydownHandlerService<Element>(
            (componentElement ? componentElement : document),
            (e: KeyboardEvent) => this.onKeyDown({event: e}), this.getLogger());
        this.componentKeyUpHandlerService = new BaseElementKeyupHandlerService<Element>(
            (componentElement ? componentElement : document),
            (e: KeyboardEvent) => this.onKeyUp({event: e}), this.getLogger());
        this.componentKeyPressHandlerService = new BaseElementKeypressHandlerService<Element>(
            (componentElement ? componentElement : document),
            (e: KeyboardEvent) => this.onKeyPress({event: e}), this.getLogger());
    }

    /**
     * Prevent the specified event
     * @param event to prevent
     */
    protected preventEvent(event: any): boolean {
        return HtmlUtils.preventEvent(event);
    }

    /**
     * Perform action on menu item
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      menu: menu item
     *      item: menu item data
     * and {$event} as action event
     * @param menuId menu item identity
     * @param data menu data
     */
    protected doMenuAction(event: IEvent, menuId?: string | null, data?: any | null) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('doMenuAction', menuId, data);
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
        eventTarget = (target ? target : event && event.target instanceof Node ? event.target : undefined);
        if ((<HTMLElement>target) && event && (<HTMLElement>event.target)
            && target !== event.target
            && ((<HTMLElement>target).contains(<HTMLElement>event.target)
                || (<HTMLElement>event.target).contains(<HTMLElement>target))) {
            eventTarget = event.target;
        }
        eventTarget && this.getContextMenuService().show.next({
            // Optional - if unspecified, all context menu components will open
            contextMenu: this.getContextMenuComponent(),
            event: mouseEvent || kbEvent,
            item: data,
            anchorElement: eventTarget,
        });
        // wait for showing context menu and focus on it
        if (eventTarget) {
            let timer: number;
            timer = window.setTimeout(() => {
                let ctxMnuEls: NodeListOf<HTMLElement>;
                ctxMnuEls = this.getElementsBySelector(AbstractComponent.CONTEXT_MENU_SELECTOR);
                if (ctxMnuEls && ctxMnuEls.length) {
                    ctxMnuEls[0].focus({preventScroll: true});
                }
                clearTimeout(timer);
            }, 300);
            return true;
        }
        return false;
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
     * Get the closest DOM elements by the specified selector
     * @return DOM elements or undefined
     */
    protected getClosestElementBySelector(selector: string, element?: Element): Element {
        return HtmlUtils.getClosestElementBySelector(selector, (element || this.getElementRef().nativeElement));
    }

    /**
     * Get the closest DOM elements by the specified selector
     * @return DOM elements or undefined
     */
    protected getClosestHtmlElementBySelector(selector: string, element?: Element): HTMLElement {
        return this.getClosestElementBySelector(selector, element) as HTMLElement;
    }

    /**
     * Get the closest DOM elements by the specified selector
     * @return DOM elements or undefined
     */
    protected hasClosestElement(selector: string, element?: Element): boolean {
        return (element && !isNullOrUndefined(this.getClosestElementBySelector(selector, element)));
    }

    /**
     * Get the DOM elements by the specified selector
     * @return DOM elements or undefined
     */
    protected getElementsBySelector(selector: string, element?: Element): NodeListOf<HTMLElement> {
        return HtmlUtils.getElementsBySelector(selector, (element || this.getElementRef().nativeElement));
    }

    /**
     * Get the first occurred DOM elements by the specified selector
     * @return DOM elements or undefined
     */
    protected getFirstElementBySelector(selector: string, element?: Element): HTMLElement {
        return HtmlUtils.getFirstElementBySelector(selector, (element || this.getElementRef().nativeElement));
    }

    /**
     * Get the focusable DOM elements of the specified element
     * @param element to filter. undefined for filtering whole document
     * @return focusable DOM elements or undefined
     */
    protected getFocusableElements(element?: Element): NodeListOf<HTMLElement> {
        return HtmlUtils.getFocusableElements((element || this.getElementRef().nativeElement));
    }

    /**
     * Get the first occurred focusable DOM elements of the specified element
     * @param element to filter. undefined for filtering whole document
     * @return focusable DOM elements or undefined
     */
    protected getFirstFocusableElement(element?: Element): HTMLElement {
        return HtmlUtils.getFirstFocusableElement((element || this.getElementRef().nativeElement));
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

    /**
     * Show message notification toast
     * @param title toast title
     * @param body toast message
     * @param msgType toast type
     */
    protected showMessage(title?: string, body?: string, msgType?: string): void {
        if (!(title || '').length || !(body || '').length) {
            return;
        }
        this.getToasterService().show(this.translate(body), this.translate(title), undefined, msgType);
    }

    /**
     * Show success message notification toast
     * @param title toast title
     * @param body toast message
     */
    protected showSuccess(title?: string, body?: string): void {
        if (!(title || '').length || !(body || '').length) {
            return;
        }
        this.getToasterService().success(this.translate(body), this.translate(title));
    }

    /**
     * Show error message notification toast
     * @param title toast title
     * @param body toast message
     */
    protected showError(title?: string, body?: string): void {
        if (!(title || '').length || !(body || '').length) {
            return;
        }
        this.getToasterService().error(this.translate(body), this.translate(title));
    }

    /**
     * Show info message notification toast
     * @param title toast title
     * @param body toast message
     */
    protected showInfo(title?: string, body?: string): void {
        if (!(title || '').length || !(body || '').length) {
            return;
        }
        this.getToasterService().info(this.translate(body), this.translate(title));
    }

    /**
     * Show warning message notification toast
     * @param title toast title
     * @param body toast message
     */
    protected showWarning(title?: string, body?: string): void {
        if (!(title || '').length || !(body || '').length) {
            return;
        }
        this.getToasterService().warning(this.translate(body), this.translate(title));
    }

    /**
     * Show success notification toast about saving data
     */
    protected showSaveDataSuccess(): void {
        this.showSuccess('common.toast.save.success.title', 'common.toast.save.success.body');
    }

    /**
     * Show error notification toast about saving data
     */
    protected showSaveDataError(): void {
        this.showError('common.toast.save.error.title', 'common.toast.save.error.body');
    }

    /**
     * Show success notification toast about deleting data
     */
    protected showDeleteDataSuccess(): void {
        this.showSuccess('common.toast.delete.success.title', 'common.toast.delete.success.body');
    }

    /**
     * Show error notification toast about deleting data
     */
    protected showDeleteDataError(): void {
        this.showError('common.toast.delete.error.title', 'common.toast.delete.error.body');
    }

    /**
     * Show global error notification toast
     */
    protected showGlobalError(): void {
        this.showError('app', 'common.toast.unknown');
    }

    /**
     * Translate the specified value
     * @param value to translate
     * @return translated value or itself
     */
    public translate(value?: string, interpolateParams?: Object | null): string {
        if (!(value || '').length || !this.getTranslateService()) {
            return value;
        }
        const translatedValue: string = (interpolateParams
            ? this.getTranslateService().instant(value, interpolateParams)
            : this.getTranslateService().instant(value));
        return translatedValue;
    }

    /**
     * Create component dynamically at the specified {ViewContainerRef}
     * @param viewContainerRef {ViewContainerRef}
     * @param componentType component type
     * @return the created component
     */
    protected createComponentAt(viewContainerRef: ViewContainerRef, componentType: Type<any>): any {
        !viewContainerRef && throwError('Not found view container to create component!');
        !componentType && throwError('Not found component type to create!');

        let compServ: IComponentService<any>;
        compServ = new BaseComponentService(
            this.getFactoryResolver(), viewContainerRef, this.getLogger(), componentType);
        return ComponentUtils.createComponent(
            (compServ as AbstractComponentService<any>), viewContainerRef, true);
    }

    /**
     * Open the specified images album at the specified image index
     * @param album images album
     * @param imageIndex to show
     * @param options lightbox options
     */
    public openLightbox(album: Array<IAlbum>, imageIndex?: number, options?: {}): void {
        !this.getLightbox() && throwError('Could not inject Lightbox');
        (!album || !album.length) && throwError('Empty images album to open');
        if (!imageIndex || album.length <= imageIndex || imageIndex < 0) {
            imageIndex = 0;
        }
        this.getLightbox().open(album, imageIndex, options);
    }
    /**
     * Open the specified image.
     * @param image to show
     * @param options lightbox options
     */
    public openOneImageLightbox(image?: string, options?: {}): void {
        let album: IAlbum[];
        album = [{src: image, thumb: image}];
        this.openLightbox(album, 0, options);
    }
    /**
     * Open the specified images album at the specified image index
     * @param album images album
     * @param imageIndex to show
     * @param options lightbox options
     */
    public openImagesLightbox(...images: string[]): void {
        if (images && images.length) {
            let album: IAlbum[];
            album = [];
            Array.of(...images).forEach(image => {
                album.push({src: image, thumb: image});
            });
            this.openLightbox(album, 0);
        }
    }
    /**
     * Open the specified images album at the specified image index
     * @param images images album
     * @param imageIndex to show
     * @param options lightbox options
     */
    public openAlbumLightboxAt(images: string[], imageIndex?: number, options?: {}): void {
        if (images && images.length) {
            let album: IAlbum[];
            album = [];
            Array.of(...images).forEach(image => {
                album.push({src: image, thumb: image});
            });
            this.openLightbox(album, imageIndex, options);
        }
    }
    /**
     * Open the specified images album at the specified image index
     * @param images images album
     * @param image to show
     * @param options lightbox options
     */
    public openAlbumLightbox(images: string[], image?: string, options?: {}): void {
        if (images && images.length) {
            let album: IAlbum[];
            album = [];
            Array.of(...images).forEach(img => {
                album.push({src: img, thumb: img});
            });
            let imageIndex: number;
            imageIndex = Math.max(images.indexOf(image), 0);
            this.openLightbox(album, imageIndex, options);
        }
    }

    /**
     * Close lightbox
     */
    public closeLightbox(): void {
        !this.getLightbox() && throwError('Could not inject Lightbox');
        this.getLightbox().close();
    }

    /**
     * Log current actived element
     */
    protected debugActiveElement() {
        this.getLogger().debug('Current activated element', document.activeElement);
    }

    /**
     * Support for eval the specified context menu item.
     * @param item to eval
     * @param property item property to eval
     * @param defaultValue default value
     */
    protected evalContextMenuItem(
        item?: IContextMenu | null, property?: string | null, defaultValue?: any | null): any {
        return __evalContextMenuItem(item, property, item, defaultValue);
    }

    /**
     * Show confirmation dialog log
     * @param confirm confirmation configuration
     */
    protected showObserveConfirmation(confirm: ConfirmPopupConfig): Observable<boolean> {
        return this.getConfirmPopup().show(confirm);
    }
    /**
     * Show confirmation dialog log
     * @param confirm confirmation configuration
     * @param yesAction yes action
     * @param noAction no action
     */
    protected showActionConfirmation(confirm: ConfirmPopupConfig,
                               yesAction?: () => void, noAction?: () => void): void {
        const _this: AbstractComponent = this;
        this.showObserveConfirmation(confirm)
            .subscribe(value => {
                value && yesAction && yesAction.call(_this);
                !value && noAction && noAction.call(_this);
            });
    }

    /**
     * Perform deleting database
     */
    protected doDeleteDatabase(): void {
        const _this: AbstractComponent = this;
        let popupConfig: ConfirmPopupConfig;
        popupConfig = {
            title: this.translate('app'),
            content: this.translate('common.toast.confirm.delete_database.message'),
            color: 'warn',
            cancelButton: this.translate('common.toast.confirm.delete_database.cancel'),
            okButton: this.translate('common.toast.confirm.delete_database.ok'),
        };
        this.showActionConfirmation(popupConfig, _this.clearData);
    }
    private clearData(): void {
        const _this: AbstractComponent = this;
        const indexDbService: NgxIndexedDBService = _this.getService(NgxIndexedDBService);
        const localStorage: NgxLocalStorageEncryptionService =
            _this.getService(NgxLocalStorageEncryptionService);
        indexDbService || throwError('Could not inject NgxIndexedDBService instance');
        localStorage || throwError('Could not inject NgxLocalStorageEncryptionService instance');
        const timer: number = window.setTimeout(
            () => {
                _this.freeze();
                _this.__deleteDatabase(timer);
                _this.melt();
            }, 200);
    }
    private __deleteDatabase(timer: number): void {
        const _this: AbstractComponent = this;
        const logger: NGXLogger = this.getLogger();
        const indexDbDelRequest = window.indexedDB.deleteDatabase(AppConfig.Db.name);
        if (typeof indexDbDelRequest['close'] === 'function') {
            (<Function>indexDbDelRequest['close']).call(indexDbDelRequest);
        }
        indexDbDelRequest.onblocked = function(event) {
            logger && logger.warn('Could not delete database because database has been blocked!', event);
            !logger && window.console.warn(['Could not delete database because database has been blocked!', event]);
            window.clearTimeout(timer);
        };
        indexDbDelRequest.onupgradeneeded = function(event) {
            logger && logger.warn('Database needs to upgrade!', event);
            !logger && window.console.warn(['Database needs to upgrade!', event]);
            window.clearTimeout(timer);
        };
        indexDbDelRequest.onerror = function(event) {
            logger && logger.error('Could not delete database!', event);
            !logger && window.console.error(['Could not delete database!', event]);
            window.clearTimeout(timer);
        };
        indexDbDelRequest.onsuccess = function(event) {
            localStorage.clear();
            window.location.assign(_this.baseHref);
            window.location.reload();
            window.clearTimeout(timer);
        };
    }

    /**
     * Get the injection service instance
     * @param token to parse
     * @return the injection service instance
     */
    protected getService<K>(token: any): K {
        return AppUtils.getService(token);
    }

    /**
     * Get the injection root {ViewContainerRef} instance
     * @return the injection root {ViewContainerRef} instance
     */
    protected getRootViewConatinerRef(): ViewContainerRef {
        return AppUtils.getRootViewRef();
    }

    /**
     * Freeze component
     */
    protected freeze(): void {
        this.getChangeDetectorRef() && this.getChangeDetectorRef().detach();
    }

    /**
     * Melt component
     */
    protected melt(): void {
        this.getChangeDetectorRef() && this.getChangeDetectorRef().reattach();
    }
}
