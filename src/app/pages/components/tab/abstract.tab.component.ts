import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent, IEvent} from '../abstract.component';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/component.utils';
import {NbTabComponent, NbTabsetComponent} from '@nebular/theme';
import {ToastrService} from 'ngx-toastr';
import {NbIconConfig} from '@nebular/theme/components/icon/icon.component';
import {NbComponentStatus} from '@nebular/theme/components/component-status';
import {NbBadgePosition} from '@nebular/theme/components/badge/badge.component';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';

/* {NbTabComponent} tab configuration */
export interface ITabConfig {
    /**
     * Tab title
     * @type {string}
     */
    tabTitle: string;
    /**
     * Tab id
     * @type {string}
     */
    tabId: string;
    /**
     * Tab icon name or icon config object
     * @type {string | NbIconConfig}
     */
    tabIcon: string | NbIconConfig;
    /**
     * Item is disabled and cannot be opened.
     * @type {boolean}
     */
    disabled: boolean;
    /**
     * Show only icons when width is smaller than `tabs-icon-only-max-width`
     * @type {boolean}
     */
    responsive: boolean;
    route: string;
    activeValue: boolean;
    responsiveValue: boolean;
    disabledValue: boolean;
    /**
     * Specifies active tab
     * @returns {boolean}
     */
    active: boolean;
    /**
     * Lazy load content before tab selection
     * TODO: rename, as lazy is by default, and this is more `instant load`
     * @param {boolean} val
     */
    lazyLoad: boolean;
    /**
     * Badge text to display
     * @type string
     */
    badgeText: string;
    /**
     * Badge status (adds specific styles):
     * 'primary', 'info', 'success', 'warning', 'danger'
     * @param {string} val
     */
    badgeStatus: NbComponentStatus;
    /**
     * Badge position.
     * Can be set to any class or to one of predefined positions:
     * 'top left', 'top right', 'bottom left', 'bottom right',
     * 'top start', 'top end', 'bottom start', 'bottom end'
     * @type string
     */
    badgePosition: NbBadgePosition;
}

/**
 * Abstract FlipCard component base on {NbTabsetComponent} and {NbTabComponent}
 */
