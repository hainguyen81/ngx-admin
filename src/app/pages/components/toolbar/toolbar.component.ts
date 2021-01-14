import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, QueryList, Renderer2, ViewChildren, ViewContainerRef,} from '@angular/core';
import {DataSource} from '@app/types/index';
import {AbstractToolbarComponent} from './abstract.toolbar.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {NbButtonComponent} from '@nebular/theme';
import ComponentUtils from 'app/utils/common/component.utils';

/**
 * Toolbar component base on {MatToolbar}
 */
@Component({
    selector: 'ngx-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class NgxToolbarComponent extends AbstractToolbarComponent<DataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(MatToolbar)
    private readonly queryToolbarComponent: QueryList<MatToolbar>;
    private __toolbarComponent: MatToolbar;
    @ViewChildren(NbButtonComponent)
    private readonly queryToolbarActionsComponent: QueryList<NbButtonComponent>;
    private __toolbarActionComponents: NbButtonComponent[];

    private _showActions: boolean = true;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {MatToolbar} component
     * @return the {MatToolbar} component
     */
    protected get toolbarComponent(): MatToolbar {
        return this.__toolbarComponent;
    }

    /**
     * Get the toolbar action components array
     * @return the toolbar action components array
     */
    protected get toolbarActionComponents(): NbButtonComponent[] {
        return this.__toolbarActionComponents;
    }

    /**
     * Set a boolean value indicating the actions should be shown
     * @param show true for showing; else false
     */
    set showActions(_showActions: boolean) {
        this._showActions = _showActions;
    }

    /**
     * Get a boolean value indicating the actions should be shown
     * @return true for showing; else false
     */
    get showActions(): boolean {
        return this._showActions;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NgxToolbarComponent} class
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
     */
    constructor(@Inject(DataSource) dataSource: DataSource,
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.__toolbarComponent) {
            this.__toolbarComponent = ComponentUtils.queryComponent(this.queryToolbarComponent);
        }
        if (!this.__toolbarActionComponents || !this.__toolbarActionComponents.length) {
            this.__toolbarActionComponents = ComponentUtils.queryComponents(this.queryToolbarActionsComponent);
        }
    }
}
