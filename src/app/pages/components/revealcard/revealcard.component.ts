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
import {AbstractRevealcardComponent} from './abstract.revealcard.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/common/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {NbCardBackComponent, NbCardFrontComponent, NbRevealCardComponent} from '@nebular/theme';
import FunctionUtils from '@app/utils/common/function.utils';
import ObjectUtils from '@app/utils/common/object.utils';

/**
 * Reveal-card base on {NbRevealCardComponent}
 */
@Component({
    selector: 'ngx-reveal-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './revealcard.component.html',
    styleUrls: ['./revealcard.component.scss'],
})
export class NgxRevealCardComponent extends AbstractRevealcardComponent<DataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NbRevealCardComponent)
    private readonly queryRevealcardComponent: QueryList<NbRevealCardComponent>;
    private __revealcardComponent: NbRevealCardComponent;

    @ViewChildren(NbCardFrontComponent)
    private readonly queryRevealcardFrontComponent: QueryList<NbCardFrontComponent>;
    private __revealcardFrontComponent: NbCardFrontComponent;

    @ViewChildren(NbCardBackComponent)
    private readonly queryRevealcardBackComponent: QueryList<NbCardBackComponent>;
    private __revealcardBackComponent: NbCardBackComponent;

    @ViewChildren('cardFrontComponent', {read: ViewContainerRef})
    private readonly queryCardFrontComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private cardFrontComponentHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('frontComponent', {read: ViewContainerRef})
    private readonly queryFrontComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private frontComponentHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('cardBackComponent', {read: ViewContainerRef})
    private readonly queryCardBackComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private cardBackComponentHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('backComponent', {read: ViewContainerRef})
    private readonly queryBackComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private backComponentHolderViewContainerRef: ViewContainerRef;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NbRevealCardComponent} instance
     * @return the {NbRevealCardComponent} instance
     */
    protected get revealcardComponent(): NbRevealCardComponent {
        return this.__revealcardComponent;
    }

    /**
     * Get the {NbCardFrontComponent} instance
     * @return the {NbCardFrontComponent} instance
     */
    protected get revealcardFrontComponent(): NbCardFrontComponent {
        return this.__revealcardFrontComponent;
    }

    /**
     * Get the {NbCardBackComponent} instance
     * @return the {NbCardBackComponent} instance
     */
    protected get revealcardBackComponent(): NbCardBackComponent {
        return this.__revealcardBackComponent;
    }

    /**
     * Get the {ViewContainerRef} instance of the front component
     * @return the {ViewContainerRef} instance of the front component
     */
    protected getCardFrontComponentViewContainerRef(): ViewContainerRef {
        return this.cardFrontComponentHolderViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the front component
     * @return the {ViewContainerRef} instance of the front component
     */
    protected getFrontComponentViewContainerRef(): ViewContainerRef {
        return this.frontComponentHolderViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the back component
     * @return the {ViewContainerRef} instance of the back component
     */
    protected getCardBackComponentViewContainerRef(): ViewContainerRef {
        return this.cardBackComponentHolderViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the back component
     * @return the {ViewContainerRef} instance of the back component
     */
    protected getBackComponentViewContainerRef(): ViewContainerRef {
        return this.backComponentHolderViewContainerRef;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NgxRevealCardComponent} class
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

        this.__revealcardComponent = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__revealcardComponent),
            () => ComponentUtils.queryComponent(this.queryRevealcardComponent),
            this, this.__revealcardComponent);
        this.__revealcardFrontComponent = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__revealcardFrontComponent),
            () => ComponentUtils.queryComponent(this.queryRevealcardFrontComponent),
            this, this.__revealcardFrontComponent);
        this.__revealcardBackComponent = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__revealcardBackComponent),
            () => ComponentUtils.queryComponent(this.queryRevealcardBackComponent),
            this, this.__revealcardBackComponent);
        this.cardFrontComponentHolderViewContainerRef = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.cardFrontComponentHolderViewContainerRef),
            () => ComponentUtils.queryComponent(this.queryCardFrontComponentHolderViewContainerRef),
            this, this.cardFrontComponentHolderViewContainerRef);
        this.cardBackComponentHolderViewContainerRef = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.cardBackComponentHolderViewContainerRef),
            () => ComponentUtils.queryComponent(this.queryCardBackComponentHolderViewContainerRef),
            this, this.cardBackComponentHolderViewContainerRef);
        this.frontComponentHolderViewContainerRef = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.frontComponentHolderViewContainerRef),
            () => ComponentUtils.queryComponent(this.queryFrontComponentHolderViewContainerRef),
            this, this.frontComponentHolderViewContainerRef);
        this.backComponentHolderViewContainerRef = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.backComponentHolderViewContainerRef),
            () => ComponentUtils.queryComponent(this.queryBackComponentHolderViewContainerRef),
            this, this.backComponentHolderViewContainerRef);
    }
}
