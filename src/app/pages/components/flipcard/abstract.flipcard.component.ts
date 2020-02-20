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
import {ToasterService} from 'angular2-toaster';
import ComponentUtils from '../../../utils/component.utils';
import {NbCardBackComponent, NbCardFrontComponent, NbFlipCardComponent} from '@nebular/theme';

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
    private flipcardFontComponent: NbCardFrontComponent;

    @ViewChildren(NbCardBackComponent)
    private readonly queryFlipcardBackComponent: QueryList<NbCardBackComponent>;
    private flipcardBackComponent: NbCardBackComponent;

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
        return this.flipcardFontComponent;
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
        this.flipped = flipped || false;
        if (this.getFlipcardComponent()) {
            this.getFlipcardComponent().flipped = this.flipped;
        }
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
     * Create a new instance of {AbstractComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToasterService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param flipped specify the component whether had been flipped
     * @param showToggleButton specify whether showing toggle button to flip
     */
    protected constructor(@Inject(DataSource) dataSource: T,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(ToasterService) toasterService: ToasterService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                          private flipped?: boolean | false,
                          private showToggleButton?: boolean | false) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.flipcardComponent) {
            this.flipcardComponent = ComponentUtils.queryComponent(this.queryFlipcardComponent);
        }
        if (!this.flipcardFontComponent) {
            this.flipcardFontComponent = ComponentUtils.queryComponent(this.queryFlipcardFrontComponent);
        }
        if (!this.flipcardBackComponent) {
            this.flipcardBackComponent = ComponentUtils.queryComponent(this.queryFlipcardBackComponent);
        }
    }
}
