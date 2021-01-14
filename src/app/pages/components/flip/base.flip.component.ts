import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, Type, ViewContainerRef,} from '@angular/core';
import {DataSource} from '@app/types/index';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxFlipComponent} from './flipcard.component';

/**
 * Base flip base on {FlipComponent}
 */
@Component({
    selector: 'ngx-flip-2',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './flip.component.html',
    styleUrls: ['./flip.component.scss'],
})
export class BaseFlipComponent<T extends DataSource> extends NgxFlipComponent {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {BaseFlipComponent} class
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
     * Create the front component dynamically
     * @param componentType front component type
     * @return created component
     */
    protected setToolbarComponent(componentType: Type<any>): any {
        const viewContainerRef: ViewContainerRef = this.headerViewContainerComponent;
        return (viewContainerRef ? super.createComponentAt(viewContainerRef, componentType) : undefined);
    }

    /**
     * Create the front component dynamically
     * @param componentType front component type
     * @return created component
     */
    protected setFrontComponent(componentType: Type<any>): any {
        const viewContainerRef: ViewContainerRef = this.frontComponentHolderViewContainerRef || this.frontContainerViewContainerRef;
        return (viewContainerRef ? super.createComponentAt(viewContainerRef, componentType) : undefined);
    }

    /**
     * Create the back component dynamically
     * @param componentType back component type
     * @return created component
     */
    protected setBackComponent(componentType: Type<any>): any {
        const viewContainerRef: ViewContainerRef = this.backComponentHolderViewContainerRef || this.backContainerViewContainerRef;
        return (viewContainerRef ? super.createComponentAt(viewContainerRef, componentType) : undefined);
    }
}
