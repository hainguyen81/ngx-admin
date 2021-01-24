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
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/common/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {AbstractTabComponent} from './abstract.tab.component';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {NbTabComponent, NbTabsetComponent} from '@nebular/theme';
import ArrayUtils from '@app/utils/common/array.utils';
import FunctionUtils from '@app/utils/common/function.utils';
import ObjectUtils from '@app/utils/common/object.utils';

/**
 * SplitPane component base on {NbTabsetModule}
 */
@Component({
    selector: 'ngx-tabset',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss'],
})
export class NgxTabsetComponent extends AbstractTabComponent<DataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren('tabContentHolder', {read: ViewContainerRef})
    private readonly queryTabContentHolderViewContainerRefs: QueryList<ViewContainerRef>;
    private __tabContentHolderViewContainerRefs: ViewContainerRef[];

    @ViewChildren('headerHolder', {read: ViewContainerRef})
    private readonly queryHeaderViewContainerRef: QueryList<ViewContainerRef>;
    private __headerViewContainerRef: ViewContainerRef;

    @ViewChildren(NbTabsetComponent)
    private readonly queryTabsetComponent: QueryList<NbTabsetComponent>;
    private __tabsetComponent: NbTabsetComponent;

    @ViewChildren(NbTabComponent)
    private readonly queryTabsComponent: QueryList<NbTabComponent>;
    private __tabsComponent: NbTabComponent[];

    @ViewChildren('tabComponent', {read: ViewContainerRef})
    private readonly queryTabComponentViewContainerRefs: QueryList<ViewContainerRef>;
    private __tabComponentViewContainerRefs: ViewContainerRef[];

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NbTabsetComponent} instance
     * @return the {NbTabsetComponent} instance
     */
    protected get tabsetComponent(): NbTabsetComponent {
        return this.__tabsetComponent;
    }

    /**
     * Get the {NbTabComponent} instances array
     * @return the {NbTabComponent} instances array
     */
    protected get tabsComponent(): NbTabComponent[] {
        return this.__tabsComponent;
    }

    /**
     * Get a boolean value indicating whether showing panel header
     * @return true (default) for showing; else false
     */
    public get showHeader(): boolean {
        return false;
    }

    /**
     * Get the {ViewContainerRef} instance of header panel
     * @return the {ViewContainerRef} instance of header panel
     */
    protected get headerViewContainerComponent(): ViewContainerRef {
        return this.__headerViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instances array of {NbTabComponent}
     * @return the {ViewContainerRef} instances array of {NbTabComponent}
     */
    protected get tabContentHolderViewContainerComponents(): ViewContainerRef[] {
        return this.__tabContentHolderViewContainerRefs;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NgxTabsetComponent} class
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
            1, true, true);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // query components
        this.queryComponents();
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Query all necessary components via {@ViewChildren}
     */
    protected queryComponents(): void {
        this.__headerViewContainerRef = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__headerViewContainerRef),
            () => ComponentUtils.queryComponent(this.queryHeaderViewContainerRef),
            this, this.__headerViewContainerRef);
        this.__tabContentHolderViewContainerRefs = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__tabContentHolderViewContainerRefs),
            () => ComponentUtils.queryComponents(this.queryTabContentHolderViewContainerRefs),
            this, this.__tabContentHolderViewContainerRefs);
        this.__tabsetComponent = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__tabsetComponent),
            () => ComponentUtils.queryComponent(this.queryTabsetComponent),
            this, this.__tabsetComponent);
        this.__tabComponentViewContainerRefs = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__tabComponentViewContainerRefs),
            () => ComponentUtils.queryComponents(this.queryTabComponentViewContainerRefs),
            this, this.__tabComponentViewContainerRefs);
        this.__tabsComponent = FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__tabsComponent),
            () => ComponentUtils.queryComponents(this.queryTabsComponent),
            this, this.__tabsComponent);
        this.__tabsComponent = FunctionUtils.invokeTrue(
            ArrayUtils.isNotArrayOrEmpty(this.__tabsComponent) && ObjectUtils.isNotNou(this.__tabsetComponent),
            () => ComponentUtils.queryComponents(this.__tabsetComponent.tabs),
            this, this.__tabsComponent);
        console.log(['Query tab components',
            'NbTabComponent', this.__tabsComponent, 'Query', this.queryTabsComponent,
            'NbTabsetComponent', this.__tabsetComponent, 'Query', this.queryTabsetComponent,
            this.__tabComponentViewContainerRefs, this.__tabContentHolderViewContainerRefs]);
    }
}
