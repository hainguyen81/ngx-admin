import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {
    AfterViewInit,
    ChangeDetectorRef, Component,
    ComponentFactoryResolver, ElementRef,
    Inject, Renderer2, Type,
    ViewContainerRef,
} from '@angular/core';
import {BaseSplitPaneComponent} from '../../splitpane/base.splitpane.component';
import {ConfirmPopup} from 'ngx-material-popup';
import {IModel} from '../../../../@core/data/base';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {TranslateService} from '@ngx-translate/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {throwError} from 'rxjs';
import {AbstractComponent, IEvent} from '../../abstract.component';
import {ISplitAreaConfig} from '../../splitpane/abstract.splitpane.component';
import {isNullOrUndefined} from 'util';
import {
    ACTION_DELETE,
    ACTION_DELETE_DATABASE, ACTION_IMPORT,
    ACTION_RESET,
    ACTION_SAVE,
    IToolbarActionsConfig,
} from '../../../../config/toolbar.actions.conf';
import {AppToolbarComponent} from './app.toolbar.component';

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

/**
 * Base split-pane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane-app',
    templateUrl: '../../splitpane/splitpane.component.html',
    styleUrls: ['../../splitpane/splitpane.component.scss'],
})
export abstract class AppSplitPaneComponent<
    T extends IModel, D extends DataSource,
    TB extends AppToolbarComponent<D>,
    L extends AbstractComponent,
    R extends AbstractComponent>
    extends BaseSplitPaneComponent<D>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private toolbarComponent: TB;
    private leftSideComponent: L;
    protected rightSideComponent: R;

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
    protected getToolbarComponent(): TB {
        return this.toolbarComponent;
    }

    /**
     * Get the left side {AbstractComponent} instance
     * @return the left side {AbstractComponent} instance
     */
    protected getLeftSideComponent(): L {
        return this.leftSideComponent;
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
                          private toolBarType?: Type<TB> | null,
                          private leftSideType?: Type<L> | null,
                          private rightRightType?: Type<R> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        confirmPopup || throwError('Could not inject ConfirmPopup');
        leftSideType || throwError('The left side component type is required');
        rightRightType || throwError('The right right component type is required');
        super.setHorizontal(true);
        super.setNumberOfAreas(2);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // Create left/right component panes
        this.createPaneComponents();
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
        this.configAreaByIndex(0, LeftTreeAreaConfig);
        this.configAreaByIndex(1, RightFormAreaConfig);

        // create toolbar component
        if (this.toolBarType) {
            this.toolbarComponent = super.setToolbarComponent(this.toolBarType);
            this.toolbarComponent.showActions = true;
            this.toolbarComponent.actionListener().subscribe((e: IEvent) => this.onClickAction(e));
            this.doToolbarActionsSettings();
            // TODO call detect changes to avoid ExpressionChangedAfterItHasBeenCheckedError exception
            // TODO after updating toolbar action settings
            super.getChangeDetectorRef().detectChanges();
        }

        // create left side component
        this.leftSideComponent = super.setAreaComponent(0, this.leftSideType);
        if (this.shouldAttachRightSideOnStartup()) {
            this.rightSideComponent = super.setAreaComponent(1, this.rightRightType);
        }
    }

    /**
     * Create the right side component if it has ever created yet
     * @return true if valid; else false
     */
    protected createRightSideComponent(): boolean {
        if (!this.rightSideComponent) {
            this.rightSideComponent = super.setAreaComponent(1, this.rightRightType);
        }
        return !isNullOrUndefined(this.rightSideComponent);
    }

    // -------------------------------------------------
    // MAIN FUNCTION
    // -------------------------------------------------

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
