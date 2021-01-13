import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
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
import { AbstractComponent } from '../abstract.component';
import ObjectUtils from '../../../utils/common/object.utils';
import { throwError } from 'rxjs';

/**
 * Flip-card base on {NbFlipCardComponent}
 */
@Component({
    selector: 'ngx-flip-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './flipcard.component.html',
    styleUrls: ['./flipcard.component.scss'],
})
export class NgxFlipCardComponent<
    H extends AbstractComponent, F extends AbstractComponent, B extends AbstractComponent>
    extends AbstractFlipcardComponent<DataSource, H, F, B>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

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
            undefined, undefined, undefined,
            false, false);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this._headerViewContainerRef) {
            this._headerViewContainerRef = ComponentUtils.queryComponent(this.queryHeaderViewContainerRef);
        }
        if (!this._cardFrontComponentHolderViewContainerRef) {
            this._cardFrontComponentHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryCardFrontComponentHolderViewContainerRef);
        }
        if (!this._cardBackComponentHolderViewContainerRef) {
            this._cardBackComponentHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryCardBackComponentHolderViewContainerRef);
        }

        if (!this._frontComponentHolderViewContainerRef) {
            this._frontComponentHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryFrontComponentHolderViewContainerRef);
        }
        if (!this._backComponentHolderViewContainerRef) {
            this._backComponentHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryBackComponentHolderViewContainerRef);
        }

        console.log([
            'queryHeaderViewContainerRef', this.queryHeaderViewContainerRef,
            '_headerViewContainerRef', this._headerViewContainerRef,
            'queryCardFrontComponentHolderViewContainerRef', this.queryCardFrontComponentHolderViewContainerRef,
            '_cardFrontComponentHolderViewContainerRef', this._cardFrontComponentHolderViewContainerRef,
            'queryCardBackComponentHolderViewContainerRef', this.queryCardBackComponentHolderViewContainerRef,
            '_cardBackComponentHolderViewContainerRef', this._cardBackComponentHolderViewContainerRef,
            'queryFrontComponentHolderViewContainerRef', this.queryFrontComponentHolderViewContainerRef,
            '_frontComponentHolderViewContainerRef', this._frontComponentHolderViewContainerRef,
            'queryBackComponentHolderViewContainerRef', this.queryBackComponentHolderViewContainerRef,
            '_backComponentHolderViewContainerRef', this._backComponentHolderViewContainerRef
        ]);
    }

    /**
     * Raise when the flip header component has been created
     * @param componentRef the flip header component reference
     */
    protected onHeaderComponentCreated(componentRef: ComponentRef<H>): void {
        console.log(['onHeaderComponentCreated', componentRef]);
        (componentRef && componentRef.instance) || throwError('Could not inject dynamic header component!');
        this._flipHeaderComponent = componentRef.instance;
    }

    /**
     * Raise when the flip front component has been created
     * @param componentRef the flip front component reference
     */
    protected onFrontComponentCreated(componentRef: ComponentRef<F>): void {
        console.log(['onFrontComponentCreated', componentRef]);
        (componentRef && componentRef.instance) || throwError('Could not inject dynamic front component!');
        this._flipFrontComponent = componentRef.instance;
    }

    /**
     * Raise when the flip back component has been created
     * @param componentRef the flip header component reference
     */
    protected onBackComponentCreated(componentRef: ComponentRef<B>): void {
        console.log(['onBackComponentCreated', componentRef]);
        (componentRef && componentRef.instance) || throwError('Could not inject dynamic back component!');
        this._flipBackComponent = componentRef.instance;
    }
}