export abstract class AbstractTabComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    protected static TABSET_ELEMENT_SELECTOR: string = 'nb-tabset';
    protected static TAB_ELEMENTS_SELECTOR: string = 'nb-tab';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NbTabsetComponent)
    private readonly queryTabsetComponent: QueryList<NbTabsetComponent>;
    private tabsetComponent: NbTabsetComponent;

    @ViewChildren(NbTabComponent)
    private readonly queryTabsComponent: QueryList<NbTabComponent>;
    private tabsComponent: NbTabComponent[];

    @ViewChildren('tabComponent', {read: ViewContainerRef})
    private readonly queryTabComponentViewContainerRefs: QueryList<ViewContainerRef>;
    private tabComponentViewContainerRefs: ViewContainerRef[];

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NbTabsetComponent} instance
     * @return the {NbTabsetComponent} instance
     */
    protected getTabsetComponent(): NbTabsetComponent {
        return this.tabsetComponent;
    }

    /**
     * Get the {NbTabComponent} instances array
     * @return the {NbTabComponent} instances array
     */
    protected getTabsComponent(): NbTabComponent[] {
        return this.tabsComponent;
    }

    /**
     * Get the number of nb-tab
     * @return the number of nb-tab
     */
    public getNumberOfTabs(): number {
        return this.numberOfTabs;
    }

    /**
     * Set the number of nb-tab
     * @param numberOfTabs the number of nb-tab
     */
    protected setNumberOfTabs(numberOfTabs: number): void {
        this.numberOfTabs = numberOfTabs;
    }

    /**
     * Get a boolean value indicating this component whether takes full width of value
     * @return true/false
     */
    public isFullWidthValue(): boolean {
        return this.fullWidthValue;
    }

    /**
     * Set a boolean value indicating this component whether takes full width of value
     * @param fullWidthValue take full width of value
     */
    public setFullWidthValue(fullWidthValue?: boolean | false): void {
        this.fullWidthValue = fullWidthValue || false;
        if (this.getTabsetComponent()) {
            this.getTabsetComponent().fullWidthValue = this.fullWidthValue;
        }
    }

    /**
     * Get a boolean value indicating this component whether takes full width of a parent
     * @return true/false
     */
    public isFullWidth(): boolean {
        return this.fullWidth;
    }

    /**
     * Set a boolean value indicating this component whether takes full width of a parent
     * @param fullWidth take full width of a parent
     */
    public setFullWidth(fullWidth?: boolean | false): void {
        this.fullWidth = fullWidth || false;
        if (this.getTabsetComponent()) {
            this.getTabsetComponent().fullWidth = this.fullWidth;
        }
    }

    /**
     * Get a value indicating this component whether listens to this parameter and selects corresponding tab.
     * @return route parameters
     */
    public getRouteParam(): string {
        return this.routeParam;
    }

    /**
     * Set a value indicating this component whether listens to this parameter and selects corresponding tab.
     * @param routeParam if specified - tabset listens to this parameter and selects corresponding tab.
     */
    public setRouteParam(routeParam?: string | null): void {
        this.routeParam = routeParam || null;
        if (this.getTabsetComponent()) {
            this.getTabsetComponent().routeParam = this.routeParam;
        }
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractFlipcardComponent} class
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
     * @param fullWidthValue take full width of value
     * @param fullWidth take full width of a parent
     * @param routeParam if specified - tabset listens to this parameter and selects corresponding tab.
     */
    protected constructor(@Inject(DataSource) dataSource: T,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(ToastrService) toasterService: ToastrService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                          @Inject(ElementRef) elementRef: ElementRef,
                          @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                          @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                          @Inject(Lightbox) lightbox?: Lightbox,
                          private numberOfTabs?: number | 1,
                          private fullWidthValue?: boolean | false,
                          private fullWidth?: boolean | true,
                          private routeParam?: string | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.tabsetComponent) {
            this.tabsetComponent = ComponentUtils.queryComponent(this.queryTabsetComponent);
        }
        if (!this.tabComponentViewContainerRefs || !this.tabComponentViewContainerRefs.length) {
            this.tabComponentViewContainerRefs = ComponentUtils.queryComponents(
                this.queryTabComponentViewContainerRefs);
        }
        if (!this.tabsComponent || !this.tabsComponent.length) {
            this.tabsComponent = ComponentUtils.queryComponents(this.queryTabsComponent);
            if ((!this.tabsComponent || !this.tabsComponent.length) && this.tabsetComponent) {
                this.tabsComponent = ComponentUtils.queryComponents(this.tabsetComponent.tabs);
            }
        }
    }

    /**
     * Triggered `languageChange` event
     * @param event {IEvent} that contains {$event} as LangChangeEvent
     */
    onLangChange(event: IEvent): void {
        super.onLangChange(event);

        if (this.tabsComponent && this.tabsComponent.length) {
            this.tabsComponent.forEach(tab => this.translateTab(tab));
        }
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Configure the specified tab
     * @param tab to config
     * @param config to apply
     */
    protected configTab(tab: NbTabComponent, config: ITabConfig): void {
        if (!tab || !config) {
            return;
        }

        tab.tabTitle = config.tabTitle;
        tab.tabId = config.tabId;
        tab.tabIcon = config.tabIcon;
        tab.disabled = config.disabled;
        tab.responsive = config.responsive;
        tab.route = config.route;
        tab.activeValue = config.activeValue;
        tab.responsiveValue = config.responsiveValue;
        tab.disabledValue = config.disabledValue;
        tab.active = config.active;
        tab.lazyLoad = config.lazyLoad;
        tab.badgeText = config.badgeText;
        tab.badgeStatus = config.badgeStatus;
        tab.badgePosition = config.badgePosition;
        tab['config'] = config;
    }

    /**
     * Translate the specified {NbTabComponent}
     * @param tab to translate
     */
    private translateTab(tab?: NbTabComponent): void {
        if (!tab) {
            return;
        }

        let tabCfg: ITabConfig;
        tabCfg = tab['config'];
        tab.tabTitle = this.translate(
            tabCfg && (tabCfg.tabTitle || '').length ? tabCfg.tabTitle : tab.tabTitle);
        tab.badgeText = this.translate(
            tabCfg && (tabCfg.badgeText || '').length ? tabCfg.badgeText : tab.badgeText);
    }
}
