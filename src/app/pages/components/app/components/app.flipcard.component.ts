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
    OnInit,
    Renderer2,
    Type,
    ViewContainerRef,
} from '@angular/core';
import {ConfirmPopup, ConfirmPopupConfig} from 'ngx-material-popup';
import {ContextMenuService} from 'ngx-contextmenu';
import {BaseFlipcardComponent} from '../../flipcard/base.flipcard.component';
import {Lightbox} from 'ngx-lightbox';
import {AbstractComponent, IEvent} from '../../abstract.component';
import {TranslateService} from '@ngx-translate/core';
import {DataSource} from '@app/types/index';
import {Subscription, throwError} from 'rxjs';
import {
    ACTION_BACK,
    ACTION_DELETE,
    ACTION_DELETE_DATABASE,
    ACTION_IMPORT,
    ACTION_RESET,
    ACTION_SAVE,
    ACTION_SERVICE_WORKER,
    IToolbarActionsConfig,
} from '../../../../config/toolbar.actions.conf';
import {AppToolbarComponent} from './app.toolbar.component';
import {ActivatedRoute, Router} from '@angular/router';
import ObjectUtils from '../../../../utils/common/object.utils';
import FunctionUtils from '../../../../utils/common/function.utils';
import PromiseUtils from '../../../../utils/common/promise.utils';

export const APP_FLIPCARD_TOOLBAR_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AppToolbarComponent<any>>>
    = new InjectionToken<Type<AppToolbarComponent<any>>>('The toolbar component type injection token of the flip-pane');
export const APP_FLIPCARD_FRONT_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AbstractComponent>>
    = new InjectionToken<Type<AbstractComponent>>('The front component type injection token of the flip-pane');
export const APP_FLIPCARD_BACK_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AbstractComponent>>
    = new InjectionToken<Type<AbstractComponent>>('The front component type injection token of the flip-pane');

/**
 * Application flip-card component base on {NbFlipCardComponent}
 * @deprecated Currently NbFlipCardComponent component has problem with dynamic component. Insted of using flip-component
 */
