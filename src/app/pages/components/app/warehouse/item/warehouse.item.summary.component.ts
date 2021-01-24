import {AbstractComponent, IEvent} from '../../../abstract.component';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnDestroy, Renderer2, ViewContainerRef} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {AppConfig} from '../../../../../config/app.config';
import {IAlbum, Lightbox} from 'ngx-lightbox';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import {ActivatedRoute, Router} from '@angular/router';
import ObjectUtils from '../../../../../utils/common/object.utils';
import {Subscription} from 'rxjs';
import FunctionUtils from '../../../../../utils/common/function.utils';
import PromiseUtils from '../../../../../utils/common/promise.utils';
import ArrayUtils from '@app/utils/common/array.utils';

export const SUPPORTED_IMAGE_FILE_EXTENSIONS: string[] = AppConfig.COMMON.imageFileExtensions;

@Component({
    moduleId: Constants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-warehouse-item-summary',
    templateUrl: './warehouse.item.summary.component.html',
    styleUrls: ['./warehouse.item.summary.component.scss'],
})
export class WarehouseItemSummaryComponent extends AbstractComponent
    implements OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private __dataModel: IWarehouseItem;
    private isChanged: boolean | false;
    private isVersion: boolean | false;

    private __translateSubscription: Subscription;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating the data model whether is item version
     * @return true for version; else false
     */
    get forVersion(): boolean {
        return this.isVersion;
    }

    /**
     * Set a boolean value indicating the data model whether is item version
     * @param isVersion true for version; else false
     */
    set forVersion(isVersion: boolean) {
        this.isVersion = isVersion;
    }

    /**
     * Get a boolean value indicating the data model whether has been changed
     * @return true for changed; else
     */
    get hasChanged(): boolean {
        return this.isChanged;
    }

    /**
     * Get the data model
     * @return the data model
     */
    get dataModel(): IWarehouseItem {
        return this.__dataModel;
    }

    /**
     * Set the data model
     * @param __dataModel to apply
     */
    set dataModel(__dataModel: IWarehouseItem) {
        this.__dataModel = __dataModel;
    }

    /**
     * Get the first image data of data model
     * @return the first image data of data model
     */
    public get dataModelImage(): string {
        return ArrayUtils.get<string>(this.dataModelImages, 0);
    }

    /**
     * Get the images data of data model
     * @return the images data of data model
     */
    public get dataModelImages(): string[] {
        return (this.dataModel ? this.dataModel.image : null) || [];
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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver, viewContainerRef,
            changeDetectorRef, elementRef, modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Raise while changing the images list of the data model
     * @param e {IEvent} with $data as images list
     */
    onChange(e: IEvent): void {
        this.isChanged = true;
        if (this.dataModel) {
            this.dataModel.image = e.data;
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__translateSubscription);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Raise when selecting the uploaded files
     * @param e event with $event as {Event}
     */
    protected onSelectFile(e: IEvent) {
        if (!this.dataModel) {
            this.showError('warehouse.item.title', 'common.toast.unknown');
            return;
        }

        let files: File[];
        files = (e && e.event && e.event.target && ObjectUtils.any(e.event.target)['files']
            ? ObjectUtils.any(e.event.target)['files'] : []);
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
                FunctionUtils.invokeTrue(
                    ObjectUtils.isNou(this.__translateSubscription),
                    () => this.__translateSubscription = this.getTranslateService().get(
                        'warehouse.item.summary.not_supported_files',
                        {'files': notSupFiles}).subscribe(message => this.showWarning('warehouse.item.title', message)),
                    this);
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
                if (!(this.dataModel.image || []).length) {
                    this.dataModel.image = [];
                }
                this.dataModel.image.push(reader.result.toString());
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
        const images: string[] = this.dataModelImages;
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
