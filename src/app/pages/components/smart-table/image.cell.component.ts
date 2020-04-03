import {Component, Inject} from '@angular/core';
import {DefaultEditor} from 'ng2-smart-table';

/**
 * Smart table image cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-image-cell',
    templateUrl: './image.cell.component.html',
    styleUrls: ['./image.cell.component.scss'],
})
export class ImageCellComponent extends DefaultEditor {
    value?: string[] | string | null;

    public getImages(): string[] {
        return (this.cell ? Array.isArray(this.cell.getValue())
            ? Array.from(this.cell.getValue()) : [ this.cell.getValue() || '' ]
            : Array.isArray(this.value) ? Array.from(this.value) : [ this.value || '' ]);
    }
}
