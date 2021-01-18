import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    Output,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from '@app/types/index';
import {AbstractFlipComponent} from './abstract.flip.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/common/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {FlipComponent} from 'ngx-flip';
import FunctionUtils from '../../../utils/common/function.utils';
import ObjectUtils from '../../../utils/common/object.utils';
import {IEvent} from 'app/pages/components/abstract.component';

/**
 * Flip base on {FlipComponent}
 */
@Component({
    selector: 'ngx-flip-2',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './flip.component.html',
    styleUrls: ['./flip.component.scss'],
})
export class NgxFlipComponent extends AbstractFlipComponent<DataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(FlipComponent)
    private readonly queryFlipComponent: QueryList<FlipComponent>;
    private _flipComponent: FlipComponent;

    @ViewChildren('frontContainer', {read: ViewContainerRef})
    private readonly queryFrontContainerViewContainerRef: QueryList<ViewContainerRef>;
    private _frontContainerViewContainerRef: ViewContainerRef;

    @ViewChildren('frontComponent', {read: ViewContainerRef})
    private readonly queryFrontComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private _frontComponentHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('backContainer', {read: ViewContainerRef})
    private readonly queryBackContainerViewContainerRef: QueryList<ViewContainerRef>;
    private _backContainerViewContainerRef: ViewContainerRef;

    @ViewChildren('backComponent', {read: ViewContainerRef})
    private readonly queryBackComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private _backComponentHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('headerHolder', {read: ViewContainerRef})
    private readonly queryHeaderViewContainerRef: QueryList<ViewContainerRef>;
    private _headerViewContainerRef: ViewContainerRef;

    // raise when flipping
    private _flipped: boolean = false;
    @Output() protected onFlipped: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {FlipComponent} instance
     * @return the {FlipComponent} instance
     */
    protected get flipComponent(): FlipComponent {
        return this._flipComponent;
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
    protected get frontContainerViewContainerRef(): ViewContainerRef {
        return this._frontContainerViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the front component
     * @return the {ViewContainerRef} instance of the front component
     */
    protected get frontComponentHolderViewContainerRef(): ViewContainerRef {
        return this._frontComponentHolderViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the back component
     * @return the {ViewContainerRef} instance of the back component
     */
    protected get backContainerViewContainerRef(): ViewContainerRef {
        return this._backContainerViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the back component
     * @return the {ViewContainerRef} instance of the back component
     */
    protected get backComponentHolderViewContainerRef(): ViewContainerRef {
        return this._backComponentHolderViewContainerRef;
    }

    /**
     * Get a boolean value indicating whether showing panel header
     * @return true (default) for showing; else false
     */
    get isShowHeader(): boolean {
        return false;
    }

    /**
     * Get a boolean value indicating this component whether is flipped
     * @return true for flipped; else false
     */
    @Input() get flipped(): boolean {
        return this._flipped || false;
    }

    /**
     * Set a boolean value indicating this component whether is flipped
     * @param flipped true for flipped; else false
     */
    set flipped(_flipped: boolean) {
        if (this._flipped !== (_flipped || false)) {
            this._flipped = _flipped || false;
            this.onFlipped.emit({
                data: {
                    'front': this.frontComponentHolderViewContainerRef || this.frontContainerViewContainerRef,
                    'back': this.backComponentHolderViewContainerRef || this.backContainerViewContainerRef,
                    'flipped': this.flipped,
                },
            });
        }
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NgxFlipComponent} class
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

        this._flipComponent = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this._flipComponent),
            () => ComponentUtils.queryComponent(this.queryFlipComponent),
            this, this._flipComponent);
        this._headerViewContainerRef = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this._headerViewContainerRef),
            () => ComponentUtils.queryComponent(this.queryHeaderViewContainerRef),
            this, this._headerViewContainerRef);
        this._frontContainerViewContainerRef = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this._frontContainerViewContainerRef),
            () => ComponentUtils.queryComponent(this.queryFrontContainerViewContainerRef),
            this, this._frontContainerViewContainerRef);
        this._frontComponentHolderViewContainerRef = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this._frontComponentHolderViewContainerRef),
            () => ComponentUtils.queryComponent(this.queryFrontComponentHolderViewContainerRef),
            this, this._frontComponentHolderViewContainerRef);
        this._backContainerViewContainerRef = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this._backContainerViewContainerRef),
            () => ComponentUtils.queryComponent(this.queryBackContainerViewContainerRef),
            this, this._backContainerViewContainerRef);
        this._backComponentHolderViewContainerRef = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this._backComponentHolderViewContainerRef),
            () => ComponentUtils.queryComponent(this.queryBackComponentHolderViewContainerRef),
            this, this._backComponentHolderViewContainerRef);
    }
}