@Component({
    selector: 'ngx-flip-card-app',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../flipcard/flipcard.component.html',
    styleUrls: ['../../flipcard/flipcard.component.scss', './app.flipcard.component.scss'],
})
export class AppFlipcardComponent<D extends DataSource,
    TB extends AppToolbarComponent<D>,
    F extends AbstractComponent,
    B extends AbstractComponent>
    extends BaseFlipcardComponent<D>
    implements AfterViewInit, OnInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _toolbarComponent: TB;
    private _frontComponent: F;
    private _backComponent: B;

    private __flipSubscription: Subscription;
    private __toolbarSubscription: Subscription;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the special toolbar action identities that need to be visible on front
     */
    protected get visibleSpecialActionsOnFront(): String[] {
        return [];
    }

    /**
     * Get the special toolbar action identities that need to be visible on front
     */
    protected get visibleSpecialActionsOnBack(): String[] {
        return [];
    }

    /**
     * Get the toolbar action identities that need to be visible on front
     */
    protected get visibleActionsOnFront(): String[] {
        return [];
    }

    /**
     * Get the toolbar action identities that need to be visible on back
     */
    protected get visibleActionsOnBack(): String[] {
        return [];
    }

    /**
     * Get a boolean value indicating whether showing panel header
     * @return true (default) for showing; else false
     */
    get isShowHeader(): boolean {
        return true;
    }

    /**
     * Get a boolean value indicating whether creating back-component at start-up
     * @return true (default) for creating; else false
     */
    protected get fulfillComponentsAtStartup(): boolean {
        return true;
    }

    /**
     * Get the toolbar {AppToolbarComponent} instance
     * @return the toolbar {AppToolbarComponent} instance
     */
    protected get toolbarComponent(): TB {
        return this._toolbarComponent;
    }

    /**
     * Get the front-flip {AbstractComponent} instance
     * @return the front-flip {AbstractComponent} instance
     */
    protected get frontComponent(): F {
        return this._frontComponent;
    }

    /**
     * Get the back-flip {AbstractComponent} instance
     * @return the back-flip {AbstractComponent} instance
     */
    protected get backComponent(): B {
        return this._backComponent;
    }

    /**
     * Get a boolean value indicating data that has been changed to shown confirmation dialog while back flip
     * TODO Children classes should override this method
     * @return true for changed; else false
     */
    protected get isDataChanged(): boolean {
        return false;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFlipcardComponent} class
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
     * @param toolbarComponentType toolbar component type
     * @param frontComponentType front side component type
     * @param backComponentType back side component type
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
                @Inject(APP_FLIPCARD_TOOLBAR_COMPONENT_TYPE_TOKEN) private toolbarComponentType?: Type<TB> | null,
                @Inject(APP_FLIPCARD_FRONT_COMPONENT_TYPE_TOKEN) private frontComponentType?: Type<F> | null,
                @Inject(APP_FLIPCARD_BACK_COMPONENT_TYPE_TOKEN) private backComponentType?: Type<B> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        frontComponentType || throwError('The front-flip component type is required');
        backComponentType || throwError('The back-flip component type is required');
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        // listener flipping event
        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__flipSubscription),
            () => this.__flipSubscription = this.onFlipped.subscribe(() => this.doToolbarActionsSettingsOnFlipped()),
            this);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // Create flip components
        this.createFlipComponents();

        // toolbar actions settings on start-up
        this.doToolbarActionsSettingsOnFlipped();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__flipSubscription);
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
        let action: IToolbarActionsConfig;
        action = event.data as IToolbarActionsConfig;
        switch (action.id) {
            case ACTION_SAVE:
                // TODO Waiting for saving
                this.doSave();
                break;
            case ACTION_RESET:
                // TODO Waiting for resetting
                this.doReset();
                break;
            case ACTION_DELETE:
                // TODO Waiting for deleting
                this.doDelete();
                break;
            case ACTION_BACK:
                if (this.isDataChanged) {
                    const popupConfig: ConfirmPopupConfig = {
                        title: this.translate('app'),
                        content: this.translate('common.toast.confirm.lose_data.message'),
                        color: 'warn',
                        cancelButton: this.translate('common.toast.confirm.lose_data.cancel'),
                        okButton: this.translate('common.toast.confirm.lose_data.ok'),
                    };
                    const confirmSubscription: Subscription = this.getConfirmPopup().show(popupConfig)
                    .subscribe(value => {
                        if (value) {
                            this.doBack();
                            this.flipped = false;
                        }
                        PromiseUtils.unsubscribe(confirmSubscription);
                    });

                } else {
                    this.doBack();
                    this.flipped = false;
                }
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
        this.getLogger().debug('Flip-form-toolbar wanna perform action', $event);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Create flip view components
     */
    private createFlipComponents(): void {
        // create table component
        const _this: AppFlipcardComponent<D, TB, F, B> = this;
        this._toolbarComponent = super.setToolbarComponent(this.toolbarComponentType);
        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__toolbarSubscription) && ObjectUtils.isNotNou(this._toolbarComponent),
            () => this.__toolbarSubscription = this._toolbarComponent.actionListener().subscribe(($event: IEvent) => _this.onClickAction($event)),
            this);
        this._frontComponent = super.setFrontComponent(this.frontComponentType);
        this.fulfillComponentsAtStartup && this.ensureBackComponent();
    }

    /**
     * Ensure back-component whether has been created
     */
    protected ensureBackComponent(): void {
        if (!this._backComponent) {
            this._backComponent = super.setBackComponent(this.backComponentType);
        }
    }

    /**
     * Perform saving data
     */
    protected doSave(): void {
        this.getLogger().debug('Perform save action!');
    }

    /**
     * Perform resetting data
     */
    protected doReset(): void {
        this.getLogger().debug('Perform reset action!');
    }

    /**
     * Perform deleting data
     */
    protected doDelete(): void {
        this.getLogger().debug('Perform delete action!');
    }

    /**
     * Perform going back data
     */
    protected doBack(): void {
        this.getLogger().debug('Perform going back action!');
    }

    /**
     * Apply toolbar actions settings while flipping
     */
    protected doToolbarActionsSettingsOnFlipped() {
        if (ObjectUtils.isNou(this.toolbarComponent)) return;

        this.toolbarComponent.showActions = true;
        const actions: IToolbarActionsConfig[] = this.toolbarComponent.getActions();
        (actions || []).forEach(action => {
            switch (action.id) {
                // special actions, then default not visible
                case ACTION_DELETE_DATABASE:
                case ACTION_IMPORT:
                case ACTION_SERVICE_WORKER: {
                    action.visible = (!this.flipped
                        && this.visibleSpecialActionsOnFront.contains(action.id));
                    break;
                }
                default: {
                    if (this.flipped) {
                        action.visible = this.visibleActionsOnBack.contains(action.id)
                            || this.visibleSpecialActionsOnBack.contains(action.id);
                    } else {
                        action.visible = this.visibleActionsOnFront.contains(action.id)
                            || this.visibleActionsOnFront.contains(action.id);
                    }
                    break;
                }
            }
        });
    }
}
