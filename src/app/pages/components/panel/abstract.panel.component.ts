import {DataSource} from '@app/types/index';
import {AbstractComponent} from '../abstract.component';
import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, ViewContainerRef} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {NbCardBodyComponent, NbCardComponent, NbCardFooterComponent, NbCardHeaderComponent,} from '@nebular/theme';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';

/**
 * Abstract card component base on {NbCardComponent}
 */
@Component({})
export abstract class AbstractPanelComponent<T extends DataSource> extends AbstractComponent {

    protected static CARD_ELEMENT_SELECTOR: string = 'nb-card';
    protected static CARD_BODY_ELEMENT_SELECTOR: string = 'nb-card-body';
    protected static CARD_FOOTER_ELEMENT_SELECTOR: string = 'nb-card-footer';

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NbCardComponent} instance
     * @return the {NbCardComponent} instance
     */
    protected abstract get cardComponent(): NbCardComponent;

    /**
     * Get the {NbCardHeaderComponent} instance
     * @return the {NbCardHeaderComponent} instance
     */
    protected abstract get cardHeaderComponent(): NbCardHeaderComponent;

    /**
     * Get the {NbCardBodyComponent} instance
     * @return the {NbCardBodyComponent} instance
     */
    protected abstract get cardBodyComponent(): NbCardBodyComponent;

    /**
     * Get the {NbCardFooterComponent} instance
     * @return the {NbCardFooterComponent} instance
     */
    protected abstract get cardFooterComponent(): NbCardFooterComponent;

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractPanelComponent} class
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
                          @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
    }
}
