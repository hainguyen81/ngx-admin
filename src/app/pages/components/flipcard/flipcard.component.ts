import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ContentChildren,
    ElementRef,
    Inject,
    QueryList,
    Renderer2, ViewChild,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractFlipcardComponent} from './abstract.flipcard.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {ComponentPlaceholderDirective} from '../component.placeholder.directive';

/**
 * Flip-card base on {NbFlipCardComponent}
 */
@Component({
    selector: 'ngx-flip-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './flipcard.component.html',
    styleUrls: ['./flipcard.component.scss'],
})
export class NgxFlipCardComponent extends AbstractFlipcardComponent<DataSource> implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

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

    @ViewChildren('ngxComponentPlaceholder', {read: ComponentPlaceholderDirective})
    private readonly queryComponentPlaceHolders: QueryList<ComponentPlaceholderDirective>;
    private componentPlaceHolders: ComponentPlaceholderDirective[];

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {ComponentPlaceholderDirective} instance of the front/back component
     * @return the {ComponentPlaceholderDirective} instance of the front/back component
     */
    protected getComponentPlaceHolders(): ComponentPlaceholderDirective[] {
        return this.componentPlaceHolders;
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
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup,
            false, false);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!(this.componentPlaceHolders || []).length) {
            this.componentPlaceHolders =
                ComponentUtils.queryComponents(this.queryComponentPlaceHolders);
        }

        if (!this.cardFrontComponentHolderViewContainerRef) {
            this.cardFrontComponentHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryCardFrontComponentHolderViewContainerRef);
        }
        if (!this.cardBackComponentHolderViewContainerRef) {
            this.cardBackComponentHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryCardBackComponentHolderViewContainerRef);
        }

        if (!this.frontComponentHolderViewContainerRef) {
            this.frontComponentHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryFrontComponentHolderViewContainerRef);
        }
        if (!this.backComponentHolderViewContainerRef) {
            this.backComponentHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryBackComponentHolderViewContainerRef);
        }
    }
}
