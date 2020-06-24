import {BaseTabsetComponent} from '../../tab/base.tab.component';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    Renderer2, Type,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {IModel} from '../../../../@core/data/base';
import {AppToolbarComponent} from './app.toolbar.component';
import {AbstractComponent, IEvent} from '../../abstract.component';
import {ITabConfig, TAB_CONFIG_TOKEN} from '../../tab/abstract.tab.component';
import {
    ACTION_DELETE,
    ACTION_DELETE_DATABASE, ACTION_IMPORT,
    ACTION_RESET,
    ACTION_SAVE,
    IToolbarActionsConfig,
} from '../../../../config/toolbar.actions.conf';
import {isNullOrUndefined} from 'util';

@Component({
    selector: 'ngx-tabset-app',
    templateUrl: '../../tab/tab.component.html',
    styleUrls: ['../../tab/tab.component.scss'],
})
export abstract class AppTabsetComponent<
    T extends IModel, D extends DataSource,
    TB extends AppToolbarComponent<D>,
    TC extends AbstractComponent>
    extends BaseTabsetComponent<D>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private toolbarComponent: TB;
    private tabComponents: AbstractComponent[];

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Get the special toolbar action identities that need to be visible
     */
    protected visibleSpecialActions(): String[] {
        return [];
    }

    /**
     * Get the toolbar action identities that need to be visible
     */
    protected visibleActions(): String[] {
        return [];
    }

    /**
     * Get all {ITabConfig}
     * @return all {ITabConfig}
     */
    protected get tabConfigs(): ITabConfig[] {
        return this._tabConfigs || [];
    }

    /**
     * Get all {ITabConfig}
     * @return all {ITabConfig}
     */
    protected getTabConfig(tabIndex: number): ITabConfig {
        return ((this.tabConfigs || []).length
            && 0 <= tabIndex && tabIndex < this.tabConfigs.length
            ? this.tabConfigs[tabIndex] : undefined);
    }

    /**
     * Get the tab component
     * @param tabIndex to parse
     * @param tabComponentType to cast
     */
    protected getTabComponent<C extends AbstractComponent>(tabIndex: number, tabComponentType: Type<C>): C {
        return ((this.tabComponents || []).length
        && 0 <= tabIndex && tabIndex < this.tabComponents.length
        && (this.tabComponents[tabIndex] instanceof tabComponentType)
            ? <C>this.tabComponents[tabIndex] : undefined);
    }

    /**
     * Get the tab component by tab identity
     * @param tabId to parse
     * @param tabComponentType to cast
     */
    protected getTabComponentById<C extends AbstractComponent>(tabId: string, tabComponentType: Type<C>): C {
        if (!(tabId || '').length) return undefined;
        const tabConfig: ITabConfig[] = (this.tabConfigs || []).filter(cfg => {
            return (cfg && cfg.tabId === tabId);
        });
        return ((tabConfig || []).length && tabConfig[0]['componentRef'] instanceof tabComponentType
            ? <C>tabConfig[0]['componentRef'] : undefined);
    }

    /**
     * Get the {AppToolbarComponent} instance
     * @return the {AppToolbarComponent} instance
     */
    protected getToolbarComponent(): TB {
        return this.toolbarComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemTabsetComponent} class
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
     * @param _tabConfigs {ITabConfig}
     * @param _toolbarComponentType toolbar component type
     * @param _tabComponentTypes tab component types
     */
    protected constructor(@Inject(DataSource) dataSource: D,
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
                          @Inject(TAB_CONFIG_TOKEN) private _tabConfigs?: ITabConfig[] | null,
                          private _toolbarComponentType?: Type<TB> | null,
                          private _tabComponentTypes?: Type<TC>[] | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        super.setNumberOfTabs((_tabComponentTypes || []).length);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // create tab components
        this.createTabComponents();
    }

    /**
     * Raise when toolbar action item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {IToolbarActionsConfig}
     */
    onClickAction(event: IEvent) {
        if (!event || !event.data || !(event.data as IToolbarActionsConfig)) {
            return;
        }
        let action: IToolbarActionsConfig;
        action = event.data as IToolbarActionsConfig;
        switch (action.id) {
            case ACTION_SAVE:
                this.doSave();
                break;
            case ACTION_RESET:
                this.doReset();
                break;
            case ACTION_DELETE:
                this.doDelete();
                break;
            case ACTION_DELETE_DATABASE:
                this.doDeleteDatabase();
                break;
            default:
                this.onToolbarAction(event);
                break;
        }
    }

    /**
     * Raise when toolbar action item has been clicked
     * @param $event event data {IEvent}
     */
    protected onToolbarAction($event: IEvent) {
        this.getLogger().debug('Tabset-toolbar wanna perform action', $event);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Create tab components
     */
    private createTabComponents(): void {
        const _this: AppTabsetComponent<T, D, TB, TC> = this;
        // create toolbar component
        if (this._toolbarComponentType) {
            this.toolbarComponent = super.setToolbarComponent(this._toolbarComponentType);
            this.toolbarComponent.showActions = true;
            this.toolbarComponent.actionListener().subscribe((e: IEvent) => _this.onClickAction(e));
            this.doToolbarActionsSettings();
            // TODO call detect changes to avoid ExpressionChangedAfterItHasBeenCheckedError exception
            // TODO after updating toolbar action settings
            this.detectChanges();
        }

        this.tabComponents = [];
        for (let tabIndex: number = 0; tabIndex < (this._tabComponentTypes || []).length; tabIndex++) {
            const tabComponent: AbstractComponent =
                this.setTabComponent(tabIndex, this._tabComponentTypes[tabIndex]);
            this.tabComponents.push(tabComponent);
            const tabConfig: ITabConfig = this.getTabConfig(tabIndex);
            tabConfig['componentRef'] = tabComponent;
            this.configTabByIndex(tabIndex, tabConfig);
        }
    }

    /**
     * Perform saving data
     */
    protected abstract doSave(): void;

    /**
     * Perform resetting data
     */
    protected abstract doReset(): void;

    /**
     * Perform deleting data
     */
    protected doDelete(): void {
        this.getConfirmPopup().show({
            cancelButton: this.translate('common.toast.confirm.delete.cancel'),
            color: 'warn',
            content: this.translate('common.toast.confirm.delete.message'),
            okButton: this.translate('common.toast.confirm.delete.ok'),
            title: (!this.toolbarComponent ? this.translate('app')
                : this.translate(this.toolbarComponent.getToolbarHeader().title)),
        }).toPromise().then(value => {
            value && this.performDelete();
        });
    }

    /**
     * Perform deleting data after YES on confirmation dialog
     */
    protected abstract performDelete(): void;

    /**
     * Apply toolbar actions settings while flipping
     */
    protected doToolbarActionsSettings() {
        if (isNullOrUndefined(this.getToolbarComponent())) return;

        this.getToolbarComponent().showActions = true;
        const actions: IToolbarActionsConfig[] = this.getToolbarComponent().getActions();
        (actions || []).forEach(action => {
            switch (action.id) {
                // special actions, then default not visible
                case ACTION_DELETE_DATABASE:
                case ACTION_IMPORT: {
                    action.visible = this.visibleSpecialActions().contains(action.id);
                    break;
                }
                default: {
                    action.visible = this.visibleActions().contains(action.id);
                    break;
                }
            }
        });
    }
}
