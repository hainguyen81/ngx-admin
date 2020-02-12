import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    Inject,
    OnInit,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent, IEvent,} from '../abstract.component';
import {ToasterService} from 'angular2-toaster';
import ComponentUtils from '../../../utils/component.utils';
import {MatToolbar} from '@angular/material/toolbar';
import {NbComponentSize} from '@nebular/theme/components/component-size';
import {NbComponentStatus} from '@nebular/theme/components/component-status';
import {NbComponentShape} from '@nebular/theme/components/component-shape';
import {NbButtonComponent} from '@nebular/theme';

export const ACTION_SAVE: string = 'ACTION_SAVE';
export const ACTION_RESET: string = 'ACTION_RESET';
export const ACTION_DELETE: string = 'ACTION_DELETE';

/* toolbar actions configuration */
export declare type ToolbarActionType = 'button' | 'submit' | 'reset';

export interface IToolbarActionsConfig {
    id: string;
    label: string;
    icon?: { icon: string, pack?: string | 'fa' } | null;
    class?: string | null;
    description?: string | null;
    type?: ToolbarActionType | 'button';
    /**
     * Perform action when clicking on action
     * @param e {IEvent} that contains {$event} as action event
     * and {$data} as {IToolbarActionsConfig}
     */
    click?: (e: IEvent) => any | null;

    /**
     * Button size, available sizes:
     * `tiny`, `small`, `medium`, `large`, `giant`
     */
    size?: NbComponentSize | 'medium';
    /**
     * Button status (adds specific styles):
     * `basic`, `primary`, `info`, `success`, `warning`, `danger`, `control`.
     */
    status?: NbComponentStatus | 'basic';
    /**
     * Button shapes: `rectangle`, `round`, `semi-round`
     */
    shape?: NbComponentShape | 'rectangle';
    /**
     * Sets `filled` appearance
     */
    filled?: boolean | false;
    /**
     * Sets `outline` appearance
     */
    outline?: boolean | false;
    /**
     * Sets `ghost` appearance
     */
    ghost?: boolean | false;
    /**
     * Sets `hero` appearance
     */
    hero?: boolean | true;
    /**
     * If set element will fill its container
     */
    fullWidth?: boolean | true;
    /**
     * Disables the button
     */
    disabled?: boolean | false;
}

/**
 * Abstract toolbar component base on {MatToolbar}
 */
export abstract class AbstractToolbar<T extends DataSource>
    extends AbstractComponent implements AfterViewInit, OnInit {

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

    private toolbarHeader: string;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Set the toolbar header
     * @param header to apply
     */
    protected setToolbarHeader(header: string) {
        this.toolbarHeader = header;
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
     * @param toasterService {ToasterService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param actions {IToolbarActionsConfig}
     */
    protected constructor(@Inject(DataSource) dataSource: T,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(ToasterService) toasterService: ToasterService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                          private actions?: IToolbarActionsConfig[]) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef);
        this.setActions(actions);
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
     * Raise when tree-view item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {IToolbarActionsConfig}
     */
    onClickAction(event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClickAction', event);
    }
}
