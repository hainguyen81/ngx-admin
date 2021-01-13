import {
    AfterViewInit,
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

/**
 * SplitPane component base on {NbTabsetModule}
 */
@Component({
    selector: 'ngx-tabset',
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
    private tabContentHolderViewContainerRefs: ViewContainerRef[];

    @ViewChildren('headerHolder', {read: ViewContainerRef})
    private readonly queryHeaderViewContainerRef: QueryList<ViewContainerRef>;
    private headerViewContainerRef: ViewContainerRef;

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
    isShowHeader(): boolean {
        return false;
    }

    /**
     * Get the {ViewContainerRef} instance of header panel
     * @return the {ViewContainerRef} instance of header panel
     */
    protected getHeaderViewContainerComponent(): ViewContainerRef {
        return this.headerViewContainerRef;
    }

    /**
     * Get the {ViewContainerRef} instances array of {NbTabComponent}
     * @return the {ViewContainerRef} instances array of {NbTabComponent}
     */
    protected getTabContentHolderViewContainerComponents(): ViewContainerRef[] {
        return this.tabContentHolderViewContainerRefs;
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

        if (!this.headerViewContainerRef) {
            this.headerViewContainerRef = ComponentUtils.queryComponent(this.queryHeaderViewContainerRef);
        }
        if (!this.tabContentHolderViewContainerRefs || !this.tabContentHolderViewContainerRefs.length) {
            this.tabContentHolderViewContainerRefs =
                ComponentUtils.queryComponents(this.queryTabContentHolderViewContainerRefs);
        }
        if (!this.__tabsetComponent) {
            this.__tabsetComponent = ComponentUtils.queryComponent(this.queryTabsetComponent);
        }
        if (!this.__tabComponentViewContainerRefs || !this.__tabComponentViewContainerRefs.length) {
            this.__tabComponentViewContainerRefs = ComponentUtils.queryComponents(this.queryTabComponentViewContainerRefs);
        }
        if (!this.__tabsComponent || !this.__tabsComponent.length) {
            this.__tabsComponent = ComponentUtils.queryComponents(this.queryTabsComponent);
            if ((!this.__tabsComponent || !this.__tabsComponent.length) && this.__tabsetComponent) {
                this.__tabsComponent = ComponentUtils.queryComponents(this.__tabsetComponent.tabs);
            }
        }
    }
}
