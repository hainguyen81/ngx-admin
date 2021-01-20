import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
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
import {BaseSplitPaneComponent} from '../../splitpane/base.splitpane.component';
import {ConfirmPopup} from 'ngx-material-popup';
import {IModel} from '../../../../@core/data/base';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {TranslateService} from '@ngx-translate/core';
import {DataSource} from '@app/types/index';
import {Subscription, throwError} from 'rxjs';
import {AbstractComponent, IEvent} from '../../abstract.component';
import {ISplitAreaConfig} from '../../splitpane/abstract.splitpane.component';
import {ACTION_DELETE, ACTION_DELETE_DATABASE, ACTION_IMPORT, ACTION_RESET, ACTION_SAVE, IToolbarActionsConfig} from '../../../../config/toolbar.actions.conf';
import {AppToolbarComponent} from './app.toolbar.component';
import {ActivatedRoute, Router} from '@angular/router';
import ObjectUtils from '../../../../utils/common/object.utils';
import FunctionUtils from 'app/utils/common/function.utils';
import PromiseUtils from 'app/utils/common/promise.utils';

/* Default left area configuration */
export const LeftTreeAreaConfig: ISplitAreaConfig = {
    size: 30,
    minSize: 20,
    maxSize: 30,
    lockSize: false,
    visible: true,
};

/* Default right area configuration */
export const RightFormAreaConfig: ISplitAreaConfig = {
    size: 70,
    minSize: 70,
    maxSize: 80,
    lockSize: false,
    visible: true,
};

export const APP_SPLIT_TOOLBAR_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AppToolbarComponent<any>>>
    = new InjectionToken<Type<AppToolbarComponent<any>>>(
        'The toolbar component type injection token of the split-pane');
export const APP_SPLIT_SIDE_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AbstractComponent>>
    = new InjectionToken<Type<AbstractComponent>>(
        'The left/right side component type injection token of the split-pane');

/**
 * Base split-pane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane-app',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../splitpane/splitpane.component.html',
    styleUrls: [
        '../../splitpane/splitpane.component.scss',
        './app.splitpane.component.scss',
    ],
})
export class AppSplitPaneComponent<
    T extends IModel, D extends DataSource,
    TB extends AppToolbarComponent<D>,
    L extends AbstractComponent,
    R extends AbstractComponent>
    extends BaseSplitPaneComponent<D>
    implements AfterViewInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private __toolbarActionSubscription: Subscription;

    private __toolbarComponent: TB;
    private __leftSideComponent: L;
    private __rightSideComponent: R;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating the right side component should be created at start-up
     * @return true for should be created; else false
     */
    protected shouldAttachRightSideOnStartup(): boolean {
        return false;
    }

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
     * Get the {AppToolbarComponent} instance
     * @return the {AppToolbarComponent} instance
     */
    protected get toolbarComponent(): TB {
        return this.__toolbarComponent;
    }

    /**
     * Get the left side {AbstractComponent} instance
     * @return the left side {AbstractComponent} instance
     */
    protected get leftSideComponent(): L {
        return this.__leftSideComponent;
    }

    /**
     * Get the right side {AbstractComponent} instance
     * @return the right side {AbstractComponent} instance
     */
    protected get rightSideComponent(): R {
        return this.__rightSideComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppSplitPaneComponent} class
     * @param dataSource {Datasource}
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
     * @param toolBarType toolbar component type
     * @param leftSideType left side component type
     * @param rightRightType right side component type
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
                @Inject(APP_SPLIT_TOOLBAR_COMPONENT_TYPE_TOKEN) private toolBarType?: Type<TB> | null,
                @Inject(APP_SPLIT_SIDE_COMPONENT_TYPE_TOKEN) private leftSideType?: Type<L> | null,
                @Inject(APP_SPLIT_SIDE_COMPONENT_TYPE_TOKEN) private rightRightType?: Type<R> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        confirmPopup || throwError('Could not inject ConfirmPopup');
        leftSideType || throwError('The left side component type is required');
        rightRightType || throwError('The right right component type is required');
        this.setHorizontal(true);
        this.setNumberOfAreas(2);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // Create left/right component panes
        this.createPaneComponents();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__toolbarActionSubscription);
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
        this.getLogger().debug('Split-pane-toolbar wanna perform action', $event);
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Create left/right component panes
     */
    private createPaneComponents() {
        // configure areas
        const _this: AppSplitPaneComponent<T, D, TB, L, R> = this;
        this.configAreaByIndex(0, LeftTreeAreaConfig);
        this.configAreaByIndex(1, RightFormAreaConfig);

        // create toolbar component
        if (this.toolBarType) {
            this.__toolbarComponent = super.setToolbarComponent(this.toolBarType);
            this.__toolbarComponent.showActions = true;
            FunctionUtils.invoke(
                ObjectUtils.isNou(this.__toolbarActionSubscription),
                () => this.__toolbarActionSubscription = this.__toolbarComponent.actionListener()
                    .subscribe((e: IEvent) => _this.onClickAction(e)),
                undefined, this);
            this.doToolbarActionsSettings();
        }

        // create left side component
        this.__leftSideComponent = this.setAreaComponent(0, this.leftSideType);
        this.__leftSideComponent && this.__leftSideComponent.getDataSource().refresh();
        if (this.shouldAttachRightSideOnStartup()) {
            this.__rightSideComponent = super.setAreaComponent(1, this.rightRightType);
        }

        // TODO call detect changes to avoid ExpressionChangedAfterItHasBeenCheckedError exception
        // TODO after updating toolbar action settings
        this.detectChanges();
    }

    /**
     * Create the right side component if it has ever created yet
     * @return true if valid; else false
     */
    protected createRightSideComponent(): boolean {
        if (!this.__rightSideComponent) {
            this.__rightSideComponent = super.setAreaComponent(1, this.rightRightType);
        }
        return ObjectUtils.isNotNou(this.__rightSideComponent);
    }

    // -------------------------------------------------
    // MAIN FUNCTION
    // -------------------------------------------------

    /**
     * Perform saving data
     * TODO Children classes should override this method for saving data
     */
    protected doSave(): void {
        throwError('Children classes should override this method for saving data');
    }

    /**
     * Perform resetting data
     * TODO Children classes should override this method for resetting data
     */
    protected doReset(): void {
        throwError('Children classes should override this method for resetting data');
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
        throwError('Children classes should override this method for deleting data');
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
