import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent} from '../abstract.component';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    Inject,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/component.utils';
import {NbCardBackComponent, NbCardFrontComponent, NbRevealCardComponent} from '@nebular/theme';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';

/**
 * Abstract RevealCard component base on {NbRevealCardComponent}
 */
export abstract class AbstractRevealcardComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    protected static REVEALCARD_ELEMENT_SELECTOR: string = 'nb-reveal-card';
    protected static REVEALCARD_FRONT_ELEMENT_SELECTOR: string = 'nb-card-front';
    protected static REVEALCARD_BACK_ELEMENT_SELECTOR: string = 'nb-card-back';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NbRevealCardComponent)
    private readonly queryRevealcardComponent: QueryList<NbRevealCardComponent>;
    private revealcardComponent: NbRevealCardComponent;

    @ViewChildren(NbCardFrontComponent)
    private readonly queryRevealcardFrontComponent: QueryList<NbCardFrontComponent>;
    private revealcardFontComponent: NbCardFrontComponent;

    @ViewChildren(NbCardBackComponent)
    private readonly queryRevealcardBackComponent: QueryList<NbCardBackComponent>;
    private revealcardBackComponent: NbCardBackComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NbRevealCardComponent} instance
     * @return the {NbRevealCardComponent} instance
     */
    protected getRevealcardComponent(): NbRevealCardComponent {
        return this.revealcardComponent;
    }

    /**
     * Get the {NbCardFrontComponent} instance
     * @return the {NbCardFrontComponent} instance
     */
    protected getRevealcardFrontComponent(): NbCardFrontComponent {
        return this.revealcardFontComponent;
    }

    /**
     * Get the {NbCardBackComponent} instance
     * @return the {NbCardBackComponent} instance
     */
    protected getRevealcardBackComponent(): NbCardBackComponent {
        return this.revealcardBackComponent;
    }

    /**
     * Set a boolean value indicating this component whether is revealed
     * @param revealed true for revealed; else false
     */
    public setRevealed(revealed?: boolean): void {
        this.revealed = revealed || false;
        if (this.getRevealcardComponent()) {
            this.getRevealcardComponent().revealed = this.revealed;
        }
    }

    /**
     * Set a boolean value indicating this component whether shows the toggle button to reveal
     * @param showToggleButton true for shown; else false
     */
    public setShowToggleButton(showToggleButton?: boolean): void {
        this.showToggleButton = showToggleButton || false;
        if (this.getRevealcardComponent()) {
            this.getRevealcardComponent().showToggleButton = this.showToggleButton;
        }
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractRevealcardComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     * @param revealed specify the component whether had been revealed
     * @param showToggleButton specify whether showing toggle button to reveal
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
                          @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                          @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                          private revealed?: boolean | false,
                          private showToggleButton?: boolean | false) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef,
            modalDialogService, confirmPopup);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.revealcardComponent) {
            this.revealcardComponent = ComponentUtils.queryComponent(this.queryRevealcardComponent);
        }
        if (!this.revealcardFontComponent) {
            this.revealcardFontComponent = ComponentUtils.queryComponent(this.queryRevealcardFrontComponent);
        }
        if (!this.revealcardBackComponent) {
            this.revealcardBackComponent = ComponentUtils.queryComponent(this.queryRevealcardBackComponent);
        }
    }
}
