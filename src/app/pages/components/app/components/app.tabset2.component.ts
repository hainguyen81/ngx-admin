import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    InjectionToken,
    OnDestroy,
    Renderer2,
    Type,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from '@app/types/index';
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
import {ITabConfig} from '../../tab/abstract.tab.component';
import {ACTION_DELETE, ACTION_DELETE_DATABASE, ACTION_IMPORT, ACTION_RESET, ACTION_SAVE, IToolbarActionsConfig} from '../../../../config/toolbar.actions.conf';
import {Subscription} from 'rxjs';
import ObjectUtils from '../../../../utils/common/object.utils';
import FunctionUtils from '../../../../utils/common/function.utils';
import PromiseUtils from '../../../../utils/common/promise.utils';
import ArrayUtils from '@app/utils/common/array.utils';
import {BaseTabset2Component} from '@app/pages/components/tabset/base.tab.component';
import {INgxTabConfig, NGXTAB_CONFIG_TOKEN} from '@app/pages/components/tabset/abstract.tab.component';

export const APP_TABSET_COMPONENT_TYPES_TOKEN: InjectionToken<Type<AbstractComponent>[]>
    = new InjectionToken<Type<AbstractComponent>[]>('Tab component type injection token');
export const APP_TABSET_TOOLBAR_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AppToolbarComponent<any>>>
    = new InjectionToken<Type<AppToolbarComponent<any>>>('Tab toolbar component type injection token');

