import {
    AfterViewInit, ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {IEvent} from '../abstract.component';
import {AbstractFieldType} from '../abstract.fieldtype';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Formly Image field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-image-field',
    templateUrl: './formly.image.field.component.html',
    styleUrls: ['./formly.image.field.component.scss'],
})
export class ImageGalleryFormFieldComponent extends AbstractFieldType
    implements OnInit, AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get field value as image sources
     * @return image sources
     */
    public getImages(): string[] {
        return (Array.isArray(this.value) ? this.value as string[] : []);
    }

    /**
     * Raises while images have been changed
     * @param e {IEvent} as $data is images list
     */
    public onChange(e: IEvent): void {
        this.value = e.data || [];
        this.formControl && this.formControl.setValue(this.value);
    }

    public get allowModified(): boolean {
        return !this.field || !this.field.formControl || !this.field.formControl.disabled;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {ImageGalleryFormFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        this.formControl && this.formControl.patchValue(value => {
            this.value = (Array.isArray(value) ? value as string[] : value ? [ value ] : []);
        });
        if (!this.formControl) {
            this.value = [];
        }
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.field.className = [(this.field.className || ''),
            'form-field form-images-gallery-file'].join(' ').trim();
    }
}
