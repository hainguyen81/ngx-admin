import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from '@app/types/index';
import {AbstractFlipcardComponent} from './abstract.flipcard.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/common/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {NbCardBackComponent, NbCardFrontComponent, NbFlipCardComponent} from '@nebular/theme';

/**
 * Flip-card base on {NbFlipCardComponent}
 * @deprecated Currently NbFlipCardComponent component has problem with dynamic component. Insted of using flip-component
 */
@Component({
    selector: 'ngx-flip-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './flipcard.component.html',
    styleUrls: ['./flipcard.component.scss'],
})
export class NgxFlipCardComponent extends AbstractFlipcardComponent<DataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NbFlipCardComponent)
    private readonly queryFlipcardComponent: QueryList<NbFlipCardComponent>;
    private _flipcardComponent: NbFlipCardComponent;

    @ViewChildren(NbCardFrontComponent)
    private readonly queryFlipcardFrontComponent: QueryList<NbCardFrontComponent>;
    private _flipcardFrontComponent: NbCardFrontComponent;

    @ViewChildren(NbCardBackComponent)
    private readonly queryFlipcardBackComponent: QueryList<NbCardBackComponent>;
    private _flipcardBackComponent: NbCardBackComponent;

    @ViewChildren('cardFrontComponent', {read: ViewContainerRef})
    private readonly queryCardFrontComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private _cardFrontComponentHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('frontComponent', {read: ViewContainerRef})
    private readonly queryFrontComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private _frontComponentHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('cardBackComponent', {read: ViewContainerRef})
    private readonly queryCardBackComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private _cardBackComponentHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('backComponent', {read: ViewContainerRef})
    private readonly queryBackComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private _backComponentHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('headerHolder', {read: ViewContainerRef})
    private readonly queryHeaderViewContainerRef: QueryList<ViewContainerRef>;
    private _headerViewContainerRef: ViewContainerRef;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NbFlipCardComponent} instance
     * @return the {NbFlipCardComponent} instance
     */
    protected get flipcardComponent(): NbFlipCardComponent {
        return this._flipcardComponent;
    }

    /**
     * Get the {NbCardFrontComponent} instance
     * @return the {NbCardFrontComponent} instance
     */
    protected get flipcardFrontComponent(): NbCardFrontComponent {
        return this._flipcardFrontComponent;
    }

    /**
     * Get the {NbCardBackComponent} instance
     * @return the {NbCardBackComponent} instance
     */
    protected get flipcardBackComponent(): NbCardBackComponent {
        return this._flipcardBackComponent;
    }

    /**
     * Get a boolean value indicating whether showing panel header
     * @return true (default) for showing; else false
     */
    get isShowHeader(): boolean {
        return false;
    }

    /**
     * Get the {ViewContainerRef} instance of header panel
     * @return the {ViewContainerRef} instance of header panel
     */
    protected get headerViewContainerComponent(): ViewContainerRef {
        return this._headerViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the front component
     * @return the {ViewContainerRef} instance of the front component
     */
    protected get cardFrontComponentViewContainerRef(): ViewContainerRef {
        return this._cardFrontComponentHolderViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the front component
     * @return the {ViewContainerRef} instance of the front component
     */
    protected get frontComponentViewContainerRef(): ViewContainerRef {
        return this._frontComponentHolderViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the back component
     * @return the {ViewContainerRef} instance of the back component
     */
    protected get cardBackComponentViewContainerRef(): ViewContainerRef {
        return this._cardBackComponentHolderViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the back component
     * @return the {ViewContainerRef} instance of the back component
     */
    protected get backComponentViewContainerRef(): ViewContainerRef {
        return this._backComponentHolderViewContainerRef;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NgxFlipCardComponent} class
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
            router, activatedRoute,
            false, false);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this._flipcardComponent) {
            this._flipcardComponent = ComponentUtils.queryComponent(this.queryFlipcardComponent);
        }
        if (!this._flipcardFrontComponent) {
            this._flipcardFrontComponent = ComponentUtils.queryComponent(this.queryFlipcardFrontComponent);
        }
        if (!this._flipcardBackComponent) {
            this._flipcardBackComponent = ComponentUtils.queryComponent(this.queryFlipcardBackComponent);
        }
        if (!this._headerViewContainerRef) {
            this._headerViewContainerRef = ComponentUtils.queryComponent(this.queryHeaderViewContainerRef);
        }
        if (!this._cardFrontComponentHolderViewContainerRef) {
            this._cardFrontComponentHolderViewContainerRef = ComponentUtils.queryComponent(this.queryCardFrontComponentHolderViewContainerRef);
        }
        if (!this._cardBackComponentHolderViewContainerRef) {
            this._cardBackComponentHolderViewContainerRef = ComponentUtils.queryComponent(this.queryCardBackComponentHolderViewContainerRef);
        }
        if (!this._frontComponentHolderViewContainerRef) {
            this._frontComponentHolderViewContainerRef = ComponentUtils.queryComponent(this.queryFrontComponentHolderViewContainerRef);
        }
        if (!this._backComponentHolderViewContainerRef) {
            this._backComponentHolderViewContainerRef = ComponentUtils.queryComponent(this.queryBackComponentHolderViewContainerRef);
        }
    }
}
