import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, InjectionToken,
    Renderer2,
    Type,
    ViewContainerRef,
} from '@angular/core';
import {IModel} from '../../../../@core/data/base';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent} from '../../abstract.component';
import {BasePanelComponent} from '../../panel/base.panel.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';

export const APP_PANEL_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AbstractComponent>>
    = new InjectionToken<Type<AbstractComponent>>('Panel header/body/footer component type injection token');

/**
 * Panel component base on {NbCardComponent}
 */
@Component({
    selector: 'ngx-card-panel-app',
    templateUrl: '../../panel/panel.component.html',
    styleUrls: ['../../panel/panel.component.scss'],
})
export class AppPanelComponent<
    T extends IModel, D extends DataSource,
    H extends AbstractComponent,
    B extends AbstractComponent,
    F extends AbstractComponent>
    extends BasePanelComponent<D>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _headerComponent: H;
    private _bodyComponent: B;
    private _footerComponent: F;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the header instance
     * @return the header instance
     */
    protected get header(): H {
        return this._headerComponent;
    }

    /**
     * Get the body instance
     * @return the body instance
     */
    protected get body(): B {
        return this._bodyComponent;
    }

    /**
     * Get the footer instance
     * @return the footer instance
     */
    protected get footer(): F {
        return this._footerComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppPanelComponent} class
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
     * @param _headerComponentType the header component type
     * @param _bodyComponentType the body component type
     * @param _footerComponentType the footer component type
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
                @Inject(APP_PANEL_COMPONENT_TYPE_TOKEN) private _headerComponentType?: Type<H> | null,
                @Inject(APP_PANEL_COMPONENT_TYPE_TOKEN) private _bodyComponentType?: Type<B> | null,
                @Inject(APP_PANEL_COMPONENT_TYPE_TOKEN) private _footerComponentType?: Type<F> | null) {
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

        // create components
        this.createComponents();
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Create components
     */
    private createComponents(): void {
        // create header component
        if (this._headerComponentType) {
            this._headerComponent = this.setHeaderComponent(this._headerComponentType);
        }

        // create body component
        if (this._bodyComponentType) {
            this._bodyComponent = this.setBodyComponent(this._bodyComponentType);
        }

        // create footer component
        if (this._footerComponentType) {
            this._footerComponent = this.setFooterComponent(this._footerComponentType);
        }
    }
}
