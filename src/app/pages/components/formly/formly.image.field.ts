import {Component, Inject, OnInit} from '@angular/core';
import {IEvent} from '../abstract.component';
import {AbstractFieldType} from '../abstract.fieldtype';
import {TranslateService} from '@ngx-translate/core';

/**
 * Formly Image field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-image-field',
    templateUrl: './formly.image.field.html',
    styleUrls: ['./formly.image.field.scss'],
})
export class ImageGalleryFormFieldComponent extends AbstractFieldType
    implements OnInit {

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
        this.value = e.$data || [];
        this.formControl && this.formControl.setValue(this.value);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {ImageGalleryFormFieldComponent} class
     * @param translateService {TranslateService}
     */
    constructor(@Inject(TranslateService) _translateService: TranslateService) {
        super(_translateService);
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
}
