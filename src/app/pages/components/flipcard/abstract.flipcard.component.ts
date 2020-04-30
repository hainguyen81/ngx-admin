import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent, IEvent} from '../abstract.component';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef, EventEmitter,
    Inject, Output,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/component.utils';
import {NbCardBackComponent, NbCardFrontComponent, NbFlipCardComponent} from '@nebular/theme';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';

/**
 * Abstract FlipCard component base on {NbFlipCardComponent}
 */
export abstract class AbstractFlipcardComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    protected static FLIPCARD_ELEMENT_SELECTOR: string = 'nb-flip-card';
    protected static FLIPCARD_FRONT_ELEMENT_SELECTOR: string = 'nb-card-front';
    protected static FLIPCARD_BACK_ELEMENT_SELECTOR: string = 'nb-card-back';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NbFlipCardComponent)
    private readonly queryFlipcardComponent: QueryList<NbFlipCardComponent>;
    private flipcardComponent: NbFlipCardComponent;

    @ViewChildren(NbCardFrontComponent)
    private readonly queryFlipcardFrontComponent: QueryList<NbCardFrontComponent>;
    private flipcardFrontComponent: NbCardFrontComponent;

    @ViewChildren(NbCardBackComponent)
    private readonly queryFlipcardBackComponent: QueryList<NbCardBackComponent>;
    private flipcardBackComponent: NbCardBackComponent;

    // raise when flipping
    @Output() protected onFlipped: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NbFlipCardComponent} instance
     * @return the {NbFlipCardComponent} instance
     */
    protected getFlipcardComponent(): NbFlipCardComponent {
        return this.flipcardComponent;
    }

    /**
     * Get the {NbCardFrontComponent} instance
     * @return the {NbCardFrontComponent} instance
     */
    protected getFlipcardFrontComponent(): NbCardFrontComponent {
        return this.flipcardFrontComponent;
    }

    /**
     * Get the {NbCardBackComponent} instance
     * @return the {NbCardBackComponent} instance
     */
    protected getFlipcardBackComponent(): NbCardBackComponent {
        return this.flipcardBackComponent;
    }

    /**
     * Set a boolean value indicating this component whether is flipped
     * @param flipped true for flipped; else false
     */
    public setFlipped(flipped?: boolean): void {
        if (this.flipped !== (flipped || false)) {
            this.flipped = flipped || false;
            if (this.getFlipcardComponent()) {
                this.getFlipcardComponent().flipped = this.flipped;
            }
            this.onFlipped.emit({
                data: {
                    'front': this.getFlipcardFrontComponent(),
                    'back': this.getFlipcardBackComponent(),
                    'flipped': flipped,
                },
            });
        }
    }

    /**
     * Get a boolean value indicating this component whether is flipped
     * @param flipped true for flipped; else false
     */
    public isFlipped(): boolean {
        return (this.flipped || (this.getFlipcardComponent() && this.getFlipcardComponent().flipped));
    }

    /**
     * Set a boolean value indicating this component whether shows the toggle button to flip
     * @param showToggleButton true for shown; else false
     */
    public setShowToggleButton(showToggleButton?: boolean): void {
        this.showToggleButton = showToggleButton || false;
        if (this.getFlipcardComponent()) {
            this.getFlipcardComponent().showToggleButton = this.showToggleButton;
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
     * @param flipped specify the component whether had been flipped
     * @param showToggleButton specify whether showing toggle button to flip
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
                          private flipped?: boolean | false,
                          private showToggleButton?: boolean | false) {
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

        if (!this.flipcardComponent) {
            this.flipcardComponent = ComponentUtils.queryComponent(this.queryFlipcardComponent);
        }
        if (!this.flipcardFrontComponent) {
            this.flipcardFrontComponent = ComponentUtils.queryComponent(this.queryFlipcardFrontComponent);
        }
        if (!this.flipcardBackComponent) {
            this.flipcardBackComponent = ComponentUtils.queryComponent(this.queryFlipcardBackComponent);
        }
    }
}
