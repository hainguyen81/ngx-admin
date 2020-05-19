import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractComponent, IEvent} from '../abstract.component';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef, EventEmitter,
    Inject, Input, Output,
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
import {IAlbum, Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';

/**
 * Abstract Image Gallery component base on {Lighbox}
 */
export abstract class AbstractImageGalleryComponent<T extends DataSource> extends AbstractComponent {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private isShowAlbum: boolean | true;
    private isOnlyPrimary: boolean | false;
    private isAllowModified: boolean | false;
    private _images: string[];
    @Output() onChange: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get all images in album
     * @return all images in album
     */
    protected getInternalImages(): string[] {
        if (!this._images) {
            this._images = [];
        }
        return this._images;
    }

    /**
     * Get all images in album
     * @return all images in album
     */
    @Input('images') get images(): string[] {
        return (!this.showAlbum ? [] : this.getInternalImages());
    }

    /**
     * Set all images in album
     * @param _images to apply
     */
    set images(_images: string[]) {
        this._images = _images || [];
        this.onChange && this.onChange.emit({data: this.images});
    }

    /**
     * Add images in album
     * @param images to apply
     */
    public addImages(images: string[]): void {
        this.images = (this.images || []).concat(images || []);
        this.onChange && this.onChange.emit({data: this.images});
    }

    /**
     * Get the first image to show as primary image
     * @return the first image to show as primary image
     */
    public getImage(): string {
        return (!(this.images || []).length ? null : this.images[0]);
    }

    /**
     * Get a boolean value indicating whether allows adding/deleting/modifying images
     */
    @Input('allowModified') get allowModified(): boolean {
        return this.isAllowModified;
    }

    /**
     * Set a boolean value indicating whether allows adding/deleting/modifying images
     * @param allowModified to apply
     */
    set allowModified(allowModified: boolean) {
        this.isAllowModified = allowModified;
    }

    /**
     * Get a boolean value indicating whether allows showing all images in album
     */
    @Input('showAlbum') get showAlbum(): boolean {
        return this.isShowAlbum;
    }

    /**
     * Set a boolean value indicating whether allows showing all images in album
     * @param showAlbum to apply
     */
    set showAlbum(showAlbum: boolean) {
        this.isShowAlbum = showAlbum;
    }

    /**
     * Get a boolean value indicating whether allows showing only primary image in album
     */
    @Input('onlyPrimary') get onlyPrimary(): boolean {
        return this.isOnlyPrimary;
    }

    /**
     * Set a boolean value indicating whether allows showing only primary image in album
     * @param isOnlyPrimary to apply
     */
    set onlyPrimary(isOnlyPrimary: boolean) {
        this.isOnlyPrimary = isOnlyPrimary;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractImageGalleryComponent} class
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

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Open images lightbox
     * @param currentImage to show
     */
    public showLightbox(currentImage?: string): void {
        super.openAlbumLightbox(this.images, currentImage);
    }

    /**
     * Remove the specified image out of album
     * @param image to remove
     */
    public removeImage(image: string): void {
        let images: string[];
        images = this.getInternalImages();
        if (!(images || []).length || images.indexOf(image) < 0) {
            return;
        }

        let imageIdx: number;
        imageIdx = images.indexOf(image);
        images.splice(imageIdx, 1);
        this.images = images;
    }
}
