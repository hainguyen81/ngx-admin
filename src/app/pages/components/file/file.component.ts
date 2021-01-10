import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {Lightbox} from 'ngx-lightbox';
import {DataSource} from '@app/types/index';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {IEvent} from '../abstract.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractFileGalleryComponent} from './abstract.file.component';
import ObjectUtils from '../../../utils/common/object.utils';

/**
 * Files Gallery component
 */
@Component({
    selector: 'ngx-file-gallery',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.scss'],
})
export class NgxFileGalleryComponent extends AbstractFileGalleryComponent<DataSource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NgxFileGalleryComponent} class
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
            router, activatedRoute);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Raise when selecting the uploaded files
     * @param e event with $event as {Event}
     */
    protected onSelectFile(e: IEvent) {
        let files: File[];
        files = (e && e.event && e.event.target && ObjectUtils.any(e.event.target)['files']
            ? ObjectUtils.any(e.event.target)['files'] : []);
        if ((files || []).length) {
            const invalidFiles: string[] = [];
            Array.of(...files).forEach(f => {
                let fileName: string;
                fileName = (f || {})['name'] || '';
                if (!this.supportedFile(f)) {
                    fileName.length && invalidFiles.push(fileName);

                } else {
                    fileName.length && this.files.push(fileName);
                    f && this.fileData.push(f);
                }
            });
            this.onChange && this.onChange.emit({data: this.files});
            invalidFiles.length && this.processUnsupportedFiles(invalidFiles);
        }
    }

    /**
     * Process the specified unsupported file names
     * @param unsupportedFiles to process
     */
    protected processUnsupportedFiles(unsupportedFiles: string[]) {
        this.getLogger().error('Not support these files', unsupportedFiles);
    }
}