@Component({
    selector: 'ngx-tabset-2-app',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../tabset/tab.component.html',
    styleUrls: ['../../tabset/tab.component.scss'],
})
export class AppTabset2Component<
    T extends IModel, D extends DataSource,
    TB extends AppToolbarComponent<D>,
    TC extends AbstractComponent>
    extends BaseTabset2Component<D>
    implements AfterViewInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private __toolbarComponent: TB;
    private __tabComponents: TC[];

    private __toolbarSubscription: Subscription;

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Get the special toolbar action identities that need to be visible
     */
    protected get visibleSpecialActions(): String[] {
        return [];
    }

    /**
     * Get the toolbar action identities that need to be visible
     */
    protected get visibleActions(): String[] {
        return [];
    }

    /**
     * Get all {INgxTabConfig}
     * @return all {INgxTabConfig}
     */
    protected get tabConfigs(): INgxTabConfig[] {
        return this._tabConfigs || [];
    }

    /**
     * Get all {INgxTabConfig}
     * @return all {INgxTabConfig}
     */
    protected getTabConfig(tabIndex: number): INgxTabConfig {
        return ArrayUtils.get<ITabConfig>(this.tabConfigs, tabIndex);
    }

    /**
     * Get the tab component
     * @param tabIndex to parse
     * @param tabComponentType to cast
     */
    protected getTabComponent<C extends AbstractComponent>(tabIndex: number, tabComponentType: Type<C>): C {
        const tabComponent: C = ArrayUtils.get<C>(this.tabComponents, tabIndex);
        return ObjectUtils.isNotNou(tabComponent) && tabComponent instanceof tabComponentType ? tabComponent : undefined;
    }

    /**
     * Get the tab component by tab identity
     * @param tabId to parse
     * @param tabComponentType to cast
     */
    protected getTabComponentById<C extends AbstractComponent>(tabId: string, tabComponentType: Type<C>): C {
        if (!(tabId || '').length) return undefined;
        const tabConfig: ITabConfig = ArrayUtils.first<ITabConfig>(
            (this.tabConfigs || []).filter(cfg => (cfg && cfg.tabId === tabId)));
        const tabCompRef: C = ObjectUtils.as<C>(ObjectUtils.get(tabConfig, 'componentRef'));
        return ObjectUtils.isNotNou(tabCompRef) && tabCompRef instanceof tabComponentType ? tabCompRef : undefined;
    }

    /**
     * Get the {AppToolbarComponent} instance
     * @return the {AppToolbarComponent} instance
     */
    protected get toolbarComponent(): TB {
        return this.__toolbarComponent;
    }

    /**
     * Get the {AppToolbarComponent} instance
     * @return the {AppToolbarComponent} instance
     */
    protected get tabComponents(): TC[] {
        return this.__tabComponents;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppTabset2Component} class
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
     * @param _tabConfigs {INgxTabConfig}
     * @param _toolbarComponentType toolbar component type
     * @param _tabComponentTypes tab component types
     */
    constructor(@Inject(DataSource) dataSource: D,
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
                @Inject(NGXTAB_CONFIG_TOKEN) private _tabConfigs?: INgxTabConfig[] | null,
                @Inject(APP_TABSET_TOOLBAR_COMPONENT_TYPE_TOKEN) private _toolbarComponentType?: Type<TB> | null,
                @Inject(APP_TABSET_COMPONENT_TYPES_TOKEN) private _tabComponentTypes?: Type<TC>[] | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        this.numberOfTabs = ArrayUtils.lengthOf(this._tabComponentTypes);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // create tab components
        this.createTabComponents();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__toolbarSubscription);
    }

    /**
     * Raise when toolbar action item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {IToolbarActionsConfig}
     */
    onClickAction(event: IEvent) {
        if (!event || !event.data || !(event.data as IToolbarActionsConfig)) {
            return;
        }
        const action: IToolbarActionsConfig = event.data as IToolbarActionsConfig;
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
        const _this: AppTabset2Component<T, D, TB, TC> = this;

        // create toolbar component
        if (this._toolbarComponentType) {
            this.__toolbarComponent = super.setToolbarComponent(this._toolbarComponentType);
            this.__toolbarComponent.showActions = true;
            FunctionUtils.invokeTrue(
                ObjectUtils.isNou(_this.__toolbarSubscription),
                () => this.__toolbarSubscription = this.toolbarComponent.actionListener()
                    .subscribe((e: IEvent) => _this.onClickAction(e)),
                _this);
            this.doToolbarActionsSettings();
        }

        // create tab components
        if (ArrayUtils.isNotEmptyArray(this.tabContentHolderViewContainerComponents)) {
            this.__tabComponents = [];
            for (let tabIndex: number = 0; tabIndex < (this._tabComponentTypes || []).length; tabIndex++) {
                const __tabComponent: TC = <TC>this.setTabComponent(tabIndex, this._tabComponentTypes[tabIndex]);
                if (ObjectUtils.isNotNou(__tabComponent)) {
                    __tabComponent && this.__tabComponents.push(__tabComponent);
                    const tabConfig: ITabConfig = this.getTabConfig(tabIndex);
                    ObjectUtils.set(tabConfig, 'componentRef', __tabComponent);
                    this.configTabByIndex(tabIndex, tabConfig);
                }
            }
        }

        // TODO call detect changes to avoid ExpressionChangedAfterItHasBeenCheckedError exception
        // TODO after updating toolbar action settings
        this.detectChanges();
    }

    /**
     * Perform saving data
     * TODO Children classes should override this method for saving data
     */
    protected doSave(): void {
        throw new Error('Children classes should override this method for saving data');
    }

    /**
     * Perform resetting data
     * TODO Children classes should override this method for resetting data
     */
    protected doReset(): void {
        throw new Error('Children classes should override this method for resetting data');
    }

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
     * TODO Children classes should override this method for deleting data
     */
    protected performDelete(): void {
        throw new Error('Children classes should override this method for deleting data');
    }

    /**
     * Apply toolbar actions settings while flipping
     */
    protected doToolbarActionsSettings() {
        if (ObjectUtils.isNou(this.toolbarComponent)) return;

        this.toolbarComponent.showActions = true;
        const actions: IToolbarActionsConfig[] = this.toolbarComponent.getActions();
        (actions || []).forEach(action => {
            switch (action.id) {
                // special actions, then default not visible
                case ACTION_DELETE_DATABASE:
                case ACTION_IMPORT: {
                    action.visible = this.visibleSpecialActions.contains(action.id);
                    break;
                }
                default: {
                    action.visible = this.visibleActions.contains(action.id);
                    break;
                }
            }
        });
    }
}
