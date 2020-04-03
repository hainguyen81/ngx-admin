import {AbstractComponent, IEvent} from '../../../abstract.component';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {
    ChangeDetectorRef, Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {AppConfig} from '../../../../../config/app.config';
import {IAlbum, Lightbox} from 'ngx-lightbox';

export const SUPPORTED_IMAGE_FILE_EXTENSIONS: string[] = AppConfig.COMMON.imageFileExtensions;

@Component({
    selector: 'ngx-warehouse-item-summary',
    templateUrl: './warehouse.item.summary.component.html',
    styleUrls: ['./warehouse.item.summary.component.scss'],
})
export class WarehouseItemSummaryComponent extends AbstractComponent {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private dataModel: IWarehouseItem;
    private isChanged: boolean | false;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating the data model whether has been changed
     * @return true for changed; else
     */
    public hasChanged(): boolean {
        return this.isChanged;
    }

    /**
     * Get the data model
     * @return the data model
     */
    public getDataModel(): IWarehouseItem {
        return this.dataModel;
    }

    /**
     * Set the data model
     * @param dataModel to apply
     */
    public setDataModel(dataModel: IWarehouseItem): void {
        this.dataModel = dataModel;
    }

    /**
     * Get the first image data of data model
     * @return the first image data of data model
     */
    public getDataModelImage(): string {
        return (this.getDataModelImages().length ? this.getDataModelImages()[0] : null);
    }

    /**
     * Get the images data of data model
     * @return the images data of data model
     */
    public getDataModelImages(): string[] {
        return (this.getDataModel() ? this.getDataModel().image : null) || [];
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemSummaryComponent} class
     * @param dataSource {WarehouseItemDatasource}
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
    constructor(@Inject(WarehouseItemDatasource) dataSource: WarehouseItemDatasource,
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
            renderer, translateService, factoryResolver, viewContainerRef,
            changeDetectorRef, elementRef, modalDialogService, confirmPopup, lightbox);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Raise while changing the images list of the data model
     * @param e {IEvent} with $data as images list
     */
    protected onChange(e: IEvent): void {
        this.isChanged = true;
        if (this.getDataModel()) {
            this.getDataModel().image = e.$data;
        }
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Raise when selecting the uploaded files
     * @param e event with $event as {Event}
     */
    protected onSelectFile(e: IEvent) {
        if (!this.getDataModel()) {
            this.showError('warehouse.item.title', 'common.toast.unknown');
            return;
        }

        let files: File[];
        files = (e && e.$event && e.$event.target && e.$event.target['files'] ? e.$event.target['files'] : []);
        if ((files || []).length) {
            let invalidFiles: string[];
            invalidFiles = [];
            Array.of(...files).forEach(f => {
                let fileName: string;
                fileName = (f || {})['name'] || '';
                let fileExt: string;
                fileExt = fileName.split('.').pop().toLowerCase();
                if (SUPPORTED_IMAGE_FILE_EXTENSIONS.indexOf(fileExt) < 0) {
                    fileName.length && invalidFiles.push(fileName);
                } else {
                    this.readFile(f);
                }
            });
            if (invalidFiles.length) {
                let notSupFiles: string;
                notSupFiles = invalidFiles.join('<br/>');
                this.getTranslateService().get(
                    'warehouse.item.summary.not_supported_files',
                    {'files': notSupFiles})
                    .subscribe(message => this.showWarning('warehouse.item.title', message));
            }
        }
    }

    /**
     * Read the specified {File} as base64
     * @param f to read
     */
    private readFile(f: File): void {
        try {
            let reader: FileReader;
            reader = new FileReader();
            reader.readAsDataURL(f); // read file as data url
            reader.onload = (event) => { // called once readAsDataURL is completed
                if (!(this.getDataModel().image || []).length) {
                    this.getDataModel().image = [];
                }
                this.getDataModel().image.push(reader.result.toString());
            };
        } catch (e) {
            this.getLogger().error('Could not read file {' + f.name + '}', e);
        }
    }

    /**
     * Open images lightbox
     * @param currentImage to show
     */
    public showLightbox(currentImage?: string): void {
        let images: string[];
        images = this.getDataModelImages();
        if ((images || []).length) {
            let album: IAlbum[];
            album = [];
            Array.of(...images).forEach(image => {
                album.push({src: image, thumb: image});
            });
            let imageIndex: number;
            imageIndex = Math.max(images.indexOf(currentImage), 0);
            super.openLightbox(album, imageIndex);
        }
    }
}
