import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, Input,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source';
import {AbstractPanelComponent} from './abstract.panel.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import ComponentUtils from '../../../utils/common/component.utils';

/**
 * Reveal-card base on {NbCardComponent}
 */
@Component({
    selector: 'ngx-card-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
})
export class NgxPanelComponent
    extends AbstractPanelComponent<DataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren('cardHeaderHolder', {read: ViewContainerRef})
    private readonly queryCardHeaderHolderViewContainerRef: QueryList<ViewContainerRef>;
    private _cardHeaderHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('cardBodyHolder', {read: ViewContainerRef})
    private readonly queryCardBodyHolderViewContainerRef: QueryList<ViewContainerRef>;
    private _cardBodyHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('cardFooterHolder', {read: ViewContainerRef})
    private readonly queryCardFooterHolderViewContainerRef: QueryList<ViewContainerRef>;
    private _cardFooterHolderViewContainerRef: ViewContainerRef;

    @Input('panelClass') panelClass: string;
    @Input('headerClass') headerClass: string;
    @Input('bodyClass') bodyClass: string;
    @Input('footerClass') footerClass: string;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {ViewContainerRef} instance of the front component
     * @return the {ViewContainerRef} instance of the front component
     */
    protected get cardHeaderViewContainerRef(): ViewContainerRef {
        return this._cardHeaderHolderViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the front component
     * @return the {ViewContainerRef} instance of the front component
     */
    protected get cardBodyViewContainerRef(): ViewContainerRef {
        return this._cardBodyHolderViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instance of the front component
     * @return the {ViewContainerRef} instance of the front component
     */
    protected get cardFooterViewContainerRef(): ViewContainerRef {
        return this._cardFooterHolderViewContainerRef;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NgxPanelComponent} class
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
            router, activatedRoute);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this._cardHeaderHolderViewContainerRef) {
            this._cardHeaderHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryCardHeaderHolderViewContainerRef);
        }
        if (!this._cardBodyHolderViewContainerRef) {
            this._cardBodyHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryCardBodyHolderViewContainerRef);
        }
        if (!this._cardFooterHolderViewContainerRef) {
            this._cardFooterHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryCardFooterHolderViewContainerRef);
        }
    }
}
