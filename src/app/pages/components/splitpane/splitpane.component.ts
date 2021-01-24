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
import {AbstractSplitpaneComponent} from './abstract.splitpane.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/common/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {SplitAreaDirective, SplitComponent} from 'angular-split';
import FunctionUtils from '@app/utils/common/function.utils';
import ObjectUtils from '@app/utils/common/object.utils';

/**
 * SplitPane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './splitpane.component.html',
    styleUrls: ['./splitpane.component.scss'],
})
export class NgxSplitPaneComponent extends AbstractSplitpaneComponent<DataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(SplitComponent)
    private readonly querySplitComponent: QueryList<SplitComponent>;
    private __splitComponent: SplitComponent;

    @ViewChildren(SplitAreaDirective)
    private readonly querySplitAreaDirectiveComponents: QueryList<SplitAreaDirective>;
    private __splitAreas: SplitAreaDirective[];

    @ViewChildren('splitAreaHolder', {read: ViewContainerRef})
    private readonly querySplitAreaHolderViewContainerRefs: QueryList<ViewContainerRef>;
    private splitAreaHolderViewContainerRefs: ViewContainerRef[];

    @ViewChildren('headerHolder', {read: ViewContainerRef})
    private readonly queryHeaderViewContainerRef: QueryList<ViewContainerRef>;
    private headerViewContainerRef: ViewContainerRef;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {SplitComponent} instance
     * @return the {SplitComponent} instance
     */
    protected get splitComponent(): SplitComponent {
        return this.__splitComponent;
    }

    /**
     * Get the {SplitAreaDirective} instances array
     * @return the {SplitAreaDirective} instances array
     */
    protected get splitAreaComponents(): SplitAreaDirective[] {
        return this.__splitAreas;
    }

    /**
     * Get a boolean value indicating whether showing panel header
     * @return true (default) for showing; else false
     */
    get showHeader(): boolean {
        return true;
    }

    /**
     * Get the {ViewContainerRef} instance of header panel
     * @return the {ViewContainerRef} instance of header panel
     */
    protected getHeaderViewContainerComponent(): ViewContainerRef {
        return this.headerViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instances array of {SplitAreaDirective}
     * @return the {ViewContainerRef} instances array of {SplitAreaDirective}
     */
    protected getSplitAreaHolderViewContainerComponents(): ViewContainerRef[] {
        return this.splitAreaHolderViewContainerRefs;
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
            1, false);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.headerViewContainerRef = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.headerViewContainerRef),
            () => ComponentUtils.queryComponent(this.queryHeaderViewContainerRef),
            this, this.headerViewContainerRef);
        this.splitAreaHolderViewContainerRefs = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.splitAreaHolderViewContainerRefs),
            () => ComponentUtils.queryComponents(this.querySplitAreaHolderViewContainerRefs),
            this, this.splitAreaHolderViewContainerRefs);
        this.__splitComponent = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__splitComponent),
            () => ComponentUtils.queryComponent(this.querySplitComponent),
            this, this.__splitComponent);
        this.__splitAreas = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__splitAreas),
            () => ComponentUtils.queryComponents(this.querySplitAreaDirectiveComponents),
            this, this.__splitAreas);
    }
}
