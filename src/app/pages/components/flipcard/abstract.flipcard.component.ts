import {DataSource} from '@app/types/index';
import {AbstractComponent, IEvent} from '../abstract.component';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    Output,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {NbCardBackComponent, NbCardFrontComponent, NbFlipCardComponent} from '@nebular/theme';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';

/**
 * Abstract FlipCard component base on {NbFlipCardComponent}
 * @deprecated Currently NbFlipCardComponent component has problem with dynamic component. Insted of using flip-component
 */
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
export abstract class AbstractFlipcardComponent<T extends DataSource> extends AbstractComponent {

    protected static FLIPCARD_ELEMENT_SELECTOR: string = 'nb-flip-card';
    protected static FLIPCARD_FRONT_ELEMENT_SELECTOR: string = 'nb-card-front';
    protected static FLIPCARD_BACK_ELEMENT_SELECTOR: string = 'nb-card-back';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    // raise when flipping
    @Output() protected onFlipped: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NbFlipCardComponent} instance
     * @return the {NbFlipCardComponent} instance
     */
    protected abstract get flipcardComponent(): NbFlipCardComponent;

    /**
     * Get the {NbCardFrontComponent} instance
     * @return the {NbCardFrontComponent} instance
     */
    protected abstract get flipcardFrontComponent(): NbCardFrontComponent;

    /**
     * Get the {NbCardBackComponent} instance
     * @return the {NbCardBackComponent} instance
     */
    protected abstract get flipcardBackComponent(): NbCardBackComponent;

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
                          private _flipped?: boolean | false,
                          private _showToggleButton?: boolean | false) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
    }
}
