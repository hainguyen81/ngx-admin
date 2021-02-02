import {DataSource} from '@app/types/index';
import {AbstractComponent, IEvent} from '../abstract.component';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, InjectionToken, Renderer2, ViewContainerRef} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import ObjectUtils from '@app/utils/common/object.utils';
import ArrayUtils from '@app/utils/common/array.utils';
import {TabComponent, TabsetComponent} from '~/ngx-tabset';

/* {TabComponent} tab configuration */
export interface INgxTabConfig {
    /**
     * Tab title
     * @type {string}
     */
    tabTitle: string;
    /**
     * Tab sub title
     * @type {string}
     */
    tabSubTitle?: string | null;
    /**
     * Tab activated
     * @type {boolean}
     */
    active?: boolean | false;
    /**
     * Item is disabled and cannot be opened.
     * @type {boolean}
     */
    disabled?: boolean | false;
    /**
     * Option to allow the tab to trigger lifecycle events to the wrapped content, e.g. for wrapped components.
     * You need to surround tab content with <ng-template>...</ng-template> in order to make it work.
     * Please check the above example for full implementation
     * @type {boolean}
     */
    bypassDOM?: boolean | true;
    /**
     * All the additionnal classes you want to add to the tabset header / nav.
     * You can add several classes by giving a string with space-separated classnames
     */
    customPaneClass?: string | null;
    /**
     * Custom configuration
     */
    [property: string]: any | null;
}
export const NGXTAB_CONFIG_TOKEN: InjectionToken<INgxTabConfig[]> =
    new InjectionToken<INgxTabConfig[]>('Tab configuration injection token');

/**
 * Abstract ngxTabset component base on {NgxTabset} and {NbTabComponent}
 */
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
export abstract class AbstractTabComponent<T extends DataSource> extends AbstractComponent {

    protected static TABSET_ELEMENT_SELECTOR: string = 'ngx-tabset';
    protected static TAB_ELEMENTS_SELECTOR: string = 'ngx-tab';

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {TabsetComponent} instance
     * @return the {TabsetComponent} instance
     */
    protected abstract get tabsetComponent(): TabsetComponent;

    /**
     * Get the {TabComponent} instances array
     * @return the {TabComponent} instances array
     */
    protected abstract get tabsComponent(): TabComponent[];

    /**
     * Get the number of nb-tab
     * @return the number of nb-tab
     */
    public get numberOfTabs(): number {
        return this._numberOfTabs;
    }

    /**
     * Set the number of nb-tab
     * @param _numberOfTabs the number of nb-tab
     */
    public set numberOfTabs(_numberOfTabs: number) {
        this._numberOfTabs = _numberOfTabs;
    }

    /**
     * Get a boolean value indicating this component whether disables/enables the built-in style. It allows you to style the entire tab yourself
     * @return true/false
     */
    public get disableStyle(): boolean {
        return this._disableStyle;
    }

    /**
     * Set a boolean value indicating this component whether disables/enables the built-in style. It allows you to style the entire tab yourself
     * @param _disableStyle disables/enables the built-in style
     */
    public set disableStyle(_disableStyle: boolean) {
        this._disableStyle = _disableStyle || false;
        if (this.tabsetComponent) {
            this.tabsetComponent.disableStyle = this._disableStyle;
        }
    }

    /**
     * Get a boolean value indicating this component whether using custom navigator class
     * @return custom navigator class
     */
    public get customNavClass(): string {
        return this._customNavClass;
    }

    /**
     * Set a boolean value indicating this component whether using custom navigator class
     * @param _customNavClass custom navigator class
     */
    public set customNavClass(_customNavClass: string) {
        this._customNavClass = _customNavClass || null;
    }

    /**
     * Get a value indicating this component whether using custom tabs class.
     * @return custom tabs class
     */
    public get customTabsClass(): string {
        return this._customTabsClass;
    }

    /**
     * Set a value indicating this component whether using custom tabs class.
     * @param _customTabsClass custom tabs class
     */
    public set customTabsClass(_customTabsClass: string) {
        this._customTabsClass = _customTabsClass || null;
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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     * @param _numberOfTabs the number of tabs
     * @param _disableStyle Disables/enables the built-in style. It allows you to style the entire tab yourself
     * @param _customNavClass custom navigator class
     * @param _customTabsClass custom tabs class
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
                          @Inject(Router) router?: Router,
                          @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                          private _numberOfTabs?: number | 1,
                          private _disableStyle?: boolean | false,
                          private _customNavClass?: string | null,
                          private _customTabsClass?: string | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

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
    protected configTab(tab: TabComponent, config: INgxTabConfig): void {
        if (!tab || !config) {
            return;
        }

        if (ObjectUtils.isEmpty(config['__tabTitle'])) {
            config['__tabTitle'] = config.tabTitle;
        }
        if (ObjectUtils.isEmpty(config['__tabSubTitle'])) {
            config['__tabSubTitle'] = config.tabSubTitle;
        }
        tab.tabTitle = this.translate(config.tabTitle);
        tab.tabSubTitle = this.translate(config.tabSubTitle);
        tab.disabled = config.disabled;
        tab.active = config.active;
        ObjectUtils.set(tab, 'config', config);
    }

    /**
     * Configure the specified tab index
     * @param tabIndex to config
     * @param config to apply
     */
    protected configTabByIndex(tabIndex: number, config: INgxTabConfig): void {
        this.configTab(ArrayUtils.get<TabComponent>(this.tabsComponent, tabIndex), config);
    }

    /**
     * Translate the specified {TabComponent}
     * @param tab to translate
     */
    private translateTab(tab?: TabComponent): void {
        if (!tab) {
            return;
        }

        const tabCfg: INgxTabConfig = ObjectUtils.as<INgxTabConfig>(ObjectUtils.get(tab, 'config'));
        if (tabCfg && ObjectUtils.isEmpty(tabCfg['__tabTitle'])) {
            tabCfg['__tabTitle'] = tabCfg.tabTitle;
        }
        if (tabCfg && ObjectUtils.isEmpty(tabCfg['__tabSubTitle'])) {
            tabCfg['__tabSubTitle'] = tabCfg.tabSubTitle;
        }
        tab.tabTitle = this.translate(
            tabCfg && (tabCfg['__tabTitle'] || '').length ? tabCfg['__tabTitle'] : tab.tabTitle);
        tab.tabSubTitle = this.translate(
            tabCfg && (tabCfg['__tabSubTitle'] || '').length ? tabCfg['__tabSubTitle'] : tab.tabSubTitle);
    }
}
