import {FieldType} from '@ngx-formly/material';
import {Component, Inject, OnInit} from '@angular/core';
import {IEvent} from '../../../abstract.component';

/**
 * Warehouse Category Image field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-warehouse-category-image',
    templateUrl: './warehouse.category.image.component.html',
    styleUrls: ['./warehouse.category.image.component.scss'],
})
export class WarehouseCategoryImageFormFieldComponent extends FieldType
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
