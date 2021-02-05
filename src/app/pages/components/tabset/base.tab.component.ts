import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, Type, ViewContainerRef} from '@angular/core';
import {DataSource} from '@app/types/index';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {NgxTabset2Component} from './tab.component';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import ArrayUtils from '@app/utils/common/array.utils';
import ObjectUtils from '@app/utils/common/object.utils';
import NumberUtils from '@app/utils/common/number.utils';
import AssertUtils from '@app/utils/common/assert.utils';

/**
 * Base horizontal split-pane component base on {NbTabsetModule}
 */
@Component({
    selector: 'ngx-tabset-2',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss'],
})
export class BaseTabset2Component<T extends DataSource> extends NgxTabset2Component {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {BaseTabsetComponent} class
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
    constructor(@Inject(DataSource) dataSource: T,
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

    /**
     * Create the tab component dynamically
     * @param tabIndex the tab index
     * @param componentType component type
     * @return created component
     */
    protected setTabComponent(tabIndex: number, componentType: Type<any>): any {
        const viewContainerRef: ViewContainerRef = ArrayUtils.get<ViewContainerRef>(
            this.tabContentHolderViewContainerComponents, tabIndex);
        AssertUtils.isTrueValue(
            (ObjectUtils.isNotNou(viewContainerRef) && NumberUtils.isNumber(tabIndex)
            && 0 <= tabIndex && tabIndex < this.numberOfTabs
            && 0 <= tabIndex && tabIndex < ArrayUtils.lengthOf(this.tabsComponent)),
            'Could not create tab component at the invalid index tab (' + tabIndex + ')');
        return super.createComponentAt(viewContainerRef, componentType);
    }

    /**
     * Create the front component dynamically
     * @param componentType front component type
     * @return created component
     */
    protected setToolbarComponent(componentType: Type<any>): any {
        const viewContainerRef: ViewContainerRef = this.headerViewContainerComponent;
        return (viewContainerRef ? super.createComponentAt(viewContainerRef, componentType) : undefined);
    }
}
