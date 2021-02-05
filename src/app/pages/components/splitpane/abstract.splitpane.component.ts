import {DataSource} from '@app/types/index';
import {AbstractComponent, IEvent} from '../abstract.component';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, ViewContainerRef} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {SplitAreaDirective, SplitComponent} from 'angular-split';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import ArrayUtils from '@app/utils/common/array.utils';
import AssertUtils from '@app/utils/common/assert.utils';

/* Split area configuration */
export interface ISplitAreaConfig {
    size?: number | null;
    minSize?: number | null;
    maxSize?: number | null;
    lockSize?: boolean | false;
    visible?: boolean | true;
}

/**
 * Abstract SplitPane component base on {AngularSplitModule}
 */
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
export abstract class AbstractSplitpaneComponent<T extends DataSource> extends AbstractComponent {

    protected static SPLIT_ELEMENT_SELECTOR: string = 'as-split';
    protected static SPLIT_AREA_ELEMENT_SELECTOR: string = 'as-split-area';
    protected static SPLIT_GUTTER_ELEMENT_SELECTOR: string = '.as-split-gutter';

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {SplitComponent} instance
     * @return the {SplitComponent} instance
     */
    protected abstract get splitComponent(): SplitComponent;

    /**
     * Get the {SplitAreaDirective} instances array
     * @return the {SplitAreaDirective} instances array
     */
    protected abstract get splitAreaComponents(): SplitAreaDirective[];

    /**
     * Get a boolean value indicating this component whether is splitted by horizontal direction
     * @return true for horizontal direction; else false
     */
    public get isHorizontal(): boolean {
        return this.horizontal;
    }

    /**
     * Get the number of split-area
     * @return the number of split-area
     */
    public get numberOfAreas(): number {
        return this.numOfAreas;
    }

    /**
     * Set the number of split-area
     * @param numOfAreas the number of split-area
     */
    protected setNumberOfAreas(numOfAreas: number): void {
        this.numOfAreas = numOfAreas;
    }

    /**
     * Set a boolean value indicating this component whether is splitted by horizontal direction
     * @param horizontal true for horizontal; else false
     */
    public setHorizontal(horizontal?: boolean): void {
        this.horizontal = horizontal || false;
        if (this.splitComponent) {
            this.splitComponent.direction = (this.horizontal ? 'horizontal' : 'vertical');
        }
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractComponent} class
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
     * @param numberOfAreas the number of split-area
     * @param horizontal true for horizontal; else vertical
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
                          private numOfAreas?: number | 1,
                          private horizontal?: boolean | false) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        AssertUtils.isTrueValue((numOfAreas > 0), 'The number of split-area must be equals or greater than 0');
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Perform resize areas
     * @param event {IEvent} that contains {$data} as Object, consist of: unit, {sizes}
     */
    onDragEnd(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDragEnd', event);
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Configure the specified area
     * @param area to config
     * @param config to apply
     */
    protected configArea(area: SplitAreaDirective, config: ISplitAreaConfig): void {
        if (!area || !config) {
            return;
        }

        area.size = config.size;
        area.minSize = config.minSize;
        area.maxSize = config.maxSize;
        area.lockSize = config.lockSize;
        area.visible = config.visible;
    }

    /**
     * Configure the specified area
     * @param areaIndex to config
     * @param config to apply
     */
    protected configAreaByIndex(areaIndex: number, config: ISplitAreaConfig): void {
        this.configArea(ArrayUtils.get<SplitAreaDirective>(this.splitAreaComponents, areaIndex), config);
    }
}
