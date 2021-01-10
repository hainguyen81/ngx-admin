import {DataSource} from '@app/types/index';
import {AbstractComponent} from '../abstract.component';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/common/component.utils';
import {
    NbCardBodyComponent,
    NbCardComponent,
    NbCardFooterComponent, NbCardHeaderComponent,
} from '@nebular/theme';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';

/**
 * Abstract card component base on {NbCardComponent}
 */
export abstract class AbstractPanelComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    protected static CARD_ELEMENT_SELECTOR: string = 'nb-card';
    protected static CARD_BODY_ELEMENT_SELECTOR: string = 'nb-card-body';
    protected static CARD_FOOTER_ELEMENT_SELECTOR: string = 'nb-card-footer';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NbCardComponent)
    private readonly queryCardComponent: QueryList<NbCardComponent>;
    private _cardComponent: NbCardComponent;

    @ViewChildren(NbCardHeaderComponent)
    private readonly queryCardHeaderComponent: QueryList<NbCardHeaderComponent>;
    private _cardHeaderComponent: NbCardHeaderComponent;

    @ViewChildren(NbCardBodyComponent)
    private readonly queryCardBodyComponent: QueryList<NbCardBodyComponent>;
    private _cardBodyComponent: NbCardBodyComponent;

    @ViewChildren(NbCardFooterComponent)
    private readonly queryCardFooterComponent: QueryList<NbCardFooterComponent>;
    private _cardFooterComponent: NbCardFooterComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NbCardComponent} instance
     * @return the {NbCardComponent} instance
     */
    protected get cardComponent(): NbCardComponent {
        return this._cardComponent;
    }

    /**
     * Get the {NbCardHeaderComponent} instance
     * @return the {NbCardHeaderComponent} instance
     */
    protected get cardHeaderComponent(): NbCardHeaderComponent {
        return this._cardHeaderComponent;
    }

    /**
     * Get the {NbCardBodyComponent} instance
     * @return the {NbCardBodyComponent} instance
     */
    protected get cardBodyComponent(): NbCardBodyComponent {
        return this._cardBodyComponent;
    }

    /**
     * Get the {NbCardFooterComponent} instance
     * @return the {NbCardFooterComponent} instance
     */
    protected get cardFooterComponent(): NbCardFooterComponent {
        return this._cardFooterComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractPanelComponent} class
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

        if (!this._cardComponent) {
            this._cardComponent = ComponentUtils.queryComponent(this.queryCardComponent);
        }
        if (!this._cardHeaderComponent) {
            this._cardHeaderComponent = ComponentUtils.queryComponent(this.queryCardHeaderComponent);
        }
        if (!this._cardBodyComponent) {
            this._cardBodyComponent = ComponentUtils.queryComponent(this.queryCardBodyComponent);
        }
        if (!this._cardFooterComponent) {
            this._cardFooterComponent = ComponentUtils.queryComponent(this.queryCardFooterComponent);
        }
    }
}
