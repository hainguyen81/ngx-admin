import {FieldType} from '@ngx-formly/material';
import {Component, OnInit} from '@angular/core';
import {IEvent} from '../abstract.component';

/**
 * Warehouse Category Image field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-image-field',
    templateUrl: './formly.image.field.html',
    styleUrls: ['./formly.image.field.scss'],
})
export class ImageGalleryFormFieldComponent extends FieldType
    implements OnInit {

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

    ngOnInit(): void {
        this.formControl && this.formControl.patchValue(value => {
            this.value = (Array.isArray(value) ? value as string[] : value ? [ value ] : []);
        });
        if (!this.formControl) {
            this.value = [];
        }
    }
}
