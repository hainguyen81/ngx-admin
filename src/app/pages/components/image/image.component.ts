import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {Lightbox} from 'ngx-lightbox';
import {AbstractImageGalleryComponent} from './abstract.image.component';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {IEvent} from '../abstract.component';
import {AppConfig} from '../../../config/app.config';
import {Util} from 'leaflet';
import isArray = Util.isArray;

export const SUPPORTED_IMAGE_FILE_EXTENSIONS: string[] = AppConfig.COMMON.imageFileExtensions;

/**
 * Warehouse Category Image field component base on {FieldType}
 */
@Component({
    selector: 'ngx-image-gallery',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
})
export class NgxImageGalleryComponent extends AbstractImageGalleryComponent<DataSource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {ImageGalleryComponent} class
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
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
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
        files = (e && e.$event && e.$event.target && e.$event.target['files'] ? e.$event.target['files'] : []);
        if ((files || []).length) {
            let invalidFiles: string[];
            invalidFiles = [];
            let readFiles: Promise<string>[];
            readFiles = [];
            Array.of(...files).forEach(f => {
                let fileName: string;
                fileName = (f || {})['name'] || '';
                let fileExt: string;
                fileExt = fileName.split('.').pop().toLowerCase();
                if (SUPPORTED_IMAGE_FILE_EXTENSIONS.indexOf(fileExt) < 0) {
                    fileName.length && invalidFiles.push(fileName);

                } else {
                    readFiles.push(this.readFile(f));
                }
            });

            // read all files asynchronous
            Promise.all(readFiles).then(values => {
                this.setImages(values);
                invalidFiles.length && this.processUnsupportedFiles(invalidFiles);

            }, (errFile) => {
                if (!isArray(errFile)) {
                    errFile = [errFile];
                }
                invalidFiles = invalidFiles.concat(Array.from(errFile));
                invalidFiles.length && this.processUnsupportedFiles(invalidFiles);
            });
        }
    }

    /**
     * Process the specified unsupported file names
     * @param unsupportedFiles to process
     */
    protected processUnsupportedFiles(unsupportedFiles: string[]) {
        this.getLogger().error('Not support these files', unsupportedFiles);
    }

    /**
     * Read the specified {File} as base64
     * @param f to read
     * @param retImages returned images list
     */
    private readFile(f: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                let reader: FileReader;
                reader = new FileReader();
                reader.readAsDataURL(f); // read file as data url
                reader.onload = (event) => { // called once readAsDataURL is completed
                    resolve.apply(this, [reader.result.toString()]);
                };
            } catch (e) {
                this.getLogger().error('Could not read file {' + f.name + '}', e);
                reject.apply(this, [f.name]);
            }
        });
    }
}
