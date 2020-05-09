import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Host,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {isArray, isNullOrUndefined} from 'util';
import {CustomViewComponent} from 'ng2-smart-table/components/cell/cell-view-mode/custom-view.component';
import {AbstractCellEditor} from './abstract.cell.editor';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

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

    get isEditable(): boolean {
        return false;
    }

    get images(): string[] {
        return this._images;
    }

    get descriptor(): string {
        return this._descriptor;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {ImageCellComponent} class
     * @param _parentView {CustomViewComponent}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Host() _parentView: CustomViewComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_parentView, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        // observe images
        this.observeConfigProperty(ImageCellComponent.IMAGES_PREPARE)
            .subscribe(images => {
                if (isArray(images)) {
                    this._images = Array.from(images);

                } else if (!isNullOrUndefined(images) && typeof images === 'string') {
                    this._images = [images];
                }
            });

        // observe descriptor
        this.observeConfigProperty(ImageCellComponent.DESCRIPTOR_PREPARE, false)
            .subscribe(descriptor => this._descriptor = descriptor || '');
    }
}
