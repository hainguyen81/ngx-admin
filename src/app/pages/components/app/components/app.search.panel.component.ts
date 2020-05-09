import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2, Type,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AppPanelComponent} from './app.panel.component';
import {AbstractComponent, IEvent} from '../../abstract.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {IModel} from '../../../../@core/data/base';
import {AbstractFormlyComponent} from '../../formly/abstract.formly.component';
import {AbstractToolbarComponent} from '../../toolbar/abstract.toolbar.component';
import {
    ACTION_SEARCH,
    IToolbarActionsConfig,
} from '../../../../config/toolbar.actions.conf';
import {isNullOrUndefined} from 'util';

@Component({
    selector: 'ngx-search-panel-app',
    templateUrl: '../../panel/panel.component.html',
    styleUrls: ['../../panel/panel.component.scss'],
})
export abstract class AppSearchPanelComponent<T extends IModel, D extends DataSource,
    SF extends AbstractFormlyComponent<T, D>,
    STB extends AbstractToolbarComponent<D>>
    extends AppPanelComponent<T, D, AbstractComponent, SF, STB>
    implements AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the toolbar action identities that need to be visible on search panel
     */
    protected visibleSearchActions(): String[] {
        return [];
    }

    /**
     * Get the footer toolbar instance
     * @return the footer toolbar instance
     */
    protected get toolbar(): STB {
        return this.footer as STB;
    }

    /**
     * Get the body search form instance
     * @return the body search form instance
     */
    protected get searchForm(): SF {
        return this.body as SF;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppSearchPanelComponent} class
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
     * @param _searchFormComponentType the body component type
     * @param _searchToolbarComponentType the footer component type
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
                          _searchFormComponentType?: Type<SF> | null,
                          _searchToolbarComponentType?: Type<STB> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            null, _searchFormComponentType, _searchToolbarComponentType);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.__listenToolbarActions();
        this.getChangeDetectorRef().detectChanges();
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
            case ACTION_SEARCH:
                // TODO Waiting for saving
                this.doSearch();
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
     * Register toolbar actions listeners
     */
    private __listenToolbarActions(): void {
        const _this: AppSearchPanelComponent<T, D, SF, STB> = this;
        this.toolbar
        && this.toolbar.actionListener()
            .subscribe($event => _this.onClickAction($event));
        this.doToolbarActionsSettingsOnStartup();
    }

    /**
     * Perform searching data
     */
    protected doSearch(): void {
        if (!this.searchForm.submit()) {
            this.showError('app', 'common.form.invalid_data');
            return;
        }
        this.getLogger().debug('Perform search action!');
    }

    /**
     * Apply toolbar actions settings while flipping
     */
    protected doToolbarActionsSettingsOnStartup() {
        if (isNullOrUndefined(this.toolbar)) return;

        const actions: IToolbarActionsConfig[] = this.toolbar.getActions();
        (actions || []).forEach(action => {
            action.visible = this.visibleSearchActions().contains(action.id);
        });
    }
}
