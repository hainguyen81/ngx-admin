import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source';
import {AbstractComponent, IEvent} from '../abstract.component';
import {
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef, EventEmitter,
    Inject, Input, Output,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import ObjectUtils from '../../../utils/common/object.utils';

/**
 * Abstract Files Gallery component
 */
export abstract class AbstractFileGalleryComponent<T extends DataSource> extends AbstractComponent {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private isAllowModified: boolean;
    private _files: string[];
    private _extensions: string[];
    private _fileData: File[];
    @Output() onChange: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get all file data in collection
     * @return all file data in collection
     */
    public get fileData(): File[] {
        return this._fileData || [];
    }

    /**
     * Get all file extensions in collection
     * @return all file extensions in collection
     */
    @Input('allowFileExtensions') get allowFileExtensions(): string[] {
        return this._extensions || [];
    }

    /**
     * Set all file extensions in collection
     * @param _extensions to apply
     */
    set allowFileExtensions(_extensions: string[]) {
        this._extensions = _extensions || [];
    }

    /**
     * Get all file names in collection
     * @return all file names in collection
     */
    @Input('files') get files(): string[] {
        return this._files || [];
    }

    /**
     * Set all file names in collection
     * @param _files to apply
     */
    set files(_files: string[]) {
        this._files = _files || [];
    }

    /**
     * Add files to collection
     * @param _files to apply
     */
    public addFiles(_files: File[]): void {
        this._fileData = (this._fileData || []).concat(_files || []);
        this._fileData.forEach(f => {
            this.supportedFile(f) && this.files.push(f.name);
        });
        this.onChange && this.onChange.emit({data: this.files});
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
     * Get a boolean value indicating the specified {File} whether is supported
     * @param f to check
     */
    protected supportedFile(f: File): boolean {
        const fileExt: string = (ObjectUtils.isNou(f) ? '' : f.name.split('.').pop().toLowerCase());
        return (!this.allowFileExtensions.length || this.allowFileExtensions.indexOf(fileExt) >= 0);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractFileGalleryComponent} class
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
     * Remove the specified file out of album
     * @param file to remove
     */
    public removeFile(file: string): void {
        file = (file || '');

        // remove file name
        let fired: boolean = false;
        let fileNameIdx: number = this.files.indexOf(file);
        fired = (fileNameIdx >= 0);
        fired && this.files.splice(fileNameIdx, 1);

        // remove file data if necessary
        fileNameIdx = -1;
        const fileData: File[] = this.fileData || [];
        for (let idx: number = 0; idx < fileData.length; idx++) {
            if (fileData[idx].name.toLowerCase() === file.toLowerCase()) {
                fileNameIdx = idx;
                break;
            }
        }
        fired = (fileNameIdx >= 0);
        fired && this.fileData.splice(fileNameIdx, 1);
        fired && this.onChange && this.onChange.emit({data: this.files});
    }

    /**
     * Remove the specified file out of album
     * @param file to remove
     */
    public removeFileData(file: File): void {
        if (ObjectUtils.isNou(file)) return;
        this.removeFile(file.name);
    }
}
