import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Inject,
    Output,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent, IEvent} from '../abstract.component';
import ComponentUtils from '../../../utils/common/component.utils';
import {MatToolbar} from '@angular/material/toolbar';
import {NbButtonComponent} from '@nebular/theme';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IToolbarActionsConfig, IToolbarHeaderConfig} from '../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';

/**
 * Abstract toolbar component base on {MatToolbar}
 */
export abstract class AbstractToolbarComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    protected static TOOLBAR_ELEMENT_SELECTOR: string = 'mat-toolbar';
    protected static TOOLBAR_ACTION_ITEM_ELEMENT_SELECTOR: string = 'nbButton';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(MatToolbar)
    private readonly queryToolbarComponent: QueryList<MatToolbar>;
    private toolbarComponent: MatToolbar;
    @ViewChildren(NbButtonComponent)
    private readonly queryToolbarActionsComponent: QueryList<NbButtonComponent>;
    private toolbarActionComponents: NbButtonComponent[];

    private toolbarHeader?: IToolbarHeaderConfig | null;
    @Output() private actionClick = new EventEmitter<IEvent>();

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the toolbar header
     * @return the toolbar header
     */
    public getToolbarHeader(): IToolbarHeaderConfig {
        return this.toolbarHeader;
    }

    /**
     * Set the toolbar header
     * @param header to apply
     */
    public setToolbarHeader(header: IToolbarHeaderConfig) {
        this.toolbarHeader = header;
    }

    /**
     * Get the {EventEmitter} event listener when clicking an action
     * @return the {EventEmitter} event listener
     */
    public actionListener(): EventEmitter<IEvent> {
        return this.actionClick;
    }

    /**
     * Get the {IToolbarActionsConfig} actions array
     * @return the {IToolbarActionsConfig} actions array
     */
    protected getVisibleActions(): IToolbarActionsConfig[] {
        return (this.actions || []).filter(action => action.visible);
    }

    /**
     * Get the {IToolbarActionsConfig} actions array
     * @return the {IToolbarActionsConfig} actions array
     */
    public getActions(): IToolbarActionsConfig[] {
        return this.actions || [];
    }

    /**
     * Set the {IToolbarActionsConfig} actions array
     * @param actions to apply
     */
    protected setActions(actions?: IToolbarActionsConfig[]) {
        this.actions = actions;
    }

    /**
     * Get the {MatToolbar} component
     * @return the {MatToolbar} component
     */
    protected getToolbarComponent(): MatToolbar {
        return this.toolbarComponent;
    }

    /**
     * Get the toolbar action components array
     * @return the toolbar action components array
     */
    protected getToolbarActionComponents(): NbButtonComponent[] {
        return this.toolbarActionComponents || [];
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractToolbar} class
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
     * @param header {IToolbarHeaderConfig}
     * @param actions {IToolbarActionsConfig}
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     * @param header {IToolbarHeaderConfig}
     * @param actions {IToolbarActionsConfig}
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
                          private header?: IToolbarHeaderConfig,
                          private actions?: IToolbarActionsConfig[]) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.toolbarComponent) {
            this.toolbarComponent = ComponentUtils.queryComponent(this.queryToolbarComponent);
        }
        if (!this.toolbarActionComponents || !this.toolbarActionComponents.length) {
            this.toolbarActionComponents = ComponentUtils.queryComponents(this.queryToolbarActionsComponent);
        }
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Raise when action item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {IToolbarActionsConfig}
     */
    onClickAction(event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClickAction', event);
        let fired: boolean;
        fired = false;
        if (event && event.data) {
            let action: IToolbarActionsConfig;
            action = event.data as IToolbarActionsConfig;
            if (action && typeof action.click === 'function') {
                action.click.apply(this, [event]);
                fired = true;
            }
        }
        // via event
        if (!fired) this.actionListener().emit(event);
    }
}
