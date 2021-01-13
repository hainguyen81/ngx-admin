import {DataSource} from '@app/types/index';
import {AbstractComponent, IEvent} from '../abstract.component';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef, EventEmitter,
    Inject, Input, Output,
    QueryList,
    Renderer2,
    Type,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/common/component.utils';
import {NbCardBackComponent, NbCardFrontComponent, NbFlipCardComponent} from '@nebular/theme';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';

/**
 * Abstract FlipCard component base on {NbFlipCardComponent}
 */
export abstract class AbstractFlipcardComponent<
    T extends DataSource,
    H extends AbstractComponent, F extends AbstractComponent, B extends AbstractComponent>
    extends AbstractComponent implements AfterViewInit {

    protected static FLIPCARD_ELEMENT_SELECTOR: string = 'nb-flip-card';
    protected static FLIPCARD_FRONT_ELEMENT_SELECTOR: string = 'nb-card-front';
    protected static FLIPCARD_BACK_ELEMENT_SELECTOR: string = 'nb-card-back';

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

    protected _flipHeaderComponent: H;
    protected _flipFrontComponent: F;
    protected _flipBackComponent: B;

    // raise when flipping
    @Output() protected onFlipped: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the flip header component type
     * @return the flip header component type
     */
    public get flipHeaderComponent(): H {
        return this._flipHeaderComponent;
    }

    /**
     * Get the flip header component type
     * @return the flip header component type
     */
    protected get flipHeaderComponentType(): Type<H> {
        return this._flipHeaderComponentType;
    }

    /**
     * Set the flip header component type
     * @param _flipHeaderComponentType the flip header component type
     */
    protected set flipHeaderComponentType(_flipHeaderComponentType: Type<H>) {
        this._flipHeaderComponentType = _flipHeaderComponentType;
    }

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
     * Get the flip header component type
     * @return the flip header component type
     */
    protected get flipFrontComponent(): F {
        return this._flipFrontComponent;
    }

    /**
     * Get the flip front component type
     * @return the flip front component type
     */
    protected get flipFrontComponentType(): Type<F> {
        return this._flipFrontComponentType;
    }

    /**
     * Set the flip front component type
     * @param _flipFrontComponentType the flip front component type
     */
    protected set flipFrontComponentType(_flipFrontComponentType: Type<F>) {
        this._flipFrontComponentType = _flipFrontComponentType;
    }

    /**
     * Get the {NbCardBackComponent} instance
     * @return the {NbCardBackComponent} instance
     */
    protected get flipcardBackComponent(): NbCardBackComponent {
        return this._flipcardBackComponent;
    }

    /**
     * Get the flip header component type
     * @return the flip header component type
     */
    protected get flipBackComponent(): B {
        return this._flipBackComponent;
    }

    /**
     * Get the flip back component type
     * @return the flip back component type
     */
    protected get flipBackComponentType(): Type<B> {
        return this._flipBackComponentType;
    }

    /**
     * Set the flip back component type
     * @param _flipBackComponentType the flip back component type
     */
    protected set flipBackComponentType(_flipBackComponentType: Type<B>) {
        this._flipBackComponentType = _flipBackComponentType;
    }

    /**
     * Get a boolean value indicating this component whether is flipped
     * @return true for flipped; else false
     */
    @Input() get flipped(): boolean {
        return (this._flipped || (this.flipcardComponent && this.flipcardComponent.flipped));
    }
    /**
     * Set a boolean value indicating this component whether is flipped
     * @param flipped true for flipped; else false
     */
    set flipped(_flipped: boolean) {
        if (this._flipped !== (_flipped || false)) {
            this._flipped = _flipped || false;
            if (this.flipcardComponent) {
                this.flipcardComponent.flipped = this._flipped;
            }
            this.onFlipped.emit({
                data: {
                    'front': this.flipcardFrontComponent,
                    'back': this.flipcardBackComponent,
                    'flipped': this._flipped,
                },
            });
        }
    }

    /**
     * Get a boolean value indicating this component whether shows the toggle button to flip
     * @return true for shown; else false
     */
    @Input() get showToggleButton(): boolean {
        return this._showToggleButton;
    }
    /**
     * Set a boolean value indicating this component whether shows the toggle button to flip
     * @param showToggleButton true for shown; else false
     */
    set showToggleButton(_showToggleButton: boolean) {
        this._showToggleButton = _showToggleButton || false;
        if (this.flipcardComponent) {
            this.flipcardComponent.showToggleButton = this._showToggleButton;
        }
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractFlipcardComponent} class
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
     * @param _flipcardFrontComponentType flip front component type
     * @param _flipcardBackComponentType flip back component type
     * @param _flipped specify the component whether had been flipped
     * @param _showToggleButton specify whether showing toggle button to flip
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
                          private _flipHeaderComponentType?: Type<H>,
                          private _flipFrontComponentType?: Type<F>,
                          private _flipBackComponentType?: Type<B>,
                          private _flipped?: boolean | false,
                          private _showToggleButton?: boolean | false) {
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

        if (!this._flipcardComponent) {
            this._flipcardComponent = ComponentUtils.queryComponent(this.queryFlipcardComponent);
        }
        if (!this._flipcardFrontComponent) {
            this._flipcardFrontComponent = ComponentUtils.queryComponent(this.queryFlipcardFrontComponent);
        }
        if (!this._flipcardBackComponent) {
            this._flipcardBackComponent = ComponentUtils.queryComponent(this.queryFlipcardBackComponent);
        }
    }
}
