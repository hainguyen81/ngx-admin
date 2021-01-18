import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, forwardRef, Inject, OnDestroy, Renderer2, ViewContainerRef} from '@angular/core';
import {AbstractCellEditor} from './abstract.cell.editor';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {CellComponent} from '@app/types/index';
import {Subscription} from 'rxjs';
import ArrayUtils from '../../../utils/common/array.utils';
import FunctionUtils from '../../../utils/common/function.utils';
import ObjectUtils from '../../../utils/common/object.utils';
import PromiseUtils from '../../../utils/common/promise.utils';

/**
 * Smart table image cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-image-cell',
    templateUrl: './image.cell.component.html',
    styleUrls: ['./image.cell.component.scss'],
})
export class ImageCellComponent extends AbstractCellEditor
    implements AfterViewInit, OnDestroy {

    private static DESCRIPTOR_PREPARE: string = 'descriptorPrepare';
    private static IMAGES_PREPARE: string = 'imagesPrepare';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _images: string[] = [];
    private _descriptor: string = '';

    private __imageSubscription: Subscription;
    private __descriptorSubscription: Subscription;

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
        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__imageSubscription),
            () => this.__imageSubscription = this.observeConfigProperty(ImageCellComponent.IMAGES_PREPARE)
            .subscribe(images => {
                if (ArrayUtils.isArray(images)) {
                    this.images = Array.from(images);

                } else if (ObjectUtils.isNotNou(images) && typeof images === 'string') {
                    this.images = [images];
                }
            }),
            this);


        // observe descriptor
        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__descriptorSubscription),
            () => this.__descriptorSubscription = this.observeConfigProperty(ImageCellComponent.DESCRIPTOR_PREPARE, false)
            .subscribe(descriptor => this.descriptor = descriptor || ''),
            this);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__imageSubscription);
        PromiseUtils.unsubscribe(this.__descriptorSubscription);
    }
}
