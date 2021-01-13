import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    Type,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from '@app/types/index';
import {NgxFlipCardComponent} from './flipcard.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import { AbstractComponent } from '../abstract.component';

/**
 * Base flip-card base on {NbFlipCardComponent}
 */
@Component({
    selector: 'ngx-flip-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './flipcard.component.html',
    styleUrls: ['./flipcard.component.scss'],
})
export class BaseFlipcardComponent<
    T extends DataSource,
    H extends AbstractComponent, F extends AbstractComponent, B extends AbstractComponent>
    extends NgxFlipCardComponent<H, F, B> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {BaseFlipcardComponent} class
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
     * @deprecated Create the front component dynamically
     * @param componentType front component type
     * @return created component
     */
    protected setToolbarComponent(componentType: Type<any>): any {
        const viewContainerRef: ViewContainerRef = this.headerViewContainerComponent;
        return (viewContainerRef ? super.createComponentAt(viewContainerRef, componentType) : undefined);
    }

    /**
     * @deprecated Create the front component dynamically
     * @param componentType front component type
     * @return created component
     */
    protected setFrontComponent(componentType: Type<any>): any {
        const viewContainerRef: ViewContainerRef = this.cardFrontComponentViewContainerRef || this.frontComponentViewContainerRef;
        return super.createComponentAt(viewContainerRef, componentType);
    }

    /**
     * @deprecated Create the back component dynamically
     * @param componentType back component type
     * @return created component
     */
    protected setBackComponent(componentType: Type<any>): any {
        const viewContainerRef: ViewContainerRef = this.cardBackComponentViewContainerRef || this.backComponentViewContainerRef;
        return super.createComponentAt(viewContainerRef, componentType);
    }
}
