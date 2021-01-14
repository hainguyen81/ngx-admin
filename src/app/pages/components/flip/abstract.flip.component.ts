import {DataSource} from '@app/types/index';
import {AbstractComponent, IEvent} from '../abstract.component';
import {ChangeDetectorRef, ComponentFactoryResolver, ElementRef, EventEmitter, Inject, Input, Output, Renderer2, ViewContainerRef,} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {FlipComponent} from 'ngx-flip';

/**
 * Abstract Flip component base on {FlipComponent}
 */
export abstract class AbstractFlipComponent<T extends DataSource> extends AbstractComponent {

    protected static FLIP_ELEMENT_SELECTOR: string = 'ngx-flip';
    protected static FLIP_FRONT_ELEMENT_SELECTOR: string = 'ngx-flip [front]';
    protected static FLIP_BACK_ELEMENT_SELECTOR: string = 'ngx-flip [back]';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    // raise when flipping
    @Output() protected onFlipped: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {FlipComponent} instance
     * @return the {FlipComponent} instance
     */
    protected abstract get flipComponent(): FlipComponent;

    /**
     * Get a boolean value indicating this component whether is flipped
     * @return true for flipped; else false
     */
    @Input() get flipped(): boolean {
        return this._flipped;
    }
    /**
     * Set a boolean value indicating this component whether is flipped
     * @param flipped true for flipped; else false
     */
    set flipped(_flipped: boolean) {
        this._flipped = _flipped || false;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractFlipComponent} class
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
                          private _flipped?: boolean | false) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
    }
}
