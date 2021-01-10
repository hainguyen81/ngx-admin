import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    forwardRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {AbstractCellEditor} from './abstract.cell.editor';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {CellComponent} from '@app/types/index';
import ObjectUtils from '../../../utils/common/object.utils';
import ArrayUtils from '../../../utils/common/array.utils';

/**
 * Smart table image cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-image-cell',
    templateUrl: './image.cell.component.html',
    styleUrls: ['./image.cell.component.scss'],
})
export class ImageCellComponent extends AbstractCellEditor
    implements AfterViewInit {

    private static DESCRIPTOR_PREPARE: string = 'descriptorPrepare';
    private static IMAGES_PREPARE: string = 'imagesPrepare';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _images: string[] = [];
    private _descriptor: string = '';

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    get images(): string[] {
        return this._images;
    }

    set images(_images: string[]) {
        this._images = _images;
    }

    get descriptor(): string {
        return this._descriptor;
    }

    set descriptor(_descriptor: string) {
        this._descriptor = _descriptor;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {ImageCellComponent} class
     * @param _parentCell {CellComponent}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(forwardRef(() => CellComponent)) _parentCell: CellComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_parentCell, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // observe images
        this.observeConfigProperty(ImageCellComponent.IMAGES_PREPARE)
            .subscribe(images => {
                if (ArrayUtils.isArray(images)) {
                    this.images = Array.from(images);

                } else if (ObjectUtils.isNotNou(images) && typeof images === 'string') {
                    this.images = [images];
                }
            });

        // observe descriptor
        this.observeConfigProperty(ImageCellComponent.DESCRIPTOR_PREPARE, false)
            .subscribe(descriptor => this.descriptor = descriptor || '');
    }
}
